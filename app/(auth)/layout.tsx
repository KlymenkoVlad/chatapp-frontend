import { notAuthorizedCheck } from "@/utils/authorizationCheck";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  notAuthorizedCheck();

  return children;
}
