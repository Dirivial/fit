import { Dialog, Transition } from "@headlessui/react";
import { Workout } from "@prisma/client";
import { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type CreateWorkoutModalProps = {
  userid: string;
  open: boolean;
  addWorkout: (workout: Workout) => void;
  closeModal: () => void;
};

export const CreateWorkoutModal = ({
  userid,
  open,
  addWorkout,
  closeModal,
}: CreateWorkoutModalProps) => {
  const context = trpc.useContext();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const createWorkout = async () => {
    setLoading(true);
    // Create a new workout, then add it to the list
    const res = await context.fetchQuery([
      "workout.create",
      {
        name: name,
        description: desc,
        userid: userid,
      },
    ]);
    addWorkout(res);
    setLoading(false);
    closeModal();
  };

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
                  Create Workout
                </Dialog.Title>

                <div className="pt-2 text-gray-300">
                  <div className="flex flex-col gap-2">
                    <label className="">
                      What do you want to call the workout?
                    </label>
                    <input
                      className="rounded bg-slate-900 border-2 border-pink-700 p-1"
                      value={name}
                      onChange={(e) => {
                        if (e.target.value.length < 64) {
                          setName(e.target.value);
                        } else {
                          console.log(
                            "Trying to name a workout with a name longer than 64 characters"
                          );
                        }
                      }}
                    />
                    <label className="text-center">Describe the workout</label>
                    <input
                      className="rounded bg-slate-900 border-2 border-pink-700 p-1"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    {" "}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-pink-900 px-4 py-2 text-sm font-medium text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-900 px-4 py-2 text-sm font-medium text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={createWorkout}
                      >
                        {loading ? (
                          <div className="text-lg font-semibold text-grey-200 p-1">
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className="animate-spin w-4"
                            />
                          </div>
                        ) : (
                          <p>Save</p>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
