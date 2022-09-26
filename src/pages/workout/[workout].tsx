import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import HomeHeader from "../../components/homeHeader";
import SetHead from "../../components/setHead";
import { AddWorkoutModal } from "../../components/AddExerciseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useMemo } from "react";
import {
  ExerciseSet,
  ExerciseTemplate,
  User,
  WorkoutExercise,
} from "@prisma/client";
import { useSession } from "next-auth/react";
import { ExerciseItem } from "../../components/ExerciseItem";

type ExerciseItemType = WorkoutExercise & {
  ExerciseTemplate: ExerciseTemplate;
  ExerciseSets: ExerciseSet[];
};

const WorkoutPage: NextPage = () => {
  const router = useRouter();
  const { workout } = router.query;
  const workoutId = Number(workout?.slice(3, workout?.indexOf("&")));
  const name = workout ? workout.slice(workout?.indexOf("name=") + 5) : "";

  const [workoutItems, setWorkoutItems] = useState<ExerciseItemType[]>([]);
  const [workoutsRef] = useAutoAnimate<HTMLDivElement>();
  const [openModal, setOpenModal] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const context = trpc.useContext();
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  const [itemsToUpdate, setItemsToUpdate] = useState<number[]>([]);
  const [setsToDelete, setSetsToDelete] = useState<number[]>([]);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    const mail = session.user.email;
    const getUser = async () => {
      const res = await context.fetchQuery(["user.get", { email: mail }]);
      if (res) {
        setUser(res);
      }
    };
    getUser();
  }, [session]);

  useEffect(() => {
    if (!workoutId) return;
    const myAsyncFunc = async () => {
      const res = await context.fetchQuery([
        "workoutExercise.getWorkoutExercises",
        { workoutId },
      ]);
      setWorkoutItems(res);
      setWaiting(false);
    };
    myAsyncFunc();
  }, [context, workoutId]);

  const addExercise = async (id: number) => {
    const res = await context.fetchQuery(["workoutExercise.get", { id }]);
    if (!res) return;
    setWorkoutItems((prev) => {
      if (prev) {
        return [...prev, res];
      } else return [];
    });
  };

  const updateItem = (sets: ExerciseSet[], changed: boolean, index: number) => {
    if (!changed) return;
    setChangesMade(true);
    const workoutItem = workoutItems[index];
    if (workoutItem) {
      let diff = workoutItem.ExerciseSets.length - sets.length;
      while (diff > 0) {
        const setToRemove =
          workoutItem.ExerciseSets[workoutItem.ExerciseSets.length - diff]?.id;
        if (setToRemove && setToRemove > 0) {
          setSetsToDelete((prev) => [...prev, setToRemove]);
        }
        diff--;
      }
    }
    setWorkoutItems((prev) => {
      const next = [...prev];
      const exercise = next[index];
      if (exercise?.ExerciseSets !== undefined) {
        exercise.ExerciseSets = sets;
        next[index] = exercise;
      }
      return next;
    });
    itemsToUpdate.includes(index)
      ? null
      : setItemsToUpdate((prev) => [...prev, index]);
  };

  const updateSets = async (sets: ExerciseSet[]) => {
    await context.fetchQuery([
      "exerciseSets.spicy",
      {
        sets,
      },
    ]);
  };

  const removeSets = async (ids: number[]) => {
    await context.fetchQuery([
      "exerciseSets.removeMany",
      {
        ids,
      },
    ]);
  };

  const sendItemsToUpdate = () => {
    if (!changesMade) return;
    setChangesMade(false);
    const toUpdate: ExerciseSet[] = [];

    itemsToUpdate.forEach((i) => {
      const a = workoutItems[i];
      if (a) {
        toUpdate.push(...a.ExerciseSets);
      }
    });

    if (toUpdate.length > 0) updateSets(toUpdate);
    if (setsToDelete.length > 0) removeSets(setsToDelete);
  };

  const logExercise = async (i: number) => {
    const exercise = workoutItems[i];
    if (exercise) {
      const sets = exercise.ExerciseSets;
      const res = await context.fetchQuery([
        "exercise.log",
        { templateId: exercise.exerciseTemplateId, sets: sets },
      ]);
    }
  };

  return (
    <>
      <SetHead />

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <HomeHeader size="text-2xl" />

        <div className="p-6" />
        <h3 className="sm:text-2xl sm:p-2 text-lg font-bold text-gray-200">
          {name}
        </h3>
        <div className="p-3" />
        <div className=" sm:gap-x-24 gap-x-2 gap-y-2 justify-around items-center">
          <Link href={`/workout`}>
            <button className="p-2 w-24 font-semibold text-xl border-2 rounded border-pink-700 text-gray-200 duration-500 motion-safe:hover:scale-105">
              Back
            </button>
          </Link>
        </div>
        {waiting && (
          <div className="text-lg font-semibold text-violet-600 p-6">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-10" />
          </div>
        )}

        <div ref={workoutsRef} className="flex flex-col gap-y-1 pt-3 w-4/5">
          {workoutItems.map((exerciseItem, index) => {
            if (!exerciseItem.ExerciseTemplate) return;
            const exerciseData = exerciseItem.ExerciseTemplate;
            const setsData = exerciseItem.ExerciseSets;
            return (
              <ExerciseItem
                key={index}
                name={exerciseData.name}
                description={exerciseData.description}
                setsInfo={setsData}
                updateSets={(sets: ExerciseSet[], changed: boolean) =>
                  updateItem(sets, changed, index)
                }
                id={exerciseItem.id}
                logExercise={() => logExercise(index)}
              />
            );
          })}
        </div>
        <div className="p-2" />
        <div className="flex flex-col justify-center items-center gap-y-3">
          <button
            onClick={() => setOpenModal(true)}
            className="border-2 rounded border-pink-700 text-gray-200 p-1"
          >
            <FontAwesomeIcon icon={faPlus} className="w-6 h-6" />
          </button>

          <button
            onClick={() => console.log("This should delete this workout")}
            className="p-2 font-semibold text-xl border-2 rounded border-pink-700 text-gray-200 duration-500 motion-safe:hover:scale-105"
          >
            Delete Workout
          </button>
        </div>
        {user?.id ? (
          <AddWorkoutModal
            userid={user.id}
            workoutid={workoutId}
            open={openModal}
            addExercise={addExercise}
            closeModal={() => setOpenModal(false)}
          />
        ) : null}
      </main>
    </>
  );
};

export default WorkoutPage;
