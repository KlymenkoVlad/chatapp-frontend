"use client";

import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import Image from "next/image";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const router = useRouter();

  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
        <Image
          src="/app-logo.png"
          width={80}
          height={80}
          alt="logo"
          className="mx-auto mb-5"
        />
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-800">
          Messenger
        </h1>
        <h2 className="mb-4 text-center text-xl text-gray-800">
          Below you can login
        </h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting }) => {
            const dataSubmit = async () => {
              toast.loading("Wait, we are logging you in");
              const res = await axios
                .post(`${baseUrl}/api/login`, values)
                .catch((error) => {
                  if (error) {
                    toast.dismiss();
                    toast.error(error.response.data.error);
                    setSubmitting(false);

                    console.error(error.response.data.error);
                  }
                });

              Cookies.set("token", res?.data.token);

              const { data } = await axios.get(`${baseUrl}/api/login`, {
                headers: { Authorization: res?.data.token },
              });

              localStorage.setItem("userId", data._id);

              toast.dismiss();
              toast.success("Logged in successfully");

              setSubmitting(false);
              router.push("/chat");
            };

            dataSubmit();
          }}
        >
          {() => (
            <Form>
              <div className="mb-10 bg-white">
                <label
                  className="bottom-8 left-0 -translate-y-2 text-sm text-gray-500 transition-transform duration-300"
                  htmlFor="email"
                >
                  Your email
                </label>
                <Field
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
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

              <div className="mb-10 bg-white">
                <label
                  className="bottom-8 left-0 -translate-y-2 text-sm text-gray-500 transition-transform duration-300"
                  htmlFor="password"
                >
                  Your Password
                </label>
                <Field
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
                  name="password"
                  type="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <Link href="/signup" className="my-8">
                <p className="duration-600 text-black transition-colors ease-in-out hover:text-blue-500">
                  Don`t have account?
                </p>
              </Link>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Log in
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
