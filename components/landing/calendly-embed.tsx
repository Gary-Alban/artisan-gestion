export function CalendlyEmbed() {
  const url =
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/garyalban/30min";

  if (!url) {
    return (
      <div className="flex h-[680px] items-center justify-center rounded-md border border-dashed border-white/30 text-center text-sm text-white/70 lg:h-[760px]">
        Configurez NEXT_PUBLIC_CALENDLY_URL pour afficher le calendrier.
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="Calendly Artisan Gestion"
      className="h-[680px] w-full rounded-md bg-white lg:h-[760px]"
    />
  );
}
