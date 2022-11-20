import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import HomeHeader from "../../components/homeHeader";
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
import { ExerciseSet, ExerciseTemplate } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { exercise } from "../../server/router/exercise";

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

type DatasetItem = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

const AnalyzePage: NextPage = () => {
  const context = trpc.useContext();
  const { data: session } = useSession();
  const userid = trpc.useQuery([
    "user.get",
    { email: session?.user?.email },
  ]).data;
  const exercises = trpc.useQuery([
    "exerciseTemplate.getAllWithHistory",
    { userId: userid?.id ? userid.id : "" },
  ]);

  const [selected, setSelected] = useState<ExerciseTemplate>();
  const [isWaiting, setIsWaiting] = useState(true);
  //const [datapoints, setDatapoints] = useState<DataPoint[]>([]);
  const [labelsToDisplay, setLabelsToDisplay] = useState<string[]>([
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
        data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        borderColor: "rgb(100, 100, 100)",
        backgroundColor: "rgba(100, 100, 100, 0.5)",
      },
    ],
  });
  const [year, setYear] = useState<number>(2022);

  const calculatedDatasets = useMemo(() => {
    if (exercises.data?.length == 0) {
      console.log("No exercise found");
      return [];
    }
    const datasets: DatasetItem[] = [];

    exercises.data?.forEach((item) => {
      const data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const datapoints = item.Exercise.map((history) => {
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
      datapoints.forEach((element) => {
        data[element.month]++;
      });
      datasets.push({
        label: item.name,
        data: data,
        borderColor: "rgba(131, 24, 67, 0.5)",
        backgroundColor: "rgba(131, 24, 67, 0.8)",
      });
    });
    console.log("Datasets calculated.");
    return datasets;
  }, [exercises]);

  useEffect(() => {
    if (calculatedDatasets.length == 0) return;
    setDataToDisplay((prev) => {
      const newData = prev;
      newData.datasets = calculatedDatasets.map((item) => {
        return {
          label: item.label,
          data: item.data,
          borderColor: item.borderColor,
          backgroundColor: item.backgroundColor,
        };
      });
      return newData;
    });
    setIsWaiting(false);
  }, [calculatedDatasets]);

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
          {/* <SearchForTemplate
            setSelectedExercise={(exercise) => setSelected(exercise)}
            templates={() => (exercises.data ? exercises.data : [])}
          /> */}
          <button
            onClick={() => console.log("lmao")}
            className="text-lg text-gray-200 rounded border-2 border-violet-800 bg-violet-800 p-1"
          >
            Load
          </button>
        </div>

        <div className="w-4/6">
          {isWaiting ? (
            <div className="fixed right-2 bottom-2 bg-slate-900 border-pink-700 text-gray-200 border-2 text-xl rounded p-2">
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin w-12 h-8"
              />
            </div>
          ) : (
            <Line data={dataToDisplay} options={options} />
          )}
        </div>
      </main>
    </>
  );
};

export default AnalyzePage;

// I might need these in the future

// const updateDataToDisplay = (data: DataPoint[]) => {
//   const sumOfData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//   console.log("Yo");
//   data.forEach((value) => {
//     sumOfData[value.month] += 1;
//     console.log(value.month);
//   });

//   setDataToDisplay((prev) => {
//     const newData = prev;
//     newData.datasets = [
//       {
//         label: selected ? selected.name : "",
//         data: sumOfData,
//         borderColor: "rgb(255, 255, 255)",
//         backgroundColor: "rgba(255, 255, 255, 0.5)",
//       },
//       {
//         label: selected ? selected.name : "",
//         data: sumOfData,
//         borderColor: "rgb(255, 255, 255)",
//         backgroundColor: "rgba(255, 255, 255, 0.5)",
//       },
//     ];
//     return newData;
//   });
// };

// const fetchHistory = async () => {
//   if (!selected) return;
//   const result = await context.fetchQuery([
//     "exerciseTemplate.getHistory",
//     { id: selected.id },
//   ]);
//   if (result?.Exercise) {
//     const newData = result.Exercise.map((history) => {
//       const date = history.date;
//       if (!date)
//         return {
//           sets: history.ExerciseSets,
//           year: 0,
//           month: 0,
//           day: 0,
//         };
//       return {
//         sets: history.ExerciseSets,
//         year: date.getFullYear(),
//         month: date.getMonth(),
//         day: date.getDay(),
//       };
//     });

//     updateDataToDisplay(newData.filter((item) => item.year == year));
//   }
// };
