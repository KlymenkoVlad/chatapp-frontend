import { Toaster } from "sonner";

import Footer from "@/components/common/LayoutComponents/Footer";
import Header from "@/components/common/LayoutComponents/Header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
}
