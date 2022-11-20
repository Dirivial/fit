import autoAnimate from "@formkit/auto-animate";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExerciseSet, Prisma } from "@prisma/client";
import { useRef, useState, useEffect, useMemo } from "react";
import { json } from "stream/consumers";

type ExerciseItemProps = {
  name: string;
  setsInfo: Prisma.JsonValue;
  updateSets: (sets: Prisma.JsonValue, changed: boolean) => void;
  logExercise: (sets: GenericSet[]) => void;
  deleteExercise: () => void;
  id: number;
};

export type GenericSet = {
  weight: number;
  reps: number;
};

export const ExerciseItem = ({
  name,
  setsInfo,
  updateSets,
  logExercise,
  deleteExercise,
  id,
}: ExerciseItemProps) => {
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const [updatedSets, setUpdatedSets] = useState<Prisma.JsonValue>(setsInfo);
  const [changed, setChanged] = useState<boolean>(false);

  const convertedSets = useMemo(() => {
    if (setsInfo && typeof setsInfo === "object" && Array.isArray(setsInfo)) {
      return setsInfo as GenericSet[];
    }
  }, [setsInfo]);

  const [exerciseSets, setExerciseSets] = useState(
    convertedSets ? convertedSets : []
  );

  useEffect(() => {
    setUpdatedSets(exerciseSets);
  }, [exerciseSets]);

  const updateSet = (aSet: GenericSet, index: number) => {
    setChanged(true);
    setExerciseSets((prev) => {
      const newSets = [...prev];
      if (newSets.length <= index) {
        newSets.push(aSet);
        return newSets;
      }
      newSets[index] = aSet;
      return newSets;
    });
  };

  const removeSet = () => {
    setChanged(true);
    setExerciseSets((prev) => {
      const next = [...prev];
      next.pop();
      return next;
    });
  };

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => {
    setShow((prev) => !prev);
    if (changed) {
      updateSets(updatedSets, true);
      setChanged(false);
    }
  };

  return (
    <div
      ref={parent}
      className="flex flex-col flex-grow border-2 border-pink-700 rounded"
    >
      <section className="flex flex-grow justify-center shadow-xl">
        <div onClick={reveal} className="p-6 flex-grow flex flex-row">
          <h2 className="text-xl flex-grow font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-violet-700 via-pink-700 to-red-600">
            {name}
          </h2>
          <div className="p-4" />
        </div>
      </section>

      {show && (
        <SetList
          updateSet={updateSet}
          setsInfo={exerciseSets}
          removeSet={removeSet}
          logExercise={logExercise}
          deleteExercise={deleteExercise}
        />
      )}
    </div>
  );
};

type SetListProps = {
  setsInfo: GenericSet[];
  updateSet: (aSet: GenericSet, index: number) => void;
  removeSet: () => void;
  logExercise: (sets: GenericSet[]) => void;
  deleteExercise: () => void;
};

const SetList = ({
  setsInfo,
  updateSet,
  removeSet,
  logExercise,
  deleteExercise,
}: SetListProps) => {
  const [sets, setSets] = useState(setsInfo);
  const child = useRef(null);

  useEffect(() => {
    child.current && autoAnimate(child.current);
  }, [child]);

  const getValidNumber = (value: string) => {
    const val = Number(value);
    return val < 1000 ? (val > -1 ? val : 0) : 999;
  };
  return (
    <section className="flex flex-col sm:flex-row rounded shadow-xl overflow-x-scroll">
      <div className="flex-grow flex flex-col sm:flex-row justify-start">
        <div className="flex sm:flex-col flex-row justify-around gap-5 sm:gap-0 text-lg p-2 text-center text-gray-200">
          <h3 className="h-2/5 pt-3">Reps</h3>
          <h3 className="h-2/5 pt-3">Weight</h3>
        </div>
        <div ref={child} className="flex flex-col sm:flex-row">
          {sets.map((set, index) => {
            return (
              <div
                key={index}
                className="flex sm:flex-col flex-row justify-evenly gap-5 sm:gap-0 text-xl p-2 text-center text-gray-200"
              >
                <input
                  className="p-1 w-16 h-2/5 bg-transparent border-2 border-pink-700 rounded"
                  value={set.reps}
                  onChange={(e) => {
                    let newSet = null;

                    setSets((prev) => {
                      const next = [...prev];
                      const item = next[index];
                      if (item) {
                        item.reps = getValidNumber(e.target.value);
                        next[index] = item;
                        newSet = item;
                      }
                      return next;
                    });
                    if (newSet) updateSet(newSet, index);
                  }}
                />
                <div className="p-1" />
                <input
                  className="p-1 w-16 h-2/5 bg-transparent border-2 border-pink-700 rounded"
                  value={set.weight}
                  onChange={(e) => {
                    let newSet = null;
                    setSets((prev) => {
                      const next = [...prev];
                      newSet = next[index];
                      if (newSet) {
                        newSet.weight = getValidNumber(e.target.value);
                        next[index] = newSet;
                      }
                      return next;
                    });
                    if (newSet) updateSet(newSet, index);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex sm:flex-col justify-around gap-2 p-2">
          <button
            onClick={() => {
              const newSet: GenericSet = {
                reps: 10,
                weight: 0,
              };

              updateSet(newSet, sets.length);
              setSets((prev) => {
                return [...prev, newSet];
              });
            }}
            className="border-2 rounded border-pink-700 text-gray-200 p-1 flex-grow flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="w-6" />
          </button>

          <button
            onClick={() => {
              setSets((prev) => {
                const sets = [...prev];
                sets.pop();
                return sets;
              });
              removeSet();
            }}
            className="border-2 rounded border-pink-700 text-gray-200 p-1 flex-grow flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faMinus} className="w-6" />
          </button>
        </div>
      </div>

      <div className="flex sm:flex-col flex-row justify-evenly gap-2 text-lg p-2 text-center text-gray-200">
        <button
          onClick={() => logExercise(sets)}
          className="border-2 rounded border-indigo-900 bg-indigo-900 text-gray-200 p-1 flex w-full justify-center items-center"
        >
          Log
        </button>
        <button
          onClick={deleteExercise}
          className="border-2 rounded border-pink-700 bg-pink-700 text-gray-200 p-1 flex w-full justify-center items-center"
        >
          Delete
        </button>
      </div>
    </section>
  );
};
