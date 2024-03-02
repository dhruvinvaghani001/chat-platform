import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { DevTool } from "@hookform/devtools";
import { autheticateUser } from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login as StoreLogin } from "../context/authSlice";
import { useDispatch } from "react-redux";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onsubmit = async (data) => {
    try {
      const formdata = new FormData();
      for (let key in data) {
        if (key != "avatar") {
          formdata.append(key, data[key]);
        } else {
          formdata.append(key, data.avatar[0]);
        }
      }
      const res = await autheticateUser({
        serverURL: type,
        data: type == "login" ? data : formdata,
      });
      console.log(res);
      if (type === "login" && res.status === 200) {
        toast.success(res?.data?.message);
        dispatch(StoreLogin({ user: res.data.data }));
        navigate("/");
      } else {
        toast.success(res?.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col">
        {type == "signup" && (
          <div className="form_controls flex flex-col ">
            <Input
              title="username"
              placeholder="enter username"
              {...register("username", { required: true })}
              classNameLabel=""
              classNameInput
            />
            {errors.username && (
              <span className="error_text">This field is required</span>
            )}
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
          {errors.email && (
            <span className="error_text">This field is required</span>
          )}
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
          {errors.password && (
            <span className="error_text">This field is required</span>
          )}
        </div>
        {type == "signup" && (
          <div className="form_controls flex flex-col ">
            <Input
              title="confirm password"
              type="password"
              placeholder="confirm password"
              {...register("confirmPassword", { required: true })}
              classNameLabel=""
              classNameInput=""
            />
            {errors.confirmPassword && (
              <span className="error_text">This field is required</span>
            )}
          </div>
        )}
        {type == "signup" && (
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
            {errors.avatar && (
              <span className="error_text">This field is required</span>
            )}
          </div>
        )}
        <Button className="mt-8" type="submit">
          {type == "signup" ? "SignUp" : "Login"}
        </Button>
      </form>
      <DevTool control={control}></DevTool>
    </>
  );
};

export default AuthForm;
