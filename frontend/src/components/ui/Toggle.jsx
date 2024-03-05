import { Switch } from "@headlessui/react";
import React from "react";

const Toggle = ({ enabled, setEnabled }) => {
  return (
    <>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-" : "bg-transperenty"}
    relative inline-flex h-[28px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75 bg-slate-500 `}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "bg-green-600 translate-x-9" : "bg-white translate-x-0"}
      pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </>
  );
};

export default Toggle;
