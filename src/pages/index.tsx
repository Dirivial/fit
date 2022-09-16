import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();

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

        {session ? (
          <>
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
                      Start working out!
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
                      Take a look at how you have progressed.
                    </p>
                  </div>
                </Link>
              </section>
            </div>
          </>
        ) : (
          <></>
        )}
        {session ? (
          <p className="text-gray-200 mt-2">
            Welcome, {session.user ? session.user.email : ""}.{" "}
            <button onClick={() => signOut()} className="text-violet-400">
              Sign out
            </button>
          </p>
        ) : (
          <>
            <p className="text-gray-200 text-lg">
              Please sign in to use this site!{" "}
            </p>
            <button className="text-violet-400" onClick={() => signIn()}>
              Sign in
            </button>
          </>
        )}
      </main>
    </>
  );
};

export default Home;
