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
  ChartData,
  ScatterDataPoint,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Exercise, ExerciseSet, ExerciseTemplate } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DataPoint = {
  sets: ExerciseSet[];
  year: number;
  month: number;
  day: number;
};

const AnalyzePage: NextPage = () => {
  const context = trpc.useContext();
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
  const [datapoints, setDatapoints] = useState<DataPoint[]>([]);
  const [labelsToDisplay, setLabelsToDisplay] = useState<String[]>([
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
  ]);
  const [dataToDisplay, setDataToDisplay] = useState<
    ChartData<"line", (number | ScatterDataPoint | null)[], unknown>
  >({
    labels: labelsToDisplay,
    datasets: [
      {
        label: "",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(90, 33, 181)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });
  const [year, setYear] = useState<number>(2022);

  const updateDataToDisplay = (data: DataPoint[]) => {
    const sumOfData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    data.forEach((value) => {
      sumOfData[value.month] += 1;
    });

    setDataToDisplay((prev) => {
      const newData = prev;
      newData.datasets = [
        {
          label: selected ? selected.name : "",
          data: sumOfData,
          borderColor: "rgb(90, 33, 181)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ];
      return newData;
    });
  };

  const fetchHistory = async () => {
    if (!selected) return;
    const result = await context.fetchQuery([
      "exerciseTemplate.getHistory",
      { id: selected.id },
    ]);
    if (result?.Exercise) {
      const newData = result.Exercise.map((history) => {
        const date = history.date;
        if (!date)
          return {
            sets: history.ExerciseSets,
            year: 0,
            month: 0,
            day: 0,
          };
        return {
          sets: history.ExerciseSets,
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDay(),
        };
      });

      setDatapoints(newData);
      console.log(newData);
      updateDataToDisplay(newData.filter((item) => item.year == year));
    }
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
            templates={() => (exercises.data ? exercises.data : [])}
          />
          <button
            onClick={fetchHistory}
            className="text-lg text-gray-200 rounded border-2 border-violet-800 bg-violet-800 p-1"
          >
            Load
          </button>
        </div>

        <div className="w-4/6">
          <Line data={dataToDisplay} options={options} />
        </div>
      </main>
    </>
  );
};

export default AnalyzePage;
