import Link from "next/link";
import React from "react";

import { HeaderAuthActions } from "./HeaderAuthActions";
import { getNavLinks } from "@/config/navigation";

export const Header = () => {
  const navLinks = getNavLinks();
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-0 h-16 flex items-center justify-between">
        {/* Logo and Nav */}
        <div className="flex items-center gap-8 h-full">
          <a href="/" className="flex items-center gap-1 group">
            <div className="bg-primary text-white p-1 rounded-sm flex items-center justify-center font-bold text-xl tracking-tight leading-none group-hover:bg-primary-hover transition-colors">
              BĐS
            </div>
            <span className="text-primary font-bold text-base tracking-tight leading-none group-hover:text-primary-hover transition-colors">
              .com.vn
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 h-full">
            {navLinks.map((link, idx) => (
              <div key={idx} className="group relative h-full flex items-center">
                <a
                  href={link.href}
                  className="text-sm font-medium text-[#2c2c2c] hover:text-primary transition-colors flex items-center gap-1"
                >
                  {link.text}
                  {link.subItems && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-primary -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </a>

                {/* Dropdown Menu */}
                {link.subItems && (
                  <div className="absolute top-16 left-0 w-64 bg-white border border-gray-100 rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                    {link.subItems.map((sub, sIdx) => (
                      <a
                        key={sIdx}
                        href={sub.href}
                        className="block px-6 py-2.5 text-sm text-[#2c2c2c] hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        {sub.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <HeaderAuthActions />
          {/* <button className="px-4 py-2 border border-primary text-primary font-medium text-sm rounded hover:bg-red-50 transition-colors hidden sm:block">
            Đổi giao diện
          </button> */}
          <Link href="/nguoi-ban/dang-tin" className="px-4 py-2 bg-primary text-white font-medium text-sm rounded hover:bg-primary-hover transition-colors shadow-sm">
            Đăng tin
          </Link>
        </div>
      </div>
    </header>
  );
};
