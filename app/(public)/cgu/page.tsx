import { LegalNotice, LegalPage, LegalSection } from "@/components/legal-page";

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions generales d'utilisation"
      description="Les regles d'acces et d'utilisation du service Artisan Gestion, incluant le rendez-vous, l'audit en ligne et les rapports transmis."
    >
      <LegalNotice>
        Derniere mise a jour : 7 juin 2026. L'utilisation du site implique l'acceptation des
        presentes conditions generales d'utilisation.
      </LegalNotice>

      <LegalSection title="Objet du service">
        <p>
          Artisan Gestion met a disposition un site de presentation, un module de prise de
          rendez-vous et, pour les utilisateurs autorises, un outil d'auto-audit pre-acquisition de
          fonds de commerce.
        </p>
        <p>
          L'audit vise a structurer l'analyse d'un projet de reprise autour de criteres
          commerciaux, financiers, humains, contractuels, materiels et operationnels.
        </p>
      </LegalSection>

      <LegalSection title="Acces au compte">
        <p>
          Certaines fonctionnalites necessitent la creation d'un compte et l'activation de l'acces
          par Artisan Gestion. L'utilisateur s'engage a fournir des informations exactes et a jour.
        </p>
        <p>
          Les identifiants sont personnels et confidentiels. Toute utilisation realisee depuis le
          compte de l'utilisateur est reputee effectuee par celui-ci, sauf preuve contraire.
        </p>
      </LegalSection>

      <LegalSection title="Utilisation de l'audit">
        <p>
          L'utilisateur s'engage a repondre au questionnaire de maniere sincere, complete et
          proportionnee aux informations dont il dispose au moment de l'audit.
        </p>
        <ul>
          <li>Il ne doit pas tenter de perturber le fonctionnement du service.</li>
          <li>Il ne doit pas partager ses acces avec un tiers non autorise.</li>
          <li>Il ne doit pas extraire ou reutiliser massivement le contenu du questionnaire.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Nature des resultats">
        <p>
          Les scores, alertes, commentaires et rapports produits par l'outil sont indicatifs. Ils
          ne remplacent pas une analyse juridique, comptable, fiscale, sociale, technique ou
          financiere conduite par un professionnel qualifie.
        </p>
        <p>
          L'utilisateur conserve l'entiere responsabilite de ses decisions, negociations,
          engagements contractuels et investissements.
        </p>
      </LegalSection>

      <LegalSection title="Disponibilite du service">
        <p>
          Artisan Gestion s'efforce de maintenir le site accessible dans de bonnes conditions. Des
          interruptions temporaires peuvent toutefois intervenir pour maintenance, mise a jour,
          incident technique ou cas de force majeure.
        </p>
      </LegalSection>

      <LegalSection title="Propriete des contenus">
        <p>
          Les contenus, questionnaires, methodes d'analyse, interfaces, marques, textes et supports
          transmis par Artisan Gestion restent sa propriete ou celle de ses ayants droit.
        </p>
        <p>
          L'utilisateur dispose uniquement d'un droit d'utilisation personnel, limite aux besoins
          de son projet d'acquisition.
        </p>
      </LegalSection>

      <LegalSection title="Donnees et confidentialite">
        <p>
          Les donnees saisies dans le cadre du compte et des audits sont traitees selon la
          politique de confidentialite accessible sur le site.
        </p>
        <p>
          L'utilisateur s'engage a ne pas transmettre de donnees dont il ne disposerait pas
          legitimement ou dont la communication serait interdite.
        </p>
      </LegalSection>

      <LegalSection title="Modification des conditions">
        <p>
          Artisan Gestion peut modifier les presentes conditions afin de tenir compte de
          l'evolution du service, de la reglementation ou de son organisation. La version applicable
          est celle publiee sur le site au jour de l'utilisation.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative aux presentes conditions, l'utilisateur peut contacter
          Artisan Gestion a l'adresse : audit@artisan-gestion.fr.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
