import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import HomeHeader from "../../components/homeHeader";
import SetHead from "../../components/setHead";
import { AddWorkoutModal } from "../../components/AddExerciseModal";
import { DeleteItemModal } from "../../components/DeleteItemModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  ExerciseSet,
  ExerciseTemplate,
  Prisma,
  WorkoutExercise,
} from "@prisma/client";
import { useSession } from "next-auth/react";
import { ExerciseItem, GenericSet } from "../../components/ExerciseItem";
import { workoutExercise } from "../../server/router/workoutExercise";

type ExerciseItemType = WorkoutExercise & {
  ExerciseTemplate: ExerciseTemplate;
  workoutExercise: WorkoutExercise;
};

const WorkoutPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const user = trpc.useQuery(["user.get", { email: session?.user?.email }]);
  const [workoutItems, setWorkoutItems] = useState<ExerciseItemType[]>([]);
  const [workoutsRef] = useAutoAnimate<HTMLDivElement>();
  const [openModal, setOpenModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] =
    useState<boolean>(false);
  const [showDeleteItemModal, setShowDeleteItemModal] =
    useState<boolean>(false);
  const [exerciseSelected, setExerciseSelected] = useState<{
    workoutExerciseId: number;
    index: number;
  }>({ workoutExerciseId: -1, index: -1 });
  const [waiting, setWaiting] = useState(true);
  const context = trpc.useContext();

  const { workout } = router.query;
  const workoutId = Number(workout?.slice(3, workout?.indexOf("&")));
  const name = workout ? workout.slice(workout?.indexOf("name=") + 5) : "";
  const cachedWorkouts = trpc.useQuery([
    "workoutExercise.getWorkoutExercises",
    { workoutId: workoutId, userId: user.data?.id ? user.data.id : "" },
  ]).data;

  useEffect(() => {
    if (workoutItems.length == 0 && cachedWorkouts) {
      setWorkoutItems(cachedWorkouts as ExerciseItemType[]);
      setWaiting(false);
    }
  }, [cachedWorkouts]);

  if (!user.data) {
    return <></>;
  }

  // Delete the workout
  const deleteWorkout = async () => {
    const res = await context.fetchQuery([
      "workout.delete",
      { id: workoutId, workoutExerciseIds: workoutItems.map((i) => i.id) },
    ]);
    setShowDeleteWorkoutModal(false);
  };

  // Add exercise to workout
  const addExercise = async (id: number) => {
    const res = (await context.fetchQuery([
      "workoutExercise.get",
      { id },
    ])) as ExerciseItemType;
    if (!res) return;
    setWorkoutItems((prev) => {
      if (prev) {
        return [...prev, res];
      } else return [];
    });
  };

  const updateItem = (
    sets: Prisma.JsonValue,
    changed: boolean,
    index: number
  ) => {
    if (!changed) return;
    setWorkoutItems((prev) => {
      const next = [...prev];
      const exercise = next[index];
      if (exercise?.Sets !== undefined) {
        exercise.Sets = sets;
        next[index] = exercise;
      }
      return next;
    });
  };

  // Log an exercise
  const logExercise = async (
    sets: GenericSet[],
    exerciseTemplateId: number,
    workoutExerciseId: number
  ) => {
    setShowLoading(true);
    // TODO: Make it so the workout exercise ''knows'' about this.
    const yo = context.fetchQuery([
      "workoutExercise.update",
      {
        sets: sets,
        id: workoutExerciseId,
      },
    ]);
    const res = await context.fetchQuery([
      "exercise.log",
      { templateId: exerciseTemplateId, sets: sets },
    ]);
    setShowLoading(false);
  };

  // Delete an exercise from this workout. Does NOT delete an exercise completely, eg. the exercise template
  const deleteExercise = async () => {
    const index = exerciseSelected?.index;
    const workoutExerciseId = exerciseSelected?.workoutExerciseId;
    setWorkoutItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setShowDeleteItemModal(false);
    setExerciseSelected({ workoutExerciseId: -1, index: -1 });

    // User does not have to be aware about this query going through, unless it fails which I do not show anywhere :)
    const res = await context.fetchQuery([
      "workoutExercise.delete",
      { id: workoutExerciseId },
    ]);
  };

  return (
    <>
      <SetHead />
      <DeleteItemModal
        // Workout delete modal
        open={showDeleteWorkoutModal}
        proceedWithDelete={() => deleteWorkout()}
        closeModal={() => setShowDeleteWorkoutModal(false)}
      />

      <DeleteItemModal
        // Exercise delete modal
        open={showDeleteItemModal}
        proceedWithDelete={() => deleteExercise()}
        closeModal={() => setShowDeleteItemModal(false)}
      />

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

        <div
          ref={workoutsRef}
          className="flex flex-col gap-y-1 pt-3 sm:w-4/5 w-full"
        >
          {workoutItems.map((exerciseItem, index) => {
            if (!exerciseItem.exerciseTemplateId) return;
            return (
              <ExerciseItem
                key={index}
                name={exerciseItem.ExerciseTemplate.name}
                setsInfo={exerciseItem.Sets}
                updateSets={(sets: Prisma.JsonValue, changed: boolean) =>
                  updateItem(sets, changed, index)
                }
                id={exerciseItem.id}
                logExercise={(sets: GenericSet[]) =>
                  logExercise(
                    sets,
                    exerciseItem.exerciseTemplateId,
                    exerciseItem.id
                  )
                }
                deleteExercise={() => {
                  setExerciseSelected({
                    workoutExerciseId: exerciseItem.id,
                    index: index,
                  });
                  setShowDeleteItemModal(true);
                }}
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
            onClick={() => setShowDeleteWorkoutModal(true)}
            className="p-2 font-semibold text-xl border-2 rounded border-pink-700 text-gray-200 duration-500 motion-safe:hover:scale-105"
          >
            Delete Workout
          </button>
        </div>
        {user.data.id ? (
          <AddWorkoutModal
            userid={user.data.id}
            workoutid={workoutId}
            open={openModal}
            addExercise={addExercise}
            closeModal={() => setOpenModal(false)}
          />
        ) : null}
      </main>
      {!showLoading ? null : (
        <div className="fixed right-2 bottom-2 bg-slate-900 border-pink-700 text-gray-200 border-2 text-xl rounded p-2">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin w-12 h-8" />
        </div>
      )}
    </>
  );
};

export default WorkoutPage;
