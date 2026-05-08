import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { CalendlyEmbed } from "@/components/landing/calendly-embed";
import { SiteFooter } from "@/components/landing/site-footer";

const benefits = [
  {
    title: "Sécuriser l'investissement",
    text: "Validez les fondamentaux du fonds avant de vous engager.",
    icon: ShieldCheck,
  },
  {
    title: "Identifier les risques cachés",
    text: "Faites ressortir les points sensibles financiers, humains et contractuels.",
    icon: AlertTriangle,
  },
  {
    title: "Négocier avec méthode",
    text: "Appuyez vos échanges sur une grille claire et structurée.",
    icon: TrendingUp,
  },
  {
    title: "Prioriser les décisions",
    text: "Repérez les sujets à traiter avant signature ou reprise effective.",
    icon: Search,
  },
];

const steps = [
  {
    title: "Prenez rendez-vous",
    text: "Premier échange gratuit pour comprendre votre projet.",
  },
  {
    title: "Réalisez l'audit en ligne",
    text: "71 questions structurées en 6 catégories.",
  },
  {
    title: "Recevez votre rapport",
    text: "Analyse détaillée et accompagnement personnalisé.",
  },
];

const categories = [
  {
    title: "Marché & Zone",
    text: "Zone de chalandise, dynamique locale et potentiel commercial.",
  },
  {
    title: "Analyse Financière",
    text: "Qualité des chiffres, rentabilité et cohérence économique.",
  },
  {
    title: "Ressources Humaines",
    text: "Équipe reprise, organisation et obligations sociales.",
  },
  {
    title: "Administratif & Contrats",
    text: "Engagements, contrats clés et points de vigilance juridiques.",
  },
  {
    title: "Matériel & Production",
    text: "Outils, capacité de production et investissements à prévoir.",
  },
  {
    title: "Locaux, Sécurité & Hygiène",
    text: "Conformité des locaux, sécurité et contraintes d'exploitation.",
  },
];

const faqItems = [
  ["Combien de temps prend l'audit ?", "Comptez environ 30 à 45 minutes."],
  ["Combien ça coûte ?", "Le tarif est présenté dans le parcours Calendly."],
  [
    "Quand l'accès est-il ouvert ?",
    "Après paiement, Gary-Alban active manuellement votre compte sous 24h.",
  ],
  [
    "Puis-je sauvegarder ma progression ?",
    "Oui, vous pouvez reprendre votre audit en cours depuis votre tableau de bord.",
  ],
  [
    "Que se passe-t-il après le questionnaire ?",
    "Vous recevez le rapport Excel par email, puis Gary-Alban revient vers vous pour le conseil.",
  ],
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6">
          <header className="flex items-center justify-between border-b border-accent/15 py-6">
            <Link href="/" aria-label="Accueil Artisan Gestion">
              <BrandLogo variant="dark" priority className="w-28 sm:w-36" />
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-semibold text-white/72 md:flex">
              <Link href="#process" className="transition hover:text-accent">
                Comment ça marche
              </Link>
              <Link href="#categories" className="transition hover:text-accent">
                Catégories
              </Link>
              <Link href="#calendly" className="transition hover:text-accent">
                Contact
              </Link>
            </nav>
            <Link
              href="/login"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-accent/90"
            >
              Se connecter
            </Link>
          </header>
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-98px)] max-w-7xl content-center gap-14 px-6 py-20 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center">
          <div className="animate-reveal-up">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-accent">
              Façonnez votre réussite
            </p>
            <h1 className="max-w-5xl font-serif text-5xl leading-[1.06] md:text-7xl">
              Évaluez la viabilité de votre acquisition de fonds de commerce
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-white/76">
              Un audit complet en 71 questions pour sécuriser votre projet d'acquisition.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#calendly"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 font-semibold text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-lg hover:shadow-black/20"
              >
                Prendre rendez-vous{" "}
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-white/22 px-6 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:text-accent"
              >
                Se connecter
              </Link>
            </div>
          </div>

          <aside className="animate-float-soft border-l-4 border-accent bg-white/7 p-8 shadow-2xl shadow-black/20">
            <BarChart3 className="text-accent" size={34} />
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Audit pré-acquisition
            </p>
            <p className="mt-4 text-lg leading-8 text-white/78">
              Une lecture structurée des risques pour décider, négocier et avancer avec méthode.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24">
        <div className="animate-reveal-up max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Pourquoi un audit ?
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-primary">
            Une acquisition se sécurise avant la signature
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, text, icon: Icon }, index) => (
            <article
              key={title}
              className={`animate-reveal-up border-t-4 border-accent bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                index === 1
                  ? "animation-delay-100"
                  : index === 2
                    ? "animation-delay-200"
                    : index === 3
                      ? "animation-delay-300"
                      : ""
              }`}
            >
              <Icon className="text-teal" size={28} />
              <h3 className="mt-6 font-serif text-2xl leading-tight text-primary">{title}</h3>
              <p className="mt-4 leading-7 text-secondary">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="process"
        className="flex min-h-screen scroll-mt-8 items-center overflow-hidden bg-white py-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[420px_1fr] lg:items-start">
            <div className="animate-reveal-up">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Comment ça marche
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-primary">
                Un parcours guidé, du premier échange au rapport
              </h2>
              <p className="mt-6 leading-7 text-secondary">
                Le rendez-vous sert à cadrer votre projet. L'audit intervient ensuite, une fois
                l'accès activé, pour produire une base de décision exploitable.
              </p>
            </div>

            <div className="relative pt-6 lg:pt-12">
              <div className="absolute left-5 top-8 h-[calc(100%-56px)] w-px bg-primary/12 md:left-0 md:top-12 md:h-px md:w-full" />
              <div className="animate-timeline-progress absolute left-5 top-8 h-[calc(100%-56px)] w-px bg-accent md:left-0 md:top-12 md:h-px md:w-full" />
              <div className="grid w-full gap-12 md:grid-cols-[repeat(3,minmax(0,1fr))] md:gap-10">
                {steps.map(({ title, text }, index) => (
                  <article
                    key={title}
                    className={`animate-reveal-up relative grid min-h-44 w-full min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-4 md:block md:min-h-64 md:pl-0 md:pt-24 ${
                      index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""
                    }`}
                  >
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-accent bg-primary font-serif text-xl text-accent shadow-[0_0_0_8px_white] transition duration-300 hover:scale-110 md:top-7">
                      {index + 1}
                    </div>
                    <div className="col-start-2 flex h-full w-full min-w-0 flex-col">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">
                        Étape {index + 1}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl leading-tight text-primary">
                        {title}
                      </h3>
                      <p className="mt-3 leading-7 text-secondary">{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="mx-auto flex min-h-screen scroll-mt-8 max-w-7xl flex-col justify-center px-6 py-24"
      >
        <div className="animate-reveal-up flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Les 6 catégories auditées
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-primary">
              Une grille pensée pour les reprises de fonds
            </h2>
          </div>
          <p className="max-w-md leading-7 text-secondary">
            Chaque thème contribue au score final et au rapport transmis après l'audit.
          </p>
        </div>
        <div className="mt-14 grid gap-x-12 gap-y-0 border-y border-primary/10 lg:grid-cols-2">
          {categories.map((category, index) => (
            <article
              key={category.title}
              className={`animate-reveal-soft grid grid-cols-[48px_1fr] gap-5 border-b border-primary/10 py-7 transition duration-300 hover:pl-2 lg:[&:nth-last-child(-n+2)]:border-b-0 ${
                index === 1
                  ? "animation-delay-100"
                  : index === 2
                    ? "animation-delay-200"
                    : index === 3
                      ? "animation-delay-300"
                      : index === 4
                        ? "animation-delay-400"
                        : index === 5
                          ? "animation-delay-500"
                          : ""
              }`}
            >
              <span className="font-serif text-3xl text-accent">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-serif text-2xl leading-tight text-primary">{category.title}</h3>
                <p className="mt-3 leading-7 text-secondary">{category.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="calendly"
        className="flex min-h-screen scroll-mt-8 items-center bg-primary py-24 text-white"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[420px_1fr] lg:items-start">
          <div className="animate-reveal-up">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Rendez-vous
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              Échangeons sur votre projet
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/74">
              Le rendez-vous intervient avant l'accès au questionnaire. Après paiement et
              activation, vous pourrez réaliser l'audit en ligne.
            </p>
          </div>
          <div className="animate-reveal-soft animation-delay-200 border border-accent/20 bg-white/8 p-6 shadow-2xl shadow-black/20">
            <CalendlyEmbed />
          </div>
        </div>
      </section>

      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
        <div className="grid w-full gap-14 lg:grid-cols-[420px_1fr] lg:items-start">
          <div className="animate-reveal-soft relative overflow-hidden bg-primary p-8 text-white shadow-2xl shadow-primary/15">
            <div className="flex aspect-[4/5] items-start justify-start bg-white/8 p-8">
              <div>
                <p className="font-serif text-7xl text-accent">GA</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/62">
                  Photo à ajouter
                </p>
              </div>
            </div>
            <div className="mt-6 border-l-4 border-accent pl-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Artisan Gestion
              </p>
              <p className="mt-2 text-white/72">Conseil en acquisition de fonds de commerce</p>
            </div>
          </div>

          <div className="animate-reveal-up">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              À propos
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-primary">
              Gary-Alban vous accompagne avant, pendant et après l'audit
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-secondary">
              Présentation à compléter par Gary-Alban : expérience, approche du conseil,
              typologie de projets accompagnés et valeur ajoutée de l'audit.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {["Échange de cadrage", "Audit structuré", "Conseil personnalisé"].map((item) => (
                <div key={item} className="border-t-2 border-accent pt-4">
                  <p className="font-semibold text-primary">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center bg-white py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[380px_1fr]">
            <div className="animate-reveal-up">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Questions fréquentes
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-primary">
                Les réponses avant de prendre rendez-vous
              </h2>
              <p className="mt-6 leading-7 text-secondary">
                L'objectif est de clarifier le parcours avant l'appel : rendez-vous, paiement,
                activation, audit puis accompagnement.
              </p>
            </div>

            <div className="animate-reveal-up divide-y divide-primary/10 border-y border-primary/10">
              {faqItems.map(([question, answer]) => (
                <div
                  key={question}
                  className="grid gap-4 py-8 transition duration-300 hover:border-accent/40 md:grid-cols-[minmax(220px,0.85fr)_1fr]"
                >
                  <h3 className="font-serif text-2xl leading-tight text-primary">{question}</h3>
                  <p className="leading-7 text-secondary">{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
