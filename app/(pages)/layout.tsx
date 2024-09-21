import Header from "@/components/common/LayoutComponents/Header";
import { authorizedCheck } from "@/utils/authorizationCheck";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  authorizedCheck();

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
