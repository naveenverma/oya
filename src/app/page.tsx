import { SiteHeader } from "@/components/layout/site-header";
import { VerificationForm } from "@/features/verification/components/verification-form";
import { ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="border-b bg-muted/30">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center md:py-24">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-7 w-7" aria-hidden />
            </div>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Secure Registry & Verification Portal
              </h1>
              <p className="text-lg text-muted-foreground">
                Enter your control number to verify an approved registry record.
                Only exact matches for approved records are displayed.
              </p>
            </div>
            <VerificationForm />
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h2 className="font-semibold">Exact Match Only</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Verification requires a precise control number. No browsing or
                listing is available.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h2 className="font-semibold">Approved Records</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Only records with Approved status are visible to the public.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <h2 className="font-semibold">Secure Attachments</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Supporting documents are served via time-limited secure links.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
