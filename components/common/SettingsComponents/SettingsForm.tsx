"use client";

import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import PreviewImage from "@/components/ClientSidePages/Signup/components/PreviewImage";
import type { IUser } from "@/types/interfaces";

const SignupSchema = Yup.object().shape({
  mainPicture: Yup.mixed().notRequired(),
  username: Yup.string().notRequired().min(2, "Atleast 2 characters"),
  name: Yup.string().notRequired().min(2, "Atleast 2 characters"),
  lastname: Yup.string().notRequired().min(2, "Atleast 2 characters"),
  email: Yup.string().email("Invalid email").notRequired(),
});

export default function SettingsForm({ user }: { user: IUser }) {
  const router = useRouter();

  return (
    <div className={`my-10 flex items-center justify-center lg:mr-10`}>
      <div className="w-[400px] rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Edit your profile
        </h2>
        <Formik
          initialValues={{
            email: "",
            name: "",
            lastname: "",
            username: "",
            mainPicture: "" as File | string,
          }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (
              (values.email === "" || values.email === user.email) &&
              (values.name === "" || values.name === user.name) &&
              (values.username === "" || values.username === user.username) &&
              (values.lastname === "" || values.lastname === user.lastname) &&
              !values.mainPicture
            ) {
              toast.error("Data are the same or not specified");
              return setSubmitting(false);
            }

            const token = Cookies.get("token");

            const dataSubmit = async () => {
              toast.loading("Wait, we are editing your profile");
              try {
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
                  } else return null;
                };

                const mainImg = await imageLoaded();

                const res = await axios
                  .put(
                    `${baseUrl}/api/user`,
                    { ...values, mainPicture: mainImg },
                    { headers: { Authorization: token } },
                  )
                  .catch((error) => {
                    if (error.response) {
                      toast.dismiss();
                      toast.error(error.response.data.error);
                      setSubmitting(false);

                      throw new AxiosError(error.response.data.error);
                    }
                  });

                setSubmitting(false);

                toast.dismiss();
                toast.success("Data is successfully changed");
                router.refresh();
              } catch (error) {
                resetForm();

                console.error(error);
              } finally {
                resetForm();
              }
            };

            dataSubmit();
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
                  placeholder={`current: ${user.username}`}
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
                  placeholder={`current: ${user.email}`}
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
                  Your name
                </label>
                <Field
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
                  id="name"
                  name="name"
                  placeholder={`current: ${
                    user.name ? user.name : "not specified"
                  }`}
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
                  Your last name
                </label>
                <Field
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none"
                  id="lastname"
                  name="lastname"
                  placeholder={`current: ${
                    user.lastname ? user.lastname : "not specified"
                  }`}
                  type="text"
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              {/* <div className="bg-white mb-10">
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
              </div> */}

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
                  <div className="mt-2 text-red-500">{errors.mainPicture}</div>
                )}

                {values.mainPicture && (
                  <PreviewImage file={values.mainPicture} />
                )}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Save changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
