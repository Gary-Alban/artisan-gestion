import { LegalNotice, LegalPage, LegalSection } from "@/components/legal-page";

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialite"
      description="La maniere dont Artisan Gestion collecte, utilise, conserve et protege les donnees personnelles dans le cadre du site et de l'audit."
    >
      <LegalNotice>
        Derniere mise a jour : 7 juin 2026. Cette politique s'applique aux visiteurs du site, aux
        prospects prenant rendez-vous et aux utilisateurs disposant d'un compte d'audit.
      </LegalNotice>

      <LegalSection title="Responsable du traitement">
        <p>
          Le responsable du traitement est Artisan Gestion, represente par Gary-Alban Maravilha,
          pour les donnees collectees via le site, les formulaires, la prise de rendez-vous et
          l'espace d'audit.
        </p>
        <p>
          Pour toute demande relative aux donnees personnelles, l'utilisateur peut ecrire a :
          audit@artisan-gestion.fr.
        </p>
      </LegalSection>

      <LegalSection title="Donnees collectees">
        <p>
          Artisan Gestion peut collecter les donnees necessaires a la creation du compte, a
          l'organisation du rendez-vous, a la realisation de l'audit et au suivi de la relation.
        </p>
        <ul>
          <li>Donnees d'identification : email, nom, informations de compte.</li>
          <li>Donnees de rendez-vous : disponibilites, motif de contact, informations de projet.</li>
          <li>Donnees d'audit : reponses au questionnaire, progression, scores et rapport genere.</li>
          <li>Donnees techniques : journaux de connexion, securite, fonctionnement du service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Finalites des traitements">
        <p>Les donnees sont utilisees pour les finalites suivantes :</p>
        <ul>
          <li>creer, administrer et securiser les comptes utilisateurs ;</li>
          <li>organiser les rendez-vous et repondre aux demandes de contact ;</li>
          <li>sauvegarder la progression de l'audit et generer les resultats ;</li>
          <li>envoyer le rapport d'audit et assurer le suivi commercial ou operationnel ;</li>
          <li>ameliorer la qualite, la securite et la fiabilite du service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Bases legales">
        <p>
          Les traitements reposent, selon les cas, sur l'execution de mesures precontractuelles ou
          contractuelles, l'interet legitime d'Artisan Gestion a exploiter et securiser son service,
          le respect d'obligations legales ou le consentement lorsque celui-ci est requis.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Les donnees sont accessibles uniquement aux personnes habilitees au sein d'Artisan
          Gestion et aux prestataires techniques necessaires au fonctionnement du service :
          hebergement, authentification, base de donnees, email transactionnel et prise de
          rendez-vous.
        </p>
        <p>
          Ces prestataires interviennent dans la limite de leurs missions et doivent presenter des
          garanties adaptees en matiere de protection des donnees.
        </p>
      </LegalSection>

      <LegalSection title="Duree de conservation">
        <p>
          Les donnees sont conservees pendant la duree necessaire aux finalites pour lesquelles
          elles ont ete collectees, puis archivees ou supprimees conformement aux obligations
          applicables.
        </p>
        <ul>
          <li>Compte utilisateur : pendant la duree d'utilisation du service.</li>
          <li>Donnees d'audit : pendant la duree utile au suivi du projet et a la relation client.</li>
          <li>Donnees de contact : pendant la duree necessaire au traitement de la demande.</li>
          <li>Journaux techniques : pendant une duree limitee necessaire a la securite.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Securite">
        <p>
          Artisan Gestion met en place des mesures techniques et organisationnelles raisonnables
          pour proteger les donnees contre l'acces non autorise, la perte, l'alteration ou la
          divulgation.
        </p>
        <p>
          L'utilisateur contribue a cette securite en conservant la confidentialite de ses
          identifiants et en signalant toute utilisation suspecte de son compte.
        </p>
      </LegalSection>

      <LegalSection title="Droits des personnes">
        <p>
          Conformement a la reglementation applicable, l'utilisateur peut demander l'acces, la
          rectification, l'effacement, la limitation, l'opposition au traitement ou la portabilite
          de ses donnees lorsque ces droits s'appliquent.
        </p>
        <p>
          La demande peut etre adressee a audit@artisan-gestion.fr. Artisan Gestion pourra demander
          des informations complementaires afin de confirmer l'identite du demandeur.
        </p>
      </LegalSection>

      <LegalSection title="Reclamation">
        <p>
          Si l'utilisateur estime que ses droits ne sont pas respectes, il peut introduire une
          reclamation aupres de la CNIL ou de l'autorite de protection des donnees competente.
        </p>
      </LegalSection>

      <LegalSection title="Evolution de la politique">
        <p>
          La presente politique peut etre mise a jour pour tenir compte de l'evolution du service,
          des prestataires utilises ou de la reglementation. La date de derniere mise a jour figure
          en haut de page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
