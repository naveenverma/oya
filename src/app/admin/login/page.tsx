import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Admin Sign In",
};

function LoginFormFallback() {
  return <Skeleton className="h-[320px] w-full max-w-md rounded-xl" />;
}

export default function AdminLoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
