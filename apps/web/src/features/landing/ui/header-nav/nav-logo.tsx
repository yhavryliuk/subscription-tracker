import styles from "./nav-logo.module.scss";
import Link from "next/link";

export const NavLogo = () => {
  return (
    <Link className={styles.navLogo} href="/">
      Subscription Tracker
    </Link>
  );
};
