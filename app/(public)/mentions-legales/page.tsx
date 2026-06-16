import { LegalNotice, LegalPage, LegalSection } from "@/components/legal-page";

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      description="Les informations relatives à l'éditeur du site Artisan Gestion, à son hébergement et aux responsabilités applicables."
    >
      <LegalNotice>
        Dernière mise à jour : 16 juin 2026. Ces informations sont fournies pour identifier
        l'éditeur du site et les principales règles applicables à son utilisation.
      </LegalNotice>

      <LegalSection title="Éditeur du site">
        <p>
          Le présent site est édité par Artisan Gestion, entreprise individuelle proposant des
          prestations d'audit pré-acquisition et d'accompagnement pour les projets de reprise de
          fonds de commerce.
        </p>
        <ul>
          <li>Statut juridique : entreprise individuelle.</li>
          <li>Adresse postale : 37 rue Gambetta, 95400 Villiers-le-Bel.</li>
          <li>SIREN / SIRET : 104 433 057 00015.</li>
          <li>TVA intracommunautaire : non applicable.</li>
          <li>Email de contact : audit@artisan-gestion.fr.</li>
          <li>Directeur de la publication : Gary-Alban Maravilha.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site et les services associés peuvent s'appuyer sur plusieurs prestataires techniques,
          notamment pour l'hébergement applicatif, la base de données, l'authentification, les
          emails transactionnels et les services liés au nom de domaine.
        </p>
        <ul>
          <li>
            Hébergement applicatif : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
            États-Unis, vercel.com.
          </li>
          <li>
            Base de données et authentification : Supabase Pte. Ltd., 65 Chulia Street #38-02/03,
            OCBC Centre, Singapore 049513, supabase.com.
          </li>
          <li>
            Services de domaine ou d'hébergement complémentaires : o2switch, Chemin des Pardiaux,
            63000 Clermont-Ferrand, France, o2switch.fr.
          </li>
        </ul>
        <p>La liste des prestataires peut évoluer en fonction des besoins techniques du service.</p>
      </LegalSection>

      <LegalSection title="Objet du site">
        <p>
          Artisan Gestion propose un parcours d'information, de prise de rendez-vous et d'accès à
          un outil d'auto-audit destiné à aider les porteurs de projet à analyser une acquisition
          de fonds de commerce.
        </p>
        <p>
          Les contenus publiés sur le site sont fournis à titre informatif. Ils ne constituent pas
          un conseil juridique, comptable, fiscal, social ou financier personnalisé.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L'ensemble des éléments présents sur le site, notamment les textes, contenus, documents,
          méthodes, logos, marques, graphismes, images, vidéos, interfaces, questionnaires,
          ressources, méthodes de scoring et rapports générés sont protégés par les lois relatives
          à la propriété intellectuelle, sauf mention contraire.
        </p>
        <p>
          Toute reproduction, représentation, diffusion, adaptation ou exploitation, totale ou
          partielle, sans autorisation écrite préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          Les informations diffusées sur le site sont fournies à titre informatif. Artisan Gestion
          s'efforce de fournir des informations exactes et à jour, mais ne peut garantir
          l'exactitude, l'exhaustivité ou l'actualité permanente des contenus.
        </p>
        <p>
          L'utilisateur demeure seul responsable de l'utilisation qu'il fait des informations
          disponibles sur le site et de ses décisions d'investissement, de négociation ou de
          reprise.
        </p>
      </LegalSection>

      <LegalSection title="Liens externes">
        <p>
          Le site peut contenir des liens vers des sites tiers. L'éditeur ne saurait être tenu
          responsable du contenu, du fonctionnement ou des pratiques de ces sites externes.
        </p>
      </LegalSection>

      <LegalSection title="Signalement">
        <p>
          Pour signaler une erreur, demander une correction ou exercer un droit relatif aux données
          personnelles, l'utilisateur peut contacter Artisan Gestion à l'adresse :
          audit@artisan-gestion.fr.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
