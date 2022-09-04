import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import HomeHeader from "../components/homeHeader";
import SetHead from "../components/setHead";

const WorkoutListPage: NextPage = () => {
  const workouts = trpc.useQuery(["workout.getAll", { id: 1 }]);
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
        {workouts.data ? (
          <div
            ref={workoutsRef}
            className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3"
          >
            {workouts.data.map((thing, index) => {
              return (
                <WorkoutItem
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

export default WorkoutListPage;

type WorkoutItemProps = {
  name: string;
  description: string;
  id: number;
};

const WorkoutItem = ({ name, description, id }: WorkoutItemProps) => {
  return (
    <section className="flex flex-col justify-center duration-500 border-2 border-pink-700 rounded shadow-xl motion-safe:hover:scale-105">
      <Link href={`/workout/${id}`}>
        <div className="p-6 cursor-pointer flex-grow">
          <h2 className="text-xl justify-start font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-violet-700 to-red-600">
            {name}
          </h2>
          <hr />
          <div className="p-2" />
          <p className="h-fill text-sm text-gray-200">{description}</p>
        </div>
      </Link>
    </section>
  );
};
