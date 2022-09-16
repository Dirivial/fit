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
import { useEffect, useState } from "react";
import { Exercise, ExerciseSet, ExerciseTemplate, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ExerciseItem } from "../../components/ExerciseItem";

type ExerciseItemType = Exercise & {
  ExerciseTemplate: ExerciseTemplate | null;
  ExerciseSets: ExerciseSet[];
};

const WorkoutPage: NextPage = () => {
  const router = useRouter();
  const { workout } = router.query;
  const workoutId = Number(workout);

  const [workoutItems, setWorkoutItems] = useState<ExerciseItemType[]>([]);
  const [workoutsRef] = useAutoAnimate<HTMLDivElement>();
  const [openModal, setOpenModal] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const context = trpc.useContext();
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();

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
        "exercise.getWorkoutExercises",
        { workoutId },
      ]);
      setWorkoutItems(res);
      setWaiting(false);
    };
    myAsyncFunc();
  }, [context, workoutId]);

  const addExercise = async (id: number) => {
    const res = await context.fetchQuery(["exercise.get", { id }]);
    if (!res) return;
    setWorkoutItems((prev) => {
      if (prev) {
        return [...prev, res];
      } else return [];
    });
  };

  return (
    <>
      <SetHead />

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <HomeHeader size="text-2xl" />

        <div className="p-6" />
        <div className="flex gap-x-10">
          <Link href={`/workout`}>
            <button className="p-2 font-semibold text-xl border-2 rounded border-pink-700 text-gray-200 duration-500 motion-safe:hover:scale-105">
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
            //console.log(setsData);
            return (
              <ExerciseItem
                key={index}
                name={exerciseData.name}
                description={exerciseData.description}
                setsInfo={setsData}
                id={exerciseItem.id}
              />
            );
          })}
        </div>
        <div className="p-2" />
        <div className="">
          <button
            onClick={() => setOpenModal(true)}
            className="border-2 rounded border-pink-700 text-gray-200 p-1"
          >
            <FontAwesomeIcon icon={faPlus} className="w-6" />
          </button>
        </div>
        <div className="p-2" />
        <Link href="/workout">
          <button className="p-3 font-bold border-2 border-pink-700 text-xl text-gray-200 rounded shadow-xl duration-500 motion-safe:hover:scale-105">
            Initiate Workout
          </button>
        </Link>
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
