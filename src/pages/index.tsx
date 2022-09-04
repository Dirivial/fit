import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

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

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-violet-800 to-indigo-500">
          Fit.Dirivial
        </h1>
        <p className="text-2xl text-gray-200">What would you like to do?</p>
        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
          <section className="flex flex-col justify-center duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
            <Link href="/workout">
              <div className="p-6 cursor-pointer flex-grow">
                <h2 className="text-2xl justify-start font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-violet-700 to-red-600">
                  Workout
                </h2>
                <hr />
                <div className="p-2" />
                <p className="text-sm font-semibold text-gray-200">
                  This is where you workout.
                </p>
              </div>
            </Link>
          </section>
          <section className="flex flex-col justify-center duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
            <Link href="/analysis">
              <div className="p-6 cursor-pointer flex-grow">
                <h2 className="text-2xl justify-start font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-violet-700">
                  Analyze
                </h2>
                <hr />
                <div className="p-2" />
                <p className="text-sm font-semibold text-gray-200">
                  This is where you look at how you've progressed.
                </p>
              </div>
            </Link>
          </section>
        </div>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
          {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
        </div>
      </main>
    </>
  );
};

export default Home;

type PageLinkCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const PageLinkCard = ({
  name,
  description,
  documentation,
}: PageLinkCardProps) => {
  return (
    <section className="flex flex-col justify-center duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <Link href={documentation}>
        <div className="p-6 cursor-pointer flex-grow">
          <h2 className="text-xl justify-start font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-sky-600">
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
