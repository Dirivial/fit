import { Dialog, Transition, Combobox } from "@headlessui/react";
import { ExerciseTemplate } from "@prisma/client";
import { Fragment, useState } from "react";
import { trpc } from "../../utils/trpc";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faCheck } from "@fortawesome/free-solid-svg-icons";

type AddWorkoutModalProps = {
  userid: number;
  open: boolean;
  closeModal: () => void;
};

export const AddWorkoutModal = ({
  userid,
  open,
  closeModal,
}: AddWorkoutModalProps) => {
  const exercises = trpc.useQuery(["exerciseTemplate.getAll", { id: userid }]);
  const [selected, setSelected] = useState<ExerciseTemplate>();
  const [query, setQuery] = useState("");

  const addExercise = () => {
    //trpc.useQuery([""])
  };

  if (exercises.data) {
    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md border-2 border-pink-700 transform overflow-hidden rounded bg-slate-900 p-6 text-middle align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-200"
                  >
                    Add Exercise
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Search for an exercise:
                    </p>
                    <Combobox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-pink-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                          <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-200 bg-pink-700 focus:ring-0"
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
                            {exercises.data.length === 0 && query !== "" ? (
                              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                              </div>
                            ) : (
                              exercises.data.map((ExerciseTemplate) => (
                                <Combobox.Option
                                  key={ExerciseTemplate.id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-pink-600 text-gray-200"
                                        : "text-gray-200"
                                    }`
                                  }
                                  value={ExerciseTemplate}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {ExerciseTemplate.name}
                                      </span>
                                      {selected ? (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active
                                              ? "text-white"
                                              : "text-gray-200"
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
                  </div>

                  <div className="flex justify-between">
                    {" "}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  } else {
    return <div />;
  }
};
