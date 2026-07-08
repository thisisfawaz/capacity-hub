"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCheckSquare, FiBookOpen, FiPieChart, FiDollarSign, FiFileText, FiSearch, FiGlobe } from "react-icons/fi";
import { MdOutlineSecurity } from "react-icons/md";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Assessment Centre", path: "/assessments", icon: <FiCheckSquare /> },
    { name: "Learning Centre", path: "/learning", icon: <FiBookOpen /> },
    { name: "Planning Centre", path: "/planning", icon: <FiPieChart /> },
    { name: "Funding Hub", path: "/funding", icon: <FiDollarSign /> },
    { name: "Templates Library", path: "/templates", icon: <FiFileText /> },
    { name: "Knowledge Centre", path: "/knowledge", icon: <FiGlobe /> },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <MdOutlineSecurity /> CapacityHub
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/");
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
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
          <div className={styles.searchBar}>
            <FiSearch color="var(--text-secondary)" />
            <input type="text" placeholder="Search across everything..." className={styles.searchInput} />
          </div>
          <div className={styles.profile}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Global Health NGO</span>
            <div className={styles.avatar}>GH</div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
