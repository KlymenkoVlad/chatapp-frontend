"use client";

import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
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
    <div className={`min-h-screen flex items-center justify-center `}>
      <div className="max-w-md w-full p-4 bg-white shadow-lg rounded-lg">
        <Image
          src="/app-logo.png"
          width={80}
          height={80}
          alt="logo"
          className="mx-auto mb-5"
        />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
          Messenger
        </h1>
        <h2 className="text-xl text-gray-800 mb-4 text-center">
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

              useChatStore.setState({ userId: data._id });

              toast.dismiss();
              toast.success("Logged in successfully");

              setSubmitting(false);
              router.push("/");
            };

            dataSubmit();
          }}
        >
          {() => (
            <Form>
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

              <Link href="/signup" className="my-8 ">
                <p className="text-black hover:text-blue-500 transition-colors duration-600 ease-in-out ">
                  Don`t have account?
                </p>
              </Link>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-full w-full hover:bg-blue-600"
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
