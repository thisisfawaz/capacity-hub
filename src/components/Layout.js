"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiHome, FiCheckSquare, FiBookOpen, FiPieChart, FiDollarSign, FiFileText, FiSearch, FiGlobe, FiMenu, FiX } from "react-icons/fi";
import { MdOutlineSecurity } from "react-icons/md";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Assessment Centre", path: "/assessments", icon: <FiCheckSquare /> },
    { name: "Learning Centre", path: "/learning", icon: <FiBookOpen /> },
    { name: "Toolkits", path: "/planning", icon: <FiPieChart /> },
    { name: "Funding Hub", path: "/funding", icon: <FiDollarSign /> },
    { name: "Templates Library", path: "/templates", icon: <FiFileText /> },
    { name: "Knowledge Centre", path: "/knowledge", icon: <FiGlobe /> },
  ];

  return (
    <div className={styles.layout}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.sidebarOverlayOpen} onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.logo}>
          <Image src="/4ther-logo.png" alt="4ther Hub Logo" width={100} height={40} />
          <span></span>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/");
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={closeMobileMenu}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          {/* Mobile Menu Button */}
          <button 
            className={styles.menuButton} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <div className={styles.searchBar}>
            <FiSearch color="var(--text-secondary)" />
            <input type="text" placeholder="Search..." className={styles.searchInput} />
          </div>
          <div className={styles.profile}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>by The 4ther Firm</span>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}