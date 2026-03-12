import { Suspense } from "react";
import MySessionsList from "@/app/account/sessions/components/MySessionsList";

export default async function SessionsPage() {
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <MySessionsList />
    </Suspense>
  );
}
