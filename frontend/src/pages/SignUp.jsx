import React, { useRef } from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onesubmit = (data) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="form_controls flex flex-col ">
          <Input
            title="username"
            placeholder="enter username"
            {...register("username", { required: true })}
          />
          {errors.username && <span>This field is required</span>}
        </div>

        <button type="submit">submir</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default SignUp;
