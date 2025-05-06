"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { TopbarCard } from "@/components/ui/topbarCard";
import { CircleUserRound, GraduationCap, House, Users, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AdminMenuPopover } from "@/components/adminMenuPopover";

export default function Topbar() {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    if (mobileMenuRef.current) {
      setMenuHeight(isMenuOpen ? mobileMenuRef.current.scrollHeight : 0);
    }
  }, [isMenuOpen, session?.data?.user?.isAdmin, session?.status]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between py-2 px-4 md:px-10">
        <Link href="/" className="text-2xl font-bold">
          <Image src="/logo.svg" alt="Logo" width={50} height={50} priority />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-end">
          {session?.data?.user?.isAdmin && <AdminMenuPopover />}
          <TopbarCard icon={GraduationCap} text="Læring" href="/learning" />
          {session?.status === "authenticated" ? (
            <>
              <TopbarCard icon={House} text="Husholdning" href="/household" />
              <TopbarCard icon={Users} text="Beredskapsgruppe" href="/group" />
              <Link href="/profile" className="flex flex-row items-center ml-4">
                <CircleUserRound size={40} strokeWidth={1} />
              </Link>
            </>
          ) : (
            <Link href="/login" className="flex flex-row items-center ml-4">
              <CircleUserRound size={40} strokeWidth={1} />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation with animation */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: `${menuHeight}px` }}>
        <div ref={mobileMenuRef} className="flex flex-col bg-white">
          <Link
            href="/learning"
            className="px-4 py-3 flex items-center space-x-2 hover:bg-gray-100"
            onClick={closeMenu}>
            <GraduationCap size={20} />
            <span>Læring</span>
          </Link>
          {session?.status === "authenticated" ? (
            <>
              <Link
                href="/household"
                className="px-4 py-3 flex items-center space-x-2 hover:bg-gray-100"
                onClick={closeMenu}>
                <House size={20} />
                <span>Husholdning</span>
              </Link>
              <Link
                href="/group"
                className="px-4 py-3 flex items-center space-x-2 hover:bg-gray-100"
                onClick={closeMenu}>
                <Users size={20} />
                <span>Beredskapsgruppe</span>
              </Link>
              <Link
                href="/profile"
                className="px-4 py-3 flex items-center space-x-2 hover:bg-gray-100"
                onClick={closeMenu}>
                <CircleUserRound size={20} />
                <span>Profil</span>
              </Link>
            </>
          ) : (
            <Link href="/login" className="px-4 py-3 flex items-center space-x-2 hover:bg-gray-100" onClick={closeMenu}>
              <CircleUserRound size={20} />
              <span>Logg inn</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
