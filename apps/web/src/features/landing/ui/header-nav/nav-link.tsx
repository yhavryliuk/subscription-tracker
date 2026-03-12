import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./nav-link.module.scss";

interface NavLinkProps {
  children: ReactNode;
  href: string;
}

export const NavLink = ({ children, href }: NavLinkProps) => {
  return (
    <Link className={styles.navLink} href={href}>
      {children}
    </Link>
  );
};
