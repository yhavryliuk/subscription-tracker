import Link from "next/link";

export const NavLogo = () => {
  return (
    <Link
      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 tracking-tight"
      href="/"
    >
      <span className="size-2.5 rounded-full bg-emerald-500" />
      Subscription Tracker
    </Link>
  );
};
