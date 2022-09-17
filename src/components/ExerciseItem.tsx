import autoAnimate from "@formkit/auto-animate";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExerciseSet } from "@prisma/client";
import { useRef, useState, useEffect } from "react";

type ExerciseItemProps = {
  name: string;
  description: string;
  setsInfo: ExerciseSet[];
  updateSets: (sets: ExerciseSet[]) => void;
  id: number;
};

export const ExerciseItem = ({
  name,
  description,
  setsInfo,
  updateSets,
  id,
}: ExerciseItemProps) => {
  const [show, setShow] = useState(false);
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => setShow(!show);

  return (
    <div
      ref={parent}
      className="flex flex-col border-2 border-pink-700 rounded"
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
        <SetList updateSets={updateSets} setsInfo={setsInfo} exerciseId={id} />
      )}
    </div>
  );
};

type SetListProps = {
  setsInfo: ExerciseSet[];
  exerciseId: number;
  updateSets: (sets: ExerciseSet[]) => void;
};

const SetList = ({ setsInfo, exerciseId, updateSets }: SetListProps) => {
  const [sets, setSets] = useState(setsInfo);
  const child = useRef(null);
  useEffect(() => {
    child.current && autoAnimate(child.current);
  }, [child]);

  useEffect(() => {
    updateSets(sets);
  }, [sets]);

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
                onChange={(e) =>
                  setSets((prev) => {
                    const next = [...prev];
                    const item = next[index];
                    if (item) {
                      item.reps = getValidNumber(e.target.value);
                      next[index] = item;
                    }
                    return next;
                  })
                }
              />
              <div className="p-1" />
              <input
                className="p-1 hover:cursor-default w-12 bg-transparent border-2 border-pink-700 rounded"
                value={set.rest}
                onChange={(e) =>
                  setSets((prev) => {
                    const next = [...prev];
                    const item = next[index];
                    if (item) {
                      next[index]!.rest = getValidNumber(e.target.value);
                      next[index] = item;
                    }
                    return next;
                  })
                }
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col justify-center">
        <button
          onClick={() =>
            setSets((prev) => {
              const newSet: ExerciseSet = {
                id: 0,
                reps: 5,
                rest: 60,
                weigth: 0,
                exerciseId: null,
                workoutExerciseId: exerciseId,
              };
              return [...prev, newSet];
            })
          }
          className="border-2 rounded border-pink-700 text-gray-200 p-1 h-10"
        >
          <FontAwesomeIcon icon={faPlus} className="w-6" />
        </button>
      </div>
    </section>
  );
};
