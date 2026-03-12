import Link from "next/link";
import styles from "./nav-logo.module.scss";

export const NavLogo = () => {
  return (
    <Link className={styles.navLogo} href="/">
      Subscription Tracker
    </Link>
  );
};
