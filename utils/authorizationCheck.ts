import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const tokenCheckClient = (
  needToRedirect = true,
): RequestCookie | undefined => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (needToRedirect && !token) {
    redirect("/login");
  }
  return token;
};
