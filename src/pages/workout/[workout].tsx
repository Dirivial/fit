import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import HomeHeader from "../components/homeHeader";
import SetHead from "../components/setHead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const WorkoutPage: NextPage = () => {
  const router = useRouter();
  const { workout } = router.query;
  const workoutId = Number(workout);
  const exercises = trpc.useQuery(["workout.get", { id: workoutId }]);

  const [workoutsRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <>
      <SetHead />

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <HomeHeader size="text-2xl" />

        <div className="p-6" />
        <div className="flex gap-x-10">
          <Link href={`/workout`}>
            <button className="p-2 font-semibold text-xl border-2 rounded border-pink-700 text-gray-200">
              Back
            </button>
          </Link>
          <div />
          <Link href={`/workout`}>
            <button className="p-2 font-semibold text-xl border-2 rounded border-pink-700 text-gray-200">
              Edit
            </button>
          </Link>
        </div>
        {exercises.data ? (
          <div ref={workoutsRef} className="flex flex-col gap-y-1 pt-3">
            {exercises.data.exercise.map((exercise, index) => {
              return (
                <ExerciseItem
                  key={index}
                  name={exercise.name}
                  description={exercise.description ? exercise.description : ""}
                  sets={exercise.defaultSets}
                  reps={exercise.defaultSets}
                  id={exercise.id}
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
        <Link href="/workout">
          <button className="p-3 font-bold border-2 border-pink-700 text-xl text-pink-600 rounded shadow-xl">
            Initiate Workout
          </button>
        </Link>
      </main>
    </>
  );
};

export default WorkoutPage;

type ExerciseItemProps = {
  name: string;
  description: string;
  sets: number;
  reps: number;
  id: number;
};

const ExerciseItem = ({
  name,
  description,
  sets,
  reps,
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
            <button className="p-1 rounded-full text-indigo-500">+</button>
            <p className="p-1">{sets}</p>
            <button className="p-1 rounded-full text-indigo-500">-</button>
          </div>
        </div>
        <div className="flex flex-col justify-center text-lg p-2 text-center text-gray-200">
          <h3>Reps</h3>
          <div className="flex">
            <button className="p-1 rounded-full text-indigo-500">+</button>
            <p className="p-1">{reps}</p>
            <button className="p-1 rounded-full text-indigo-500">-</button>
          </div>
        </div>
      </section>
    </div>
  );
};
