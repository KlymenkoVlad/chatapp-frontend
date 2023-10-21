"use client";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import PreviewImage from "./components/PreviewImage";

const SignupSchema = Yup.object().shape({
  mainPicture: Yup.mixed(),
  username: Yup.string()
    .min(2, "Atleast 2 characters")
    .required("Username is required"),
  name: Yup.string().notRequired().min(2, "Atleast 2 characters"),
  lastname: Yup.string().notRequired().min(2, "Atleast 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  terms: Yup.boolean()
    .required("You need to accept our terms")
    .oneOf([true], "You need to accept our terms"),
});

export default function Signup() {
  const router = useRouter();

  return (
    <div className={`min-h-screen flex items-center justify-center `}>
      <div className="max-w-md w-full p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up</h2>
        <Formik
          initialValues={{
            email: "",
            name: "",
            lastname: "",
            password: "",
            username: "",
            terms: true,
            mainPicture: "" as File | string,
          }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            const dataSubmit = async () => {
              const imageLoaded = async () => {
                if (values.mainPicture instanceof File) {
                  const formData = new FormData();
                  formData.append("file", values.mainPicture);
                  formData.append("upload_preset", "Messenger");
                  const resMain = await axios.post(
                    `https://api.cloudinary.com/v1_1/dw0j1mmbp/image/upload`,
                    formData
                  );
                  return resMain.data.secure_url as string;
                }
              };

              const mainImg = await imageLoaded();

              const body = {
                email: values.email,
                name: values.name.length < 2 ? undefined : values.name,
                lastname:
                  values.lastname.length < 2 ? undefined : values.lastname,
                password: values.password,
                username: values.username,
                mainPicture: mainImg ? mainImg : undefined,
              };

              console.log(body);
              const res = await axios.post(`${baseUrl}/api/signup`, body);
              Cookies.set("token", res.data.token);

              const { data } = await axios.get(`${baseUrl}/api/login`, {
                headers: { Authorization: res.data.token },
              });

              useChatStore.setState({ userId: data._id });

              router.push("/");
              setSubmitting(false);
            };

            toast.promise(dataSubmit(), {
              loading: "Wait, we are creating your account",
              success: <b>Welcome, {values.username}</b>,
              error: <b>Oh, something is went very-very wrong</b>,
            });
          }}
        >
          {({ isSubmitting, setFieldValue, values, errors }) => (
            <Form>
              <div className="bg-white mb-10">
                <label
                  className=" bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="username"
                >
                  Your username
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  id="username"
                  name="username"
                  type="text"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className=" bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="email"
                >
                  Your email
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  id="email"
                  name="email"
                  type="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className="bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="name"
                >
                  Your name <span className="text-red-500">(optional)</span>
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                 invalid:border-pink-500 invalid:text-pink-600
                 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  id="name"
                  name="name"
                  type="text"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className="bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="lastname"
                >
                  Your last name
                  <span className="text-red-500">(optional)</span>
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                 invalid:border-pink-500 invalid:text-pink-600
                 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  id="lastname"
                  name="lastname"
                  type="text"
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className=" bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="password"
                >
                  Your Password
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  name="password"
                  type="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="file_input"
                >
                  Choose main picture of product
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-sky-700 dark:border-sky-600 dark:placeholder-gray-400"
                  id="file_input"
                  accept="image/*"
                  name="mainPicture"
                  type="file"
                  onChange={(event) => {
                    const files = event?.target.files;
                    if (files && files.length > 0) {
                      setFieldValue("mainPicture", files[0]);
                    }
                  }}
                />
                {errors.mainPicture && (
                  <div className="mt-2 text-red-500">{errors.mainPicture}</div>
                )}

                {values.mainPicture && (
                  <PreviewImage file={values.mainPicture} />
                )}
              </div>

              <div className="mb-6">
                <label>
                  <Field name="terms" type="checkbox" className="mr-2" />
                  Agree to the privacy policy
                </label>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className="mt-2 text-red-500 mb-6"
                />
              </div>

              <Link href="/login" className="my-8 ">
                <p className="text-black hover:text-blue-500 transition-colors duration-600 ease-in-out ">
                  Already have an account?
                </p>
              </Link>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-full w-full hover:bg-blue-600"
                >
                  Sign Up
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
