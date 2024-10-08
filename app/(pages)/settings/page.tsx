import ButtonReturnSearchClient from "@/components/common/SearchComponents/ButtonReturnSearchClient";
import PasswordForm from "@/components/common/SettingsComponents/PasswordForm";
import SettingsForm from "@/components/common/SettingsComponents/SettingsForm";
import { baseUrl } from "@/utils/baseUrl";
import type { Metadata } from "next";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Profile Settings",
};

async function getData(token: RequestCookie | undefined) {
  try {
    if (!token) {
      throw new Error("Failed to get token");
    }

    const res = await fetch(`${baseUrl}/api/login`, {
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const user = await getData(token);

  return (
    <div className="text-center">
      <ButtonReturnSearchClient />
      <div className="mx-5 flex flex-col justify-center text-left lg:flex-row">
        <SettingsForm user={user} />
        <PasswordForm user={user} />
      </div>
    </div>
  );
}
