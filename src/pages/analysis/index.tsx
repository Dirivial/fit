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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Tab } from "@headlessui/react";
import SearchForTemplate from "../../components/SearchForTemplate";
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
      weekday: number;
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

const oneMonthLabels: string[] = [];
for (let i = 1; i < 32; i++) {
  oneMonthLabels.push(i + "");
}

const oneWeekLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type CategoryType = {
  id: number;
  title: string;
  labelCount: number;
};

const YEAR = 0;
const MONTH = 1;
const WEEK = 2;

const categories: CategoryType[] = [
  {
    id: YEAR,
    title: "Year",
    labelCount: 12,
  },
  {
    id: MONTH,
    title: "Month",
    labelCount: 31,
  },
  {
    id: WEEK,
    title: "Week",
    labelCount: 7,
  },
];

const CHART_TENSION = 0.2;

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
  const [selected, setSelected] = useState<ExerciseTemplate>();

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
        tension: 0.1,
      },
    ],
  });

  const [monthGraph, setMonthGraph] = useState<
    ChartData<"line", (number | ScatterDataPoint | null)[], unknown>
  >({
    labels: oneMonthLabels,
    datasets: [
      {
        label: "",
        data: new Array(31),
        borderColor: "rgb(100, 100, 100)",
        backgroundColor: "rgba(100, 100, 100, 0.5)",
        tension: 0.1,
      },
    ],
  });

  const [weekGraph, setWeekGraph] = useState<
    ChartData<"line", (number | ScatterDataPoint | null)[], unknown>
  >({
    labels: oneWeekLabels,
    datasets: [
      {
        label: "",
        data: [10, 10, 10, 10, 10, 10, 10],
        borderColor: "rgb(100, 100, 100)",
        backgroundColor: "rgba(100, 100, 100, 0.5)",
        tension: 0.1,
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
                  day: date.getDate(),
                  weekday: date.getDay(),
                },
              ],
            });
          } else {
            datapointsobject[index]?.data.push({
              year: date.getFullYear(),
              month: date.getMonth(),
              day: date.getDate(),
              weekday: date.getDay(),
            });
          }
        });
      });
    });
    return datapointsobject;
  }, [exercises]);

  // Create datasets from some data using current graph time interval
  function createDatasets(
    data: DataPointsObject[],
    category: number
  ): DatasetItem[] {
    const todayDate = new Date();
    const todayParsed = {
      year: todayDate.getFullYear(),
      month: todayDate.getMonth(),
      day: todayDate.getDate(),
      weekday: todayDate.getDay(),
    };

    const numLabels = categories[category]?.labelCount;
    if (!numLabels) return [];

    const datasets: DatasetItem[] = [];
    const oldSets = new Set();

    data.forEach((item) => {
      const filteredData =
        category == YEAR
          ? item.data.filter((value) => value.year === todayParsed.year)
          : category === WEEK
          ? item.data.filter(
              (value) =>
                todayParsed.year === value.year &&
                todayParsed.month === value.month &&
                todayParsed.day - value.day < 8
            )
          : item.data.filter(
              (value) =>
                todayParsed.year === value.year &&
                todayParsed.month === value.month
            );
      const data: number[] = [];
      for (let i = 0; i < numLabels; i++) {
        data.push(0);
      }

      filteredData.forEach((value) => {
        // Avoid adding the same date multiple times
        const str =
          value.year.toString() + value.month.toString() + value.day.toString();
        if (!oldSets.has(str)) {
          oldSets.add(str);

          if (category == YEAR) {
            data[value.month]++;
          } else if (category == WEEK) {
            if (value.weekday == 0) {
              data[6]++;
            } else {
              data[value.weekday - 1]++;
            }
          } else {
            data[value.day]++;
          }
        }
      });

      // Add entry to datasets
      datasets.push({
        label: item.label,
        data: data,
        borderColor: getRandomColor(),
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      });
    });

    return datasets;
  }

  useEffect(() => {
    if (parsedDataPoints.length == 0) return;
    // Year
    const datasets = createDatasets(parsedDataPoints, YEAR);
    setDataToDisplay((prev) => {
      const newData = prev;

      // Set the new datapoints
      newData.datasets = datasets.map((item) => {
        return {
          label: item.label,
          data: item.data,
          borderColor: item.borderColor,
          backgroundColor: item.backgroundColor,
          tension: CHART_TENSION,
        };
      });
      return newData;
    });
    setIsWaiting(false);

    // Month
    const month_datasets = createDatasets(parsedDataPoints, MONTH);
    setMonthGraph((prev) => {
      const newData = prev;
      // Set the new datapoints
      newData.datasets = month_datasets.map((item) => {
        return {
          label: item.label,
          data: item.data,
          borderColor: item.borderColor,
          backgroundColor: item.backgroundColor,
          tension: CHART_TENSION,
        };
      });
      return newData;
    });
    // Week
    const week_datasets = createDatasets(parsedDataPoints, WEEK);
    setWeekGraph((prev) => {
      const newData = prev;
      // Set the new datapoints
      newData.datasets = week_datasets.map((item) => {
        return {
          label: item.label,
          data: item.data,
          borderColor: item.borderColor,
          backgroundColor: item.backgroundColor,
          tension: CHART_TENSION,
        };
      });
      return newData;
    });
  }, [parsedDataPoints]);

  const deleteExercise = async () => {
    if (!selected) {
      return;
    }
    console.log("Deleting exercise: ", selected);

    const res = await context.fetchQuery([
      "exerciseTemplate.delete",
      { templateId: selected.id },
    ]);
    console.log("Deleted. ", res);
    // Now remove the exercise from the exercises variable
  };

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
        <h2 className="text-2xl text-gray-200">History</h2>
        <div className="p-2" />
        <Tab.Group defaultIndex={1}>
          <Tab.List className="flex space-x-1 rounded-xl bg-slate-800/20 p-1">
            {categories.map((category) => (
              <Tab
                key={category.id}
                className={({ selected }) => {
                  const part1 =
                    "w-full rounded-lg focus:outline-none py-2.5 px-4 text-sm font-medium leading-5";
                  const part2 = selected
                    ? "bg-pink-700 shadow text-gray-200"
                    : "text-gray-600 hover:bg-pink-700/[0.24] hover:text-white";
                  return part1 + " " + part2;
                }}
              >
                {category.title}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="w-3/4">
            <Tab.Panel className="w-full">
              <div className="p-2" />
              <div className="">
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
            </Tab.Panel>
            <Tab.Panel>
              <div className="p-2" />
              {isWaiting ? (
                <div className="fixed right-2 bottom-2 bg-slate-900 border-pink-700 text-gray-200 border-2 text-xl rounded p-2">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin w-12 h-8"
                  />
                </div>
              ) : (
                <Line data={monthGraph} options={options} />
              )}
            </Tab.Panel>
            <Tab.Panel>
              <div className="p-2" />
              {isWaiting ? (
                <div className="fixed right-2 bottom-2 bg-slate-900 border-pink-700 text-gray-200 border-2 text-xl rounded p-2">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin w-12 h-8"
                  />
                </div>
              ) : (
                <Line data={weekGraph} options={options} />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div className="p-2" />

        <div className="flex gap-3">
          {
            // The following will be used later when user wants to look at a specific exercise/workout
            <SearchForTemplate
              setSelectedExercise={(exercise) => setSelected(exercise)}
              templates={() => (exercises ? exercises : [])}
            />
          }
          <button
            onClick={() => deleteExercise()}
            className="text-lg text-gray-200 rounded border-2 border-violet-800 bg-violet-800 p-1"
          >
            Delete
          </button>
        </div>
      </main>
    </>
  );
};

export default AnalyzePage;

function getRandomColor() {
  const letters = "0123456789ABCDEF".split("");
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
