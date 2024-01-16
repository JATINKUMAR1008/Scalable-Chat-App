"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { createAccount } from "../../../services/auth/auth.service";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { MoveLeft, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export default function RegisterPage() {
  const [state, setState] = useState(false);
  const [imgpreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      file: null as File | null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const preset_key = process.env.NEXT_PUBLIC_PRESET_KEY;
      const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;
      if (values.file) {
        const data = new FormData();
        data.append("file", values.file as File);
        data.append("upload_preset", preset_key);

        const img_res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const img_data = await img_res.json();
        console.log(img_data);
        const { file, ...rest } = values;
        const sendableObject = {
          ...rest,
          imageUrl: img_data.secure_url,
          img_public_id: img_data.public_id,
          img_signature: img_data.signature,
        };
        const res = await createAccount(sendableObject);
        if (res.status) {
          toast.success("Account created successfully");
          router.push("/chat");
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Please upload your image");
      }
      setLoading(false);
    },
  });
  const handleImageUpload = async () => {
    const element = document.getElementById("imageUpload") as HTMLInputElement;
    if (element?.files) {
      const file = element.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        formik.setFieldValue("file", file);
        setImgPreview(url);
      }
    }
  };
  const handleRemoveImage = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    formik.setFieldValue("file", null);
    setImgPreview(null);
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-sm h-fit text-center ">
        <h1 className="text-2xl font-bold">
          {!state ? "Create Account" : "Upload Image"}
        </h1>
        <p className="max-w-md mb-10 font-semibold text-sm my-2">
          {!state
            ? "Start your journey to new era of chatting with anyone around you."
            : "Upload your image to complete your profile so that your firends can find you easily."}
        </p>
        <form className="w-full mt-4 relative" onSubmit={formik.handleSubmit}>
          {!state ? (
            <>
              <span className="flex w-full gap-1 items-center my-3">
                <span className="flex flex-col items-start w-full">
                  <label
                    htmlFor="fname-input"
                    className="capitalize  font-semibold text-sm"
                  >
                    First Name
                  </label>
                  <input
                    className="w-full  bg-transparent px-1 py-1  border-b-[1px] border-gray-600 outline-none focus:border-gray-200"
                    id="fname-input"
                    name="firstName"
                    type="text"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.firstName && formik.touched.firstName ? (
                    <p className="text-sm font-extralight text-red-400 mt-1">
                      {formik.errors.firstName}
                    </p>
                  ) : null}
                </span>
                <span className="flex flex-col items-start w-full">
                  <label
                    htmlFor="lname-input"
                    className="capitalize  font-semibold text-sm"
                  >
                    Last Name
                  </label>
                  <input
                    className="w-full  bg-transparent px-1 py-1   border-b-[1px] border-gray-600 outline-none focus:border-gray-200"
                    id="lname-input"
                    name="lastName"
                    type="text"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.lastName && formik.touched.lastName ? (
                    <p className="text-sm font-extralight text-red-400 mt-1">
                      {formik.errors.lastName}
                    </p>
                  ) : null}
                </span>
              </span>
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
              <button
                className="w-full text-black py-2  font-semibold dark:bg-white bg-primary text-primary-foreground"
                type="button"
                onClick={() => setState(true)}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
                ref={inputRef}
              />
              <div
                className="absolute -top-40 -left-5 cursor-pointer"
                onClick={() => setState(false)}
              >
                <span className="flex items-center gap-2">
                  <MoveLeft size={20} />
                  <p className="text-sm font-semibold">Back</p>
                </span>
              </div>

              <div
                className="w-full h-[300px] relative cursor-pointer outline-dotted my-2 outline-gray-400 outline-[2px] bg-gray-200 dark:bg-muted flex items-center justify-center"
                onClick={() => {
                  const element = document.getElementById("imageUpload");
                  if (element) {
                    element.click();
                  }
                }}
              >
                {imgpreview ? (
                  <Image
                    src={imgpreview}
                    alt="image"
                    fill
                    className="relative w-auto h-auto object-fit"
                  />
                ) : (
                  <p className="text-sm capitalize font-semibold">
                    Upload your image
                  </p>
                )}
              </div>
              {formik.values.file && (
                <div className="w-full h-10 bg-gray-300 dark:bg-muted my-2 flex items-center justify-between px-2">
                  <p className="text-xs font-extralight">
                    {formik.values.file.name}
                  </p>
                  <button className="px-2 py-2" onClick={handleRemoveImage}>
                    <X size={15} className="text-red-400" />
                  </button>
                </div>
              )}
              <button
                className="w-full text-black py-2  font-semibold dark:bg-white bg-primary text-primary-foreground"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader /> : "Sign Up"}
              </button>
            </>
          )}
        </form>
        <div>
          <p className="text-sm font-semibold mt-3">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer ml-1"
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
