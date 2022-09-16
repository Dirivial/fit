import autoAnimate from "@formkit/auto-animate";
import { ExerciseSet } from "@prisma/client";
import { useRef, useState, useEffect } from "react";

type ExerciseItemProps = {
  name: string;
  description: string;
  setsInfo: ExerciseSet[];
  id: number;
};

export const ExerciseItem = ({
  name,
  description,
  setsInfo,
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
        <section className="flex justify-around rounded shadow-xl">
          <div className="flex flex-col justify-center text-lg p-2 text-center text-gray-200">
            <h3>Sets</h3>
            <div className="flex">
              <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
                +
              </button>
              <p className="p-1 hover:cursor-default">{setsInfo[0]?.sets}</p>
              <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
                -
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center text-lg p-2 text-center text-gray-200">
            <h3>Reps</h3>
            <div className="flex">
              <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
                +
              </button>
              <p className="p-1 hover:cursor-default">{setsInfo[0]?.reps}</p>
              <button className="p-1 rounded-full text-indigo-500 duration-300 motion-safe:hover:scale-150">
                -
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
