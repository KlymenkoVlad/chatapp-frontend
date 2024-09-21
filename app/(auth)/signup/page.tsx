import Signup from "@/components/ClientSidePages/Signup/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Here you can login in our NewMessage app",
};

export default function Page() {
  return <Signup />;
}
