import { faCheck, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox, Transition } from "@headlessui/react";
import { ExerciseTemplate } from "@prisma/client";
import { Fragment, useEffect, useState } from "react";

type SearchForTemplateType = {
  templates: ExerciseTemplate[];
  setSelectedExercise: (exercise: ExerciseTemplate) => void;
};

const SearchForTemplate = ({
  templates,
  setSelectedExercise,
}: SearchForTemplateType) => {
  const [selected, setSelected] = useState<ExerciseTemplate>();
  const [exercises, setExercises] = useState<ExerciseTemplate[]>(templates);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (selected) setSelectedExercise(selected);
  }, [selected]);

  const filteredExercises =
    query === ""
      ? exercises
      : exercises.filter((exercise) => {
          return exercise.name.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <>
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-violet-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-200 bg-violet-700 focus:ring-0"
              displayValue={() => (selected ? selected.name : "")}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FontAwesomeIcon
                icon={faSort}
                className="text-gray-200 w-5 h-5"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredExercises.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredExercises.map((ExerciseTemplate) => (
                  <Combobox.Option
                    key={ExerciseTemplate.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-voilet-600 text-gray-200" : "text-gray-200"
                      }`
                    }
                    value={ExerciseTemplate}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {ExerciseTemplate.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-gray-200"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-gray-200 w-5 h-5"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
  );
};

export default SearchForTemplate;
