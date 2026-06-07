import { LegalNotice, LegalPage, LegalSection } from "@/components/legal-page";

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions legales"
      description="Les informations relatives a l'editeur du site Artisan Gestion, a son hebergement et aux responsabilites applicables."
    >
      <LegalNotice>
        Derniere mise a jour : 7 juin 2026. Les champs signales comme a completer doivent etre
        verifies et renseignes avant toute mise en production publique.
      </LegalNotice>

      <LegalSection title="Editeur du site">
        <p>
          Le site Artisan Gestion est edite par Artisan Gestion, service d'audit
          pre-acquisition et d'accompagnement pour les projets de reprise de fonds de commerce.
        </p>
        <ul>
          <li>Responsable de publication : Gary-Alban Maravilha.</li>
          <li>Adresse postale : a completer.</li>
          <li>SIRET / RCS : a completer.</li>
          <li>Email de contact : audit@artisan-gestion.fr.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Hebergement">
        <p>
          Les informations relatives a l'hebergeur technique du site doivent etre confirmees avant
          publication definitive.
        </p>
        <ul>
          <li>Hebergeur : a completer.</li>
          <li>Adresse de l'hebergeur : a completer.</li>
          <li>Contact de l'hebergeur : a completer.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Objet du site">
        <p>
          Artisan Gestion propose un parcours d'information, de prise de rendez-vous et d'acces a
          un outil d'auto-audit destine a aider les porteurs de projet a analyser une acquisition
          de fonds de commerce.
        </p>
        <p>
          Les contenus publies sur le site sont fournis a titre informatif. Ils ne constituent pas
          un conseil juridique, comptable, fiscal, social ou financier personnalise.
        </p>
      </LegalSection>

      <LegalSection title="Propriete intellectuelle">
        <p>
          La structure du site, les textes, elements graphiques, interfaces, questionnaires,
          methodes de scoring et rapports generes sont proteges par le droit de la propriete
          intellectuelle, sauf mention contraire.
        </p>
        <p>
          Toute reproduction, representation, adaptation, diffusion ou exploitation non autorisee,
          totale ou partielle, est interdite.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilite">
        <p>
          Artisan Gestion met en oeuvre des moyens raisonnables pour assurer l'exactitude et la
          mise a jour des informations diffusees. L'utilisateur reste responsable de ses decisions
          d'investissement, de negociation ou de reprise.
        </p>
        <p>
          L'audit en ligne constitue une aide a la decision. Il doit etre complete, lorsque cela
          est necessaire, par l'avis de professionnels qualifies.
        </p>
      </LegalSection>

      <LegalSection title="Signalement">
        <p>
          Pour signaler une erreur, demander une correction ou exercer un droit relatif aux
          donnees personnelles, l'utilisateur peut contacter Artisan Gestion a l'adresse :
          audit@artisan-gestion.fr.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
