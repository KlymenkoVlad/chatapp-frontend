import Login from "@/components/ClientSidePages/Login/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Here you can login in my chat app app",
};

export default function Page() {
  return <Login />;
}
