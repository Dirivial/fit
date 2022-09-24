import autoAnimate from "@formkit/auto-animate";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExerciseSet } from "@prisma/client";
import { useRef, useState, useEffect } from "react";

type ExerciseItemProps = {
  name: string;
  description: string;
  setsInfo: ExerciseSet[];
  updateSets: (sets: ExerciseSet[], changed: boolean) => void;
  updatePerformed: () => void;
  id: number;
};

export const ExerciseItem = ({
  name,
  description,
  setsInfo,
  updateSets,
  updatePerformed,
  id,
}: ExerciseItemProps) => {
  const [show, setShow] = useState(false);
  const parent = useRef(null);
  const [updatedSets, setUpdatedSets] = useState<ExerciseSet[]>(setsInfo);
  const [changed, setChanged] = useState<boolean>(false);
  const [exercisePerformed, setExercisePerformed] = useState(false);

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

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => {
    setShow(!show);
    updateSets(updatedSets, changed);
    setChanged(false);
  };

  const clickPerformed = () => {
    setExercisePerformed((prev) => !prev);
    updatePerformed();
  };

  return (
    <div className="flex flex-row items-center">
      {exercisePerformed ? (
        <button
          onClick={clickPerformed}
          className={"border-2 rounded border-pink-700 text-gray-200 p-1 h-10"}
        >
          <FontAwesomeIcon icon={faCheck} className="w-6" />
        </button>
      ) : (
        <button
          onClick={clickPerformed}
          className={"border-2 rounded border-pink-700 text-gray-200 p-1 h-10"}
        >
          <div className="w-6" />
        </button>
      )}

      <div className="p-1" />
      <div
        ref={parent}
        className="flex flex-col flex-grow border-2 border-pink-700 rounded"
      >
        <section
          onClick={reveal}
          className="flex flex-row flex-grow justify-center shadow-xl"
        >
          <div className="p-6 flex-grow">
            <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-violet-700 via-pink-700 to-red-600">
              {name}
            </h2>
            <div className="p-2" />
            <p className="text-sm text-gray-200">{description}</p>
          </div>
        </section>

        {show && (
          <SetList updateSet={updateSet} setsInfo={setsInfo} exerciseId={id} />
        )}
      </div>
    </div>
  );
};

type SetListProps = {
  setsInfo: ExerciseSet[];
  exerciseId: number;
  updateSet: (aSet: ExerciseSet, index: number) => void;
};

const SetList = ({ setsInfo, exerciseId, updateSet }: SetListProps) => {
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
    <section className="flex justify-start rounded shadow-xl">
      <div className="flex flex-col justify-center text-lg p-2 text-center text-gray-200">
        <h3>Reps</h3>
        <div className="p-2" />
        <h3>Rest</h3>
        <div className="p-2" />
        <h3>Weight</h3>
      </div>
      <div ref={child} className="flex overflow-x-scroll">
        {sets.map((set, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center text-lg p-2 text-center text-gray-200"
            >
              <input
                className="p-1 hover:cursor-default w-12 bg-transparent border-2 border-pink-700 rounded"
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
                className="p-1 hover:cursor-default w-12 bg-transparent border-2 border-pink-700 rounded"
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
                className="p-1 hover:cursor-default w-12 bg-transparent border-2 border-pink-700 rounded"
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
      <div className="flex flex-col justify-center">
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
          className="border-2 rounded border-pink-700 text-gray-200 p-1 h-10"
        >
          <FontAwesomeIcon icon={faPlus} className="w-6" />
        </button>
        <div className="p-1" />
        <button
          onClick={() => {
            setSets((prev) => {
              const sets = [...prev];
              sets.pop();
              return sets;
            });
          }}
          className="border-2 rounded border-pink-700 text-gray-200 p-1 h-10"
        >
          <FontAwesomeIcon icon={faMinus} className="w-6" />
        </button>
      </div>
    </section>
  );
};
