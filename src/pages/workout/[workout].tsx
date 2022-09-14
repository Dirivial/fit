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
import { Exercise, ExerciseSet, ExerciseTemplate } from "@prisma/client";

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
  const context = trpc.useContext();

  useEffect(() => {
    const myAsyncFunc = async () => {
      const res = await context.fetchQuery([
        "exercise.getWorkoutExercises",
        { workoutId },
      ]);
      setWorkoutItems(res);
    };
    myAsyncFunc();
  }, [context, workoutId]);

  const addExercise = async (id: number) => {
    const res = await context.fetchQuery(["exercise.get", { id }]);
    if (!res || !workoutItems) return;
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
        {workoutItems ? (
          <div ref={workoutsRef} className="flex flex-col gap-y-1 pt-3 w-4/5">
            {workoutItems.map((exerciseItem, index) => {
              if (!exerciseItem.ExerciseTemplate) return;
              const exerciseData = exerciseItem.ExerciseTemplate;
              const setsData = exerciseItem.ExerciseSets;
              console.log(setsData);
              return (
                <ExerciseItem
                  key={index}
                  name={exerciseData.name}
                  description={
                    exerciseData.description ? exerciseData.description : ""
                  }
                  setsInfo={setsData}
                  id={exerciseItem.id}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-lg font-semibold text-violet-600 p-6">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-10" />
          </div>
        )}
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
        <AddWorkoutModal
          userid={1}
          workoutid={workoutId}
          open={openModal}
          addExercise={addExercise}
          closeModal={() => setOpenModal(false)}
        />
      </main>
    </>
  );
};

export default WorkoutPage;

type ExerciseItemProps = {
  name: string;
  description: string;
  setsInfo: ExerciseSet[];
  id: number;
};

const ExerciseItem = ({
  name,
  description,
  setsInfo,
  id,
}: ExerciseItemProps) => {
  return (
    <div className="flex sm:flex-row flex-col justify-end">
      <section className="flex flex-row flex-grow justify-center border-2 border-pink-700 rounded shadow-xl">
        <div className="p-6 flex-grow">
          <h2 className="text-xl justify-start font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-violet-700 via-pink-700 to-red-600">
            {name}
          </h2>
          <div className="p-2" />
          <p className="text-sm text-gray-200">{description}</p>
        </div>
      </section>
      <div className="p-1" />
      <section className="flex justify-around border-2 border-pink-700 rounded shadow-xl">
        <div className="flex flex-col justify-center text-lg p-2 text-center text-gray-200">
          <h3>Sets</h3>
          <div className="flex">
            <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
              +
            </button>
            <p className="p-1 hover:cursor-default">{setsInfo[0]?.sets}</p>
            <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
              -
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center text-lg p-2 text-center text-gray-200">
          <h3>Reps</h3>
          <div className="flex">
            <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
              +
            </button>
            <p className="p-1 hover:cursor-default">{setsInfo[0]?.reps}</p>
            <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
              -
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
