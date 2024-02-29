import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { DevTool } from "@hookform/devtools";

const AuthForm = ({ type }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onsubmit = (data) => {
    if(type=="login"){}
  };

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col">
        {type == "sign-up" && (
          <div className="form_controls flex flex-col ">
            <Input
              title="username"
              placeholder="enter username"
              {...register("username", { required: true })}
              classNameLabel=""
              classNameInput
            />
            {errors.username && <span>This field is required</span>}
          </div>
        )}
        <div className="form_controls flex flex-col ">
          <Input
            title="email"
            type="email"
            placeholder="enter email"
            {...register("email", { required: true })}
            classNameLabel=""
            classNameInput=""
          />
          {errors.username && <span>This field is required</span>}
        </div>
        <div className="form_controls flex flex-col ">
          <Input
            title="password"
            type="password"
            placeholder="enter password"
            {...register("password", { required: true })}
            classNameLabel=""
            classNameInput=""
          />
          {errors.username && <span>This field is required</span>}
        </div>
        {type == "sign-up" && (
          <div className="form_controls flex flex-col ">
            <Input
              title="confirm password"
              type="password"
              placeholder="confirm password"
              {...register("confirmpassword", { required: true })}
              classNameLabel=""
              classNameInput=""
            />
            {errors.username && <span>This field is required</span>}
          </div>
        )}
        {type == "sign-up" && (
          <div className="form_controls flex flex-col ">
            <Input
              title="avatar"
              type="file"
              placeholder="chosse file"
              accept="image/png, image/jpg, image/jpeg"
              {...register("avatar", { required: true })}
              classNameLabel=""
              classNameInput="px-0 py-0"
            />
            {errors.username && <span>This field is required</span>}
          </div>
        )}
        <Button className="mt-8" type="submit">
          Signin
        </Button>
      </form>
      <DevTool control={control}></DevTool>
    </>
  );
};

export default AuthForm;
