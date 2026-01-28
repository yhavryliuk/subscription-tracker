
import MySessionsList from "@/app/account/sessions/components/MySessionsList";
import { Suspense } from "react";

export default async function SessionsPage() {
    return (
        <Suspense fallback={<div>LOADING</div>}>
            <MySessionsList />
        </Suspense>
    );
}
