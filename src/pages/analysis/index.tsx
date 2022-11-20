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
import { ExerciseSet } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DatasetItem = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

type DataPointsObject = {
  id: number;
  label: string;
  data: [
    {
      year: number;
      month: number;
      day: number;
    }
  ];
};

const oneYearLabels = [
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

const YEAR = 0;
const ALLTIME = 1;
const THREE_MONTHS = 2;
const MONTH = 3;
const WEEK = 4;

const AnalyzePage: NextPage = () => {
  const context = trpc.useContext();
  const { data: session } = useSession();
  const userid = trpc.useQuery([
    "user.get",
    { email: session?.user?.email },
  ]).data;
  const exercises = trpc.useQuery([
    "exerciseTemplate.getAllWithHistoryAndWorkouts",
    { userId: userid?.id ? userid.id : "" },
  ]).data;

  const [isWaiting, setIsWaiting] = useState(true);
  const [graphTimeInterval, setGraphTimeInterval] = useState(YEAR);

  const [dataToDisplay, setDataToDisplay] = useState<
    ChartData<"line", (number | ScatterDataPoint | null)[], unknown>
  >({
    labels: oneYearLabels,
    datasets: [
      {
        label: "",
        data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        borderColor: "rgb(100, 100, 100)",
        backgroundColor: "rgba(100, 100, 100, 0.5)",
      },
    ],
  });

  const parsedDataPoints = useMemo(() => {
    // Avoid calculating stuff if we do not have any data
    if (!exercises?.length || exercises?.length == 0) {
      return [];
    }

    const datapointsobject: DataPointsObject[] = [];

    exercises?.forEach((item) => {
      // Create datapoints for each entry in the gathered data
      item.Exercise.forEach((history) => {
        const date = history.date;
        if (!date) {
          return null;
        }
        item.WorkoutExercise.forEach((wExercise) => {
          if (!wExercise.workoutId) return;
          const workoutId = wExercise.workoutId;
          const index = datapointsobject.findIndex(
            (value) => value.id === workoutId
          );
          if (index < 0) {
            datapointsobject.push({
              id: workoutId,
              label: wExercise.Workout?.name ? wExercise.Workout?.name : "",
              data: [
                {
                  year: date.getFullYear(),
                  month: date.getMonth(),
                  day: date.getDay(),
                },
              ],
            });
          } else {
            datapointsobject[index]?.data.push({
              year: date.getFullYear(),
              month: date.getMonth(),
              day: date.getDay(),
            });
          }
        });
      });
    });
    return datapointsobject;
  }, [exercises]);

  // Create datasets from some data using current graph time interval
  function createDatasets(data: DataPointsObject[]): DatasetItem[] {
    const todayDate = new Date();
    const todayParsed = {
      year: todayDate.getFullYear(),
      month: todayDate.getMonth(),
      day: todayDate.getDay(),
    };

    const datasets: DatasetItem[] = [];

    data.forEach((item) => {
      const filteredData = item.data.filter(
        (value) => value.year === todayParsed.year
      );
      const data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      filteredData.forEach((value) => {
        data[value.month]++;
      });
      datasets.push({
        label: item.label,
        data: data,
        borderColor: getRandomColor(),
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      });
    });

    console.log("Datasets calculated: ", datasets);
    return datasets;
  }

  useEffect(() => {
    if (parsedDataPoints.length == 0) return;
    const datasets = createDatasets(parsedDataPoints);
    setDataToDisplay((prev) => {
      const newData = prev;
      newData.datasets = datasets.map((item) => {
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
  }, [parsedDataPoints]);

  // Options for the graph
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
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
          {
            // The following will be used later when user wants to look at a specific exercise/workout
            /* <SearchForTemplate
            setSelectedExercise={(exercise) => setSelected(exercise)}
            templates={() => (exercises.data ? exercises.data : [])}
          /> */
          }
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

function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

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
