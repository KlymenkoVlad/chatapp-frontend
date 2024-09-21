import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const authorizedCheck = (): {
  token: RequestCookie;
  userId: string;
} => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    redirect("/login");
  }

  return { token, userId };
};

export const notAuthorizedCheck = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  const userId = localStorage.getItem("userId");

  if (token || userId) {
    redirect("/chat");
  }
};
