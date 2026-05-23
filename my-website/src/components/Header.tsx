"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/brochures", label: "Brochures" },
  ];

  return (
    <header>
      <div className="container header-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <Image
            src="/logo.jpg"
            alt="APB Enterprise Logo"
            width={38}
            height={38}
            style={{ width: "auto", height: "auto" }}
          />
          <div className="logo-text">
            <span className="logo-name">APB Enterprise</span>
            <span className="logo-sub">
              Controls &amp; Harness Manufacturer
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="nav-cta">
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
