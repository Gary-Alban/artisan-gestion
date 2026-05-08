export function CalendlyEmbed() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;

  if (!url) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-md border border-dashed border-white/30 text-center text-sm text-white/70">
        Configurez NEXT_PUBLIC_CALENDLY_URL pour afficher le calendrier.
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="Calendly Artisan Gestion"
      className="h-[520px] w-full rounded-md bg-white"
    />
  );
}
