import autoAnimate from "@formkit/auto-animate";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExerciseSet } from "@prisma/client";
import { useRef, useState, useEffect } from "react";

type ExerciseItemProps = {
  name: string;
  setsInfo: ExerciseSet[];
  updateSets: (sets: ExerciseSet[], changed: boolean) => void;
  logExercise: (sets: ExerciseSet[]) => void;
  saveExercise: (sets: ExerciseSet[]) => void;
  deleteExercise: () => void;
  id: number;
};

export const ExerciseItem = ({
  name,
  setsInfo,
  updateSets,
  logExercise,
  saveExercise,
  deleteExercise,
  id,
}: ExerciseItemProps) => {
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const [updatedSets, setUpdatedSets] = useState<ExerciseSet[]>(setsInfo);
  const [changed, setChanged] = useState<boolean>(false);

  const updateSet = (aSet: ExerciseSet, index: number) => {
    setChanged(true);
    setUpdatedSets((prev) => {
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
    setUpdatedSets((prev) => {
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
          setsInfo={setsInfo}
          exerciseId={id}
          removeSet={removeSet}
          logExercise={logExercise}
          saveExercise={saveExercise}
          deleteExercise={deleteExercise}
        />
      )}
    </div>
  );
};

type SetListProps = {
  setsInfo: ExerciseSet[];
  exerciseId: number;
  updateSet: (aSet: ExerciseSet, index: number) => void;
  removeSet: () => void;
  saveExercise: (sets: ExerciseSet[]) => void;
  logExercise: (sets: ExerciseSet[]) => void;
  deleteExercise: () => void;
};

const SetList = ({
  setsInfo,
  exerciseId,
  updateSet,
  removeSet,
  saveExercise,
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
        <div className="flex sm:flex-col flex-row justify-center gap-5 sm:gap-0 text-lg p-2 text-center text-gray-200">
          <h3>Reps</h3>
          <div className="p-2" />
          <h3>Rest</h3>
          <div className="p-2" />
          <h3>Weight</h3>
        </div>
        <div ref={child} className="flex flex-col sm:flex-row">
          {sets.map((set, index) => {
            return (
              <div
                key={index}
                className="flex sm:flex-col flex-row justify-center gap-5 sm:gap-0 text-lg p-2 text-center text-gray-200"
              >
                <input
                  className="p-1 w-12 bg-transparent border-2 border-pink-700 rounded"
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
                  className="p-1 w-12 bg-transparent border-2 border-pink-700 rounded"
                  value={set.rest}
                  onChange={(e) => {
                    let newSet = null;
                    setSets((prev) => {
                      const next = [...prev];
                      const item = next[index];
                      if (item) {
                        next[index]!.rest = getValidNumber(e.target.value);
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
                  className="p-1 w-12 bg-transparent border-2 border-pink-700 rounded"
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
        <div className="flex sm:flex-col justify-evenly gap-2 p-2">
          <button
            onClick={() => {
              const newSet: ExerciseSet = {
                id: 0,
                reps: 5,
                rest: 60,
                weight: 0,
                exerciseId: null,
                workoutExerciseId: exerciseId,
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
          onClick={() => saveExercise(sets)}
          className="border-2 rounded border-indigo-900 bg-indigo-900 text-gray-200 p-1 flex-grow flex justify-center items-center"
        >
          Save
        </button>

        <button
          onClick={() => logExercise(sets)}
          className="border-2 rounded border-pink-700 text-gray-200 p-1 flex-grow flex justify-center items-center"
        >
          Log
        </button>
        <button
          onClick={deleteExercise}
          className="border-2 rounded border-pink-700 bg-pink-700 text-gray-200 p-1 flex-grow flex justify-center items-center"
        >
          Delete
        </button>
      </div>
    </section>
  );
};
