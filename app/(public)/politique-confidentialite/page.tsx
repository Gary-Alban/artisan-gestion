import { LegalNotice, LegalPage, LegalSection } from "@/components/legal-page";

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      description="La manière dont Artisan Gestion collecte, utilise, conserve et protège les données personnelles dans le cadre du site et de l'audit."
    >
      <LegalNotice>
        Dernière mise à jour : 16 juin 2026. Cette politique s'applique aux visiteurs du site, aux
        prospects prenant rendez-vous et aux utilisateurs disposant d'un compte d'audit.
      </LegalNotice>

      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement est Artisan Gestion, représenté par Gary-Alban Maravilha,
          pour les données collectées via le site, les formulaires, la prise de rendez-vous et
          l'espace d'audit.
        </p>
        <p>Adresse : 37 rue Gambetta, 95400 Villiers-le-Bel.</p>
        <p>
          Pour toute demande relative aux données personnelles, l'utilisateur peut écrire à :
          audit@artisan-gestion.fr.
        </p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>
          Artisan Gestion peut collecter les données nécessaires à la création du compte, à
          l'organisation du rendez-vous, à la réalisation de l'audit et au suivi de la relation.
        </p>
        <ul>
          <li>Données d'identification : nom, prénom, email, téléphone, informations de compte.</li>
          <li>Données de rendez-vous : disponibilités, motif de contact, informations de projet.</li>
          <li>Informations transmises dans le cadre de la relation commerciale.</li>
          <li>Données d'audit : réponses au questionnaire, progression, scores et rapport généré.</li>
          <li>Données techniques : journaux de connexion, sécurité, fonctionnement du service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Finalités des traitements">
        <p>Les données sont utilisées pour les finalités suivantes :</p>
        <ul>
          <li>créer, administrer et sécuriser les comptes utilisateurs ;</li>
          <li>organiser les rendez-vous et répondre aux demandes de contact ;</li>
          <li>sauvegarder la progression de l'audit et générer les résultats ;</li>
          <li>envoyer le rapport d'audit et assurer le suivi commercial ou operationnel ;</li>
          <li>assurer le suivi administratif et comptable ;</li>
          <li>respecter les obligations légales applicables ;</li>
          <li>améliorer la qualité, la sécurité et la fiabilité du service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Bases légales">
        <p>
          Les traitements reposent, selon les cas, sur l'exécution de mesures précontractuelles à la
          demande de la personne concernée, l'exécution du contrat, les obligations légales du
          responsable du traitement, l'intérêt légitime lié au bon fonctionnement du site et de
          l'activité ou le consentement lorsque celui-ci est requis.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Les données sont accessibles uniquement aux personnes habilitées au sein d'Artisan
          Gestion et aux prestataires techniques nécessaires au fonctionnement du service :
          hébergement, authentification, base de données, email transactionnel et prise de
          rendez-vous.
        </p>
        <p>
          Ces prestataires interviennent dans la limite de leurs missions et doivent présenter des
          garanties adaptées en matière de protection des données.
        </p>
        <p>Les données ne sont ni vendues ni cédées à des tiers à des fins commerciales.</p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles
          elles ont été collectées, puis archivées ou supprimées conformément aux obligations
          applicables.
        </p>
        <ul>
          <li>Compte utilisateur : pendant la durée d'utilisation du service.</li>
          <li>Données d'audit : pendant la durée utile au suivi du projet et à la relation client.</li>
          <li>Données de contact : pendant la durée nécessaire au traitement de la demande.</li>
          <li>Documents comptables et contractuels : pendant les durées prévues par la réglementation.</li>
          <li>Journaux techniques : pendant une durée limitée nécessaire à la sécurité.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Artisan Gestion met en place des mesures techniques et organisationnelles raisonnables
          pour protéger les données contre l'accès non autorisé, la perte, l'altération ou la
          divulgation.
        </p>
        <p>
          L'utilisateur contribue à cette sécurité en conservant la confidentialité de ses
          identifiants et en signalant toute utilisation suspecte de son compte.
        </p>
      </LegalSection>

      <LegalSection title="Droits des personnes">
        <p>
          Conformément à la réglementation applicable, l'utilisateur peut demander l'accès, la
          rectification, l'effacement, la limitation, l'opposition au traitement ou la portabilité
          de ses données lorsque ces droits s'appliquent.
        </p>
        <p>
          La demande peut être adressée à audit@artisan-gestion.fr. Artisan Gestion pourra demander
          des informations complémentaires afin de confirmer l'identité du demandeur.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Le site peut utiliser des cookies ou technologies similaires nécessaires à son
          fonctionnement, notamment pour la sécurité, l'authentification, la conservation de session
          et le bon fonctionnement du parcours utilisateur.
        </p>
        <p>
          Des services tiers utilisés par le site, tels que les outils de prise de rendez-vous,
          d'hébergement, d'authentification, de base de données ou de mesure technique, sont
          susceptibles de déposer leurs propres cookies conformément à leurs politiques de
          confidentialité.
        </p>
        <p>
          L'utilisateur peut configurer son navigateur afin de refuser tout ou partie des cookies.
          Le refus de certains cookies techniques peut toutefois limiter l'accès à certaines
          fonctionnalités du service.
        </p>
      </LegalSection>

      <LegalSection title="Réclamation">
        <p>
          Si l'utilisateur estime que ses droits ne sont pas respectés, il peut introduire une
          réclamation auprès de la CNIL ou de l'autorité de protection des données compétente.
        </p>
      </LegalSection>

      <LegalSection title="Évolution de la politique">
        <p>
          La présente politique peut être mise à jour pour tenir compte de l'évolution du service,
          des prestataires utilisés ou de la réglementation. La date de dernière mise à jour figure
          en haut de page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
