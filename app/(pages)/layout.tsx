import Header from "@/components/common/LayoutComponents/Header";
import { tokenCheckClient } from "@/utils/authorizationCheck";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  tokenCheckClient();

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
