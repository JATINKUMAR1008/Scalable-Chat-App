"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { login } from "../../../services/auth/auth.service";
import toast from "react-hot-toast";
import { useState } from "react";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginPage() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const res = await login(values);
      if (res.status) {
        toast.success("Logged in successfully");
        router.push("/chat");
      } else {
        toast.error(res.message);
      }
    },
  });
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-sm h-fit text-center ">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="max-w-xs my-4 capitalize font-semibold text-sm mb-5">
          login into your account to chat with your friends
        </p>
        <form className="w-full mt-4" onSubmit={formik.handleSubmit}>
          <span className="flex flex-col items-start w-full">
            <label
              htmlFor="email-input"
              className="capitalize  font-semibold text-sm"
            >
              Email
            </label>
            <input
              className="w-full  bg-transparent px-1 py-1   border-b-[1px] border-gray-600 outline-none focus:border-gray-200"
              id="email-input"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && formik.touched.email ? (
              <p className="text-sm font-extralight text-red-400 mt-1">
                {formik.errors.email}
              </p>
            ) : null}
          </span>
          <span className="flex flex-col items-start w-full my-3">
            <label
              htmlFor="password-input"
              className="capitalize  font-semibold text-sm"
            >
              password
            </label>
            <input
              className="w-full  bg-transparent px-1 py-1   border-b-[1px] border-gray-600 outline-none focus:border-gray-200"
              id="password-input"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && formik.touched.password ? (
              <p className="text-sm font-extralight text-red-400 mt-1 ">
                {formik.errors.password}
              </p>
            ) : null}
          </span>
          <button className="w-full text-black py-2  font-semibold dark:bg-white bg-primary text-primary-foreground">
            Sign In
          </button>
        </form>
        <div>
          <p className="text-sm font-semibold mt-3">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer ml-1"
              onClick={() => router.push("/auth/register")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
