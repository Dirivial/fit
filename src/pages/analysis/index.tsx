import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HomeHeader from "../../components/homeHeader";
import SearchForTemplate from "../../components/SearchForTemplate";
import SetHead from "../../components/setHead";
import { trpc } from "../../utils/trpc";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ExerciseTemplate } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyzePage: NextPage = () => {
  const { data: session } = useSession();
  const userid = trpc.useQuery([
    "user.get",
    { email: session?.user?.email },
  ]).data;
  const exercises = trpc.useQuery([
    "exerciseTemplate.getAll",
    { userId: userid?.id },
  ]);
  const [selected, setSelected] = useState<ExerciseTemplate>();

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: [1, 1, 2, 1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 8],
        borderColor: "rgb(90, 33, 181)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Logs over time",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        suggestedMin: 0,
      },
    },
  };

  return (
    <>
      <SetHead />

      <main className="flex flex-col justify-center items-center mt-6">
        <HomeHeader size={"text-2xl"} />

        <div className="p-6" />
        <h2 className="text-2xl text-gray-200">Choose exercise</h2>
        <div className="flex gap-3">
          <SearchForTemplate
            setSelectedExercise={(exercise) => setSelected(exercise)}
            templates={exercises.data ? exercises.data : []}
          />
          <button className="text-lg text-gray-200 rounded border-2 border-violet-800 bg-violet-800 p-1">
            Load
          </button>
        </div>

        <div className="w-4/6">
          <Line data={data} options={options} />
        </div>
      </main>
    </>
  );
};

export default AnalyzePage;
