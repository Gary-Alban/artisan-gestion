import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { CalendlyEmbed } from "@/components/landing/calendly-embed";
import { SiteHeader } from "@/components/landing/site-header";
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
        <SiteHeader />

        <div className="section-shell grid min-h-screen content-center gap-12 pb-24 pt-32 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center lg:pb-28 lg:pt-36">
          <div className="animate-reveal-up">
            <p className="section-kicker mb-6 tracking-[0.22em]">
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
                className="premium-action group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 font-semibold text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-lg hover:shadow-black/20"
              >
                Prendre rendez-vous{" "}
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-white/22 px-6 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:bg-white/5 hover:text-accent"
              >
                Se connecter
              </Link>
            </div>
          </div>

          <aside className="animate-float-soft border-l-4 border-accent bg-white/7 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm transition duration-300 hover:bg-white/10">
            <BarChart3 className="text-accent" size={34} />
            <p className="section-kicker mt-7 tracking-[0.16em]">
              Audit pré-acquisition
            </p>
            <p className="mt-4 text-lg leading-8 text-white/78">
              Une lecture structurée des risques pour décider, négocier et avancer avec méthode.
            </p>
          </aside>
        </div>
      </section>

      <section className="section-padding-lg">
        <div className="section-shell">
        <div className="animate-reveal-up accent-rule max-w-2xl">
          <p className="section-kicker">
            Pourquoi un audit ?
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-primary">
            Une acquisition se sécurise avant la signature
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {benefits.map(({ title, text, icon: Icon }, index) => (
            <article
              key={title}
              className={`premium-card animate-reveal-up border-t-4 border-accent p-7 sm:p-8 ${
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
        </div>
      </section>

      <section
        id="process"
        className="section-padding-lg scroll-mt-28 overflow-hidden bg-white"
      >
        <div className="section-shell">
          <div className="grid gap-16 lg:grid-cols-[420px_1fr] lg:items-start">
            <div className="animate-reveal-up accent-rule">
              <p className="section-kicker">
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
        className="section-padding-lg scroll-mt-28"
      >
        <div className="section-shell">
        <div className="animate-reveal-up flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker">
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
              className={`group animate-reveal-soft border-b border-primary/10 py-8 lg:[&:nth-last-child(-n+2)]:border-b-0 ${
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
              <div className="grid grid-cols-[48px_1fr] gap-5 transition duration-300 ease-out will-change-transform group-hover:translate-x-1.5">
              <span className="font-serif text-3xl text-accent transition duration-300 ease-out group-hover:text-teal">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h3 className="font-serif text-2xl leading-tight text-primary">{category.title}</h3>
                <p className="mt-3 leading-7 text-secondary">{category.text}</p>
              </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section
        id="calendly"
        className="section-padding scroll-mt-28 bg-primary text-white"
      >
        <div className="section-shell flex flex-col gap-12">
          <div className="animate-reveal-up flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">
                Rendez-vous
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight">
                Échangeons sur votre projet
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-white/74">
              Le rendez-vous intervient avant l'accès au questionnaire. Après paiement et
              activation, vous pourrez réaliser l'audit en ligne.
            </p>
          </div>
          <div className="animate-reveal-soft animation-delay-200 border border-accent/20 bg-white/8 p-3 shadow-2xl shadow-black/20 backdrop-blur-sm transition duration-300 hover:border-accent/35 hover:bg-white/10 sm:p-5">
            <CalendlyEmbed />
          </div>
        </div>
      </section>

      <section className="section-padding-lg">
        <div className="section-shell grid gap-16 lg:grid-cols-[420px_1fr] lg:items-center">
          <div className="animate-reveal-soft relative overflow-hidden bg-primary p-8 text-white shadow-2xl shadow-primary/15 transition duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <div className="flex aspect-[4/5] items-start justify-start bg-white/8 p-8">
              <div>
                <p className="font-serif text-7xl text-accent">GA</p>
                <p className="section-kicker mt-3 text-white/62">
                  Photo à ajouter
                </p>
              </div>
            </div>
            <div className="mt-6 border-l-4 border-accent pl-5">
              <p className="section-kicker">
                Artisan Gestion
              </p>
              <p className="mt-2 text-white/72">Conseil en acquisition de fonds de commerce</p>
            </div>
          </div>

          <div className="animate-reveal-up">
            <p className="section-kicker">
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
                <div key={item} className="border-t-2 border-accent pt-4 transition duration-300 hover:-translate-y-0.5">
                  <p className="font-semibold text-primary">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding-lg bg-white">
        <div className="section-shell">
          <div className="grid gap-16 lg:grid-cols-[380px_1fr]">
            <div className="animate-reveal-up accent-rule">
              <p className="section-kicker">
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
                  className="group relative grid gap-4 overflow-hidden py-8 md:grid-cols-[minmax(220px,0.85fr)_1fr]"
                >
                  <div className="absolute inset-0 bg-page/60 opacity-0 transition duration-300 ease-out group-hover:opacity-100" />
                  <h3 className="relative font-serif text-2xl leading-tight text-primary transition duration-300 ease-out will-change-transform group-hover:translate-x-1.5">{question}</h3>
                  <p className="relative leading-7 text-secondary transition duration-300 ease-out will-change-transform group-hover:translate-x-1.5">{answer}</p>
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
