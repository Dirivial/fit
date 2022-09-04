import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

const WorkoutPage: NextPage = () => {
  const workouts = trpc.useQuery(["workout.getAll", { id: 1 }]);

  return (
    <>
      <Head>
        <title>Fit.Dirivial</title>
        <meta
          name="description"
          content="Fitness/workout app made by Dirivial"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <h1 className="text-2xl leading-normal hover:cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-violet-800 to-indigo-500">
          <Link href="/" className="">
            Fit.Dirivial
          </Link>
        </h1>

        <div className="p-6" />
        <h2 className="text-2xl text-gray-200">Choose a Workout</h2>
        <h4 className="text-lg text-gray-200">
          or{" "}
          <span className="text-indigo-400">
            <Link href="/workout/free-form/">pick individual exercises...</Link>
          </span>
        </h4>
        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
          {workouts.data ? (
            <>
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
            </>
          ) : (
            <div className="">
              <div className="animate-spin">I</div>Loading...
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default WorkoutPage;

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
          <div className="p-1" />
        </div>
      </Link>
    </section>
  );
};
