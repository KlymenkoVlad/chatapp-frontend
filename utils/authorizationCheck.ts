import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const tokenCheck = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("login");
  }
};
