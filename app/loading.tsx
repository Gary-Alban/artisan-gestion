import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-6">
      <div role="status" className="flex items-center gap-3 text-sm font-semibold text-primary">
        <LoaderCircle aria-hidden="true" size={20} className="animate-spin text-accent" />
        Chargement...
      </div>
    </main>
  );
}
