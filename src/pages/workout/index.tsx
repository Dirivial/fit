import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import HomeHeader from "../../components/homeHeader";
import SetHead from "../../components/setHead";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User, Workout } from "@prisma/client";
import { CreateWorkoutModal } from "../../components/CreateWorkoutModal";

const WorkoutListPage: NextPage = () => {
  const { data: session } = useSession();
  const context = trpc.useContext();
  const [user, setUser] = useState<User>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutsRef] = useAutoAnimate<HTMLDivElement>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const email = session.user.email;
      const getUser = async () => {
        const res = await context.fetchQuery(["user.get", { email }]);
        setUser(res!);
      };
      getUser();
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      const id = user.id;
      const getWorkouts = async () => {
        const res = await context.fetchQuery(["workout.getAll", { id }]);
        if (res) {
          setWorkouts(res);
          setLoading(false);
        }
      };
      getWorkouts();
    }
  }, [user]);

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, workout]);
  };

  return (
    <>
      <SetHead />

      {user ? (
        <CreateWorkoutModal
          userid={user.id}
          open={showModal}
          addWorkout={addWorkout}
          closeModal={() => setShowModal(false)}
        />
      ) : null}

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <HomeHeader size="text-2xl" />

        <div className="p-6" />
        <h2 className="text-2xl text-gray-200">Choose Workout</h2>
        <h4 className="text-lg text-gray-200">
          or{" "}
          <span className="text-indigo-400">
            <button onClick={() => setShowModal(true)}>create one!</button>
          </span>
        </h4>
        {!loading ? (
          <div
            ref={workoutsRef}
            className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3"
          >
            {workouts.map((thing, index) => {
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
      <Link href={`/workout/id=${id}&name=${name}`}>
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
