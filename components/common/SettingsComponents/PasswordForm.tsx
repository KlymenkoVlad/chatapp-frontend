"use client";

import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseUrl } from "@/utils/baseUrl";
import { useChatStore } from "@/src/store";
import PreviewImage from "@/components/ClientSidePages/Signup/components/PreviewImage";
import type { IUser } from "@/types/interfaces";
import { headers } from "next/headers";

const SignupSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  newPasswordConfirm: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .test("match", "Inputs must match", function (value) {
      // 'this' refers to the schema, so you can access 'input1' and 'input2' values using this.parent
      return value === this.parent.newPassword;
    }),
});

export default function PasswordForm({ user }: { user: IUser }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center mb-4">
      <div className="w-[400px]  p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800">
          Edit your password
        </h2>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={(
            { oldPassword, newPassword },
            { setSubmitting, resetForm }
          ) => {
            const token = Cookies.get("token");

            const dataSubmit = async () => {
              toast.loading("Wait, we are editing your password");
              try {
                const res = await axios
                  .post(
                    `${baseUrl}/api/user/updatePassword`,
                    { oldPassword, newPassword },
                    { headers: { Authorization: token } }
                  )
                  .catch(function (error) {
                    if (error.response) {
                      toast.dismiss();
                      toast.error(error.response.data.error);
                      setSubmitting(false);

                      throw new AxiosError(error.response.data.error);
                    }
                  });

                setSubmitting(false);

                toast.dismiss();
                toast.success("Password is successfully changed");
              } catch (error) {
                console.error(error);
              } finally {
                toast.dismiss();
                // resetForm();
              }
            };

            dataSubmit();

            router.refresh();
          }}
        >
          {({ isSubmitting, setFieldValue, values, errors }) => (
            <Form>
              <div className="bg-white mb-10">
                <label
                  className=" bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="oldPassword"
                >
                  Your old password
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  name="oldPassword"
                  type="password"
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className=" bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="newPassword"
                >
                  Your new password
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  name="newPassword"
                  type="password"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="bg-white mb-10">
                <label
                  className=" bottom-8 left-0 text-gray-500 transition-transform duration-300 -translate-y-2 text-sm"
                  htmlFor="newPasswordConfirm"
                >
                  Confirm your new password
                </label>
                <Field
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                invalid:border-pink-500 invalid:text-pink-600
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  name="newPasswordConfirm"
                  type="password"
                />
                <ErrorMessage
                  name="newPasswordConfirm"
                  component="div"
                  className="mt-2 text-red-500"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-full w-full hover:bg-blue-600"
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
