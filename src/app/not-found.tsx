import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-6xl font-bold text-muted-foreground">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or the record could not be
          verified.
        </p>
        <ButtonLink href="/" className="mt-8">
          Return home
        </ButtonLink>
      </main>
    </>
  );
}
