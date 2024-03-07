import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { requestHandler } from "../../utills";
import { searchAvailableUser } from "../../api/api";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

const ComboBox = ({ selected, setSelected, alredyMembers }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  console.log(alredyMembers);

  useEffect(() => {
    requestHandler(
      async () => await searchAvailableUser(),
      setLoading,
      (res) => {
        const { data } = res;
        setUsers(data || []);
      },
      (err) => {
        toast.error(err);
      }
    );
  }, []);

  const filteredPeople =
    query === ""
      ? users
      : users.filter((user) =>
          user.username
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div>
      {" "}
      <div className="">
        <Combobox value={selected} onChange={setSelected}>
          <div className="">
            <div className=" w-full cursor-default overflow-hidden rounded-lg  text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-white focus:ring-0 focus:outline-none "
                displayValue={() => selected.username}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className=" mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {filteredPeople.length === 0 && query !== "" ? (
                  <div className=" cursor-default select-none px-4 py-2 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredPeople.map((user) => {
                    if (!alredyMembers?.includes(user._id.toString())) {
                      return (
                        <Combobox.Option
                          key={user._id}
                          className={({ active }) =>
                            `cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-900 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={user}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {user.username}
                              </span>
                            </>
                          )}
                        </Combobox.Option>
                      );
                    }
                  })
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
};

export default ComboBox;
