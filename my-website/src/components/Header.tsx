"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/logo.jpg"
            alt="APB Enterprise Logo"
            width={30}
            height={30}
          />
          <div className="logo-text">
            <span className="logo-name">APB ENTERPRISE</span>
            <span className="logo-sub">
              Controls &amp; Harness Manufacturer
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
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

        {/* Mobile Hamburger Toggle */}
        <button
          className={`menu-toggle${isMenuOpen ? " open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>

        {/* Mobile Nav Drawer */}
        <div className={`mobile-nav${isMenuOpen ? " open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="nav-cta"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
