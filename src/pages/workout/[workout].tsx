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
        <h2 className="text-2xl text-gray-200">Choose a Workout</h2>
        <h4 className="text-lg text-gray-200">
          or{" "}
          <span className="text-indigo-400">
            <Link href="/workout/free-form/">pick individual exercises...</Link>
          </span>
        </h4>
        {exercises.data ? (
          <div ref={workoutsRef} className="flex flex-col gap-y-1 pt-3">
            {exercises.data.exercise.map((thing, index) => {
              return (
                <ExerciseItem
                  key={index}
                  name={thing.name}
                  description={thing.description ? thing.description : ""}
                  id={thing.id}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-lg font-semibold text-violet-600 p-6">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-10" />
          </div>
        )}
      </main>
    </>
  );
};

export default WorkoutPage;

type ExerciseItemProps = {
  name: string;
  description: string;
  id: number;
};

const ExerciseItem = ({ name, description, id }: ExerciseItemProps) => {
  return (
    <section className="flex flex-row justify-center duration-500 border-2 border-pink-700 rounded shadow-xl motion-safe:hover:scale-105">
      <div className="p-6 flex-grow">
        <h2 className="text-xl justify-start font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-violet-700 to-red-600">
          {name}
        </h2>
        <div className="p-2" />
        <p className="text-sm text-gray-200">{description}</p>
      </div>
    </section>
  );
};
