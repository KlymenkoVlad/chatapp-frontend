import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" py-4">
      <div className="container mx-auto flex flex-col-reverse sm:flex-row justify-between items-center p-4">
        <div className="flex-grow text-center sm:flex-row sm:text-left">
          <p>&copy; 2023 NewMessenger&trade;. All Rights Reserved.</p>
        </div>

        <nav className="space-x-4 sm:mb-0 mb-3">
          <NavLink href="/" label="Home" />
          <NavLink href="/about" label="About" />
          <NavLink href="/contact" label="Contact" />
        </nav>
      </div>
    </footer>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => {
  return <Link href={href}>{label}</Link>;
};

export default Footer;
