import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-4">
      <div className="container mx-auto flex flex-col-reverse items-center justify-between p-4 sm:flex-row">
        <div className="flex-grow text-center sm:flex-row sm:text-left">
          <p>&copy; 2023 NewMessenger&trade;. All Rights Reserved.</p>
        </div>

        <nav className="mb-3 space-x-4 sm:mb-0">
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
