"use client";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import PreviewImage from "./components/PreviewImage";
import Image from "next/image";

//TODO Fix string for submit image

const SignupSchema = Yup.object().shape({
  mainPicture: Yup.mixed(),
  username: Yup.string()
    .min(2, "Atleast 2 characters")
    .matches(/^\S+$/, "Username cannot contain empty spaces")
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
    <div className="relative">
      <div className={`my-4 flex h-fit items-center justify-center`}>
        <div className="z-10 w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
          <Image
            src="/app-logo.png"
            width={100}
            height={100}
            alt="logo"
            className="mx-auto mb-2 h-16 w-16"
          />
          <h1 className="mb-2 text-center text-3xl font-semibold text-gray-800">
            Messenger
          </h1>
          <h2 className="mb-4 text-center text-xl text-gray-800">
            Below you can signup
          </h2>
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
            onSubmit={async (values, { setSubmitting }) => {
              toast.loading("Wait, we are creating your account");
              const imageLoaded = async () => {
                if (values.mainPicture instanceof File) {
                  const formData = new FormData();
                  formData.append("file", values.mainPicture);
                  formData.append("upload_preset", "Messenger");
                  const resMain = await axios.post(
                    `https://api.cloudinary.com/v1_1/dw0j1mmbp/image/upload`,
                    formData,
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

              const res = await axios
                .post(`${baseUrl}/api/signup`, body)
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

              console.log(data._id);
              if (data._id) {
                return toast.error(
                  "Something went wrong with Authorization data",
                );
              }
              localStorage.setItem("userId", data._id);

              toast.dismiss();
              toast.success("Your account has been created");

              router.push("/chat");

              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values, errors }) => (
              <Form>
                <div className="mb-10 bg-white">
                  <label
                    className="bottom-8 left-0 -translate-y-2 text-sm text-gray-500 transition-transform duration-300"
                    htmlFor="username"
                  >
                    Your username
                  </label>
                  <Field
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
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
                    htmlFor="name"
                  >
                    Your name <span className="text-red-500">(optional)</span>
                  </label>
                  <Field
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
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

                <div className="mb-10 bg-white">
                  <label
                    className="bottom-8 left-0 -translate-y-2 text-sm text-gray-500 transition-transform duration-300"
                    htmlFor="lastname"
                  >
                    Your last name{" "}
                    <span className="text-red-500">(optional)</span>
                  </label>
                  <Field
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
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

                <div className="mb-10 bg-white">
                  <label
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Choose main picture of product
                  </label>
                  <input
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-sky-600 dark:bg-sky-700 dark:text-gray-400 dark:placeholder-gray-400"
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
                    <div className="mt-2 text-red-500">
                      {errors.mainPicture}
                    </div>
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
                    className="mb-6 mt-2 text-red-500"
                  />
                </div>

                <Link href="/login" className="my-8">
                  <p className="duration-600 text-black transition-colors ease-in-out hover:text-blue-500">
                    Already have an account?
                  </p>
                </Link>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Sign Up
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
