import { LegalNotice, LegalPage, LegalSection } from "@/components/legal-page";

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions générales de vente et d'utilisation"
      description="Les conditions applicables aux prestations Artisan Gestion, au rendez-vous de découverte, à la souscription, au paiement et à l'utilisation des services."
    >
      <LegalNotice>
        Dernière mise à jour : 16 juin 2026. La souscription ou l'utilisation du service implique
        l'acceptation des présentes conditions générales de vente et d'utilisation.
      </LegalNotice>

      <LegalSection title="Objet de la prestation">
        <p>
          Artisan Gestion propose des prestations de conseil accessibles après un entretien
          préalable de découverte d'une durée de 30 minutes. À l'issue de cet entretien, le client
          est libre de souscrire ou non à l'accompagnement proposé.
        </p>
        <p>
          La prestation comprend l'accès aux conseils, méthodes, ressources et outils prévus dans
          l'offre souscrite. Toute prestation non expressément mentionnée dans l'offre est exclue.
        </p>
      </LegalSection>

      <LegalSection title="Prix et paiement">
        <p>
          Les prix applicables sont ceux affichés sur le site internet au jour de la commande. Le
          prix de l'offre indiquée est de 490 euros. TVA non applicable selon l'article 293 B du
          Code général des impôts.
        </p>
        <p>
          Le paiement est exigible immédiatement lors de la souscription. La commande n'est
          considérée comme définitive qu'après encaissement effectif du paiement.
        </p>
      </LegalSection>

      <LegalSection title="Droit de rétractation">
        <p>
          Conformément aux dispositions légales applicables, le client reconnaît et accepte que
          l'exécution de la prestation débute immédiatement après son paiement et l'activation de
          son accès aux services.
        </p>
        <p>
          En validant sa commande, le client demande expressément l'exécution immédiate de la
          prestation avant l'expiration du délai légal de rétractation et reconnaît qu'il perd son
          droit de rétractation dès lors que les contenus, informations, ressources ou conseils lui
          sont rendus accessibles.
        </p>
      </LegalSection>

      <LegalSection title="Politique de remboursement">
        <p>
          Compte tenu de la nature de la prestation et de l'accès immédiat aux contenus, méthodes,
          informations et conseils d'Artisan Gestion, aucun remboursement ne pourra être accordé
          après validation de la commande et activation de l'accès aux services.
        </p>
        <p>
          Toute demande liée à une erreur technique ou à un double paiement sera examinée au cas
          par cas.
        </p>
      </LegalSection>

      <LegalSection title="Rendez-vous et annulations">
        <p>
          Les rendez-vous peuvent être reportés ou annulés jusqu'à 24 heures avant l'horaire prévu.
        </p>
        <p>
          Toute annulation effectuée moins de 24 heures avant le rendez-vous ou toute absence du
          client sans préavis sera considérée comme un rendez-vous réalisé et ne donnera lieu à
          aucun remboursement ni report gratuit.
        </p>
      </LegalSection>

      <LegalSection title="Durée d'accès">
        <p>
          L'accès aux services, contenus et ressources est accordé pour la durée indiquée dans
          l'offre souscrite. À l'expiration de cette durée, Artisan Gestion pourra suspendre ou
          supprimer l'accès sans indemnité.
        </p>
      </LegalSection>

      <LegalSection title="Accès au compte et obligations du client">
        <p>
          Certaines fonctionnalités nécessitent la création d'un compte et l'activation de l'accès
          par Artisan Gestion. Le client s'engage à fournir des informations exactes et à jour.
        </p>
        <p>
          Les identifiants d'accès sont strictement personnels et ne peuvent être cédés, prêtés ou
          partagés avec des tiers.
        </p>
        <ul>
          <li>Le client est seul responsable de l'utilisation des conseils et recommandations fournis.</li>
          <li>Il ne doit pas tenter de perturber le fonctionnement du service.</li>
          <li>Il ne doit pas extraire, diffuser ou réutiliser massivement le contenu du questionnaire.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Nature des résultats et limitation de responsabilité">
        <p>
          Les scores, alertes, commentaires et rapports produits par l'outil sont indicatifs. Ils
          ne remplacent pas une analyse juridique, comptable, fiscale, sociale, technique ou
          financière conduite par un professionnel qualifié.
        </p>
        <p>
          Artisan Gestion est tenue à une obligation de moyens et non de résultat. Les conseils,
          recommandations et informations fournis ont pour objet d'accompagner le client dans ses
          décisions et actions, sans garantie de résultat particulier.
        </p>
        <p>
          La responsabilité d'Artisan Gestion ne pourra être engagée pour toute perte indirecte,
          perte de chiffre d'affaires, perte d'opportunité ou tout autre préjudice résultant de
          l'utilisation des services.
        </p>
      </LegalSection>

      <LegalSection title="Disponibilité du service">
        <p>
          Artisan Gestion s'efforce de maintenir le site accessible dans de bonnes conditions. Des
          interruptions temporaires peuvent toutefois intervenir pour maintenance, mise à jour,
          incident technique ou cas de force majeure.
        </p>
      </LegalSection>

      <LegalSection title="Propriété des contenus">
        <p>
          L'ensemble des contenus, méthodes, documents, supports, stratégies, outils, ressources,
          questionnaires, interfaces et informations communiqués par Artisan Gestion demeure sa
          propriété exclusive ou celle de ses ayants droit.
        </p>
        <p>
          Toute reproduction, diffusion, revente, transmission ou exploitation, totale ou partielle,
          sans autorisation écrite préalable est strictement interdite.
        </p>
      </LegalSection>

      <LegalSection title="Confidentialité">
        <p>
          Artisan Gestion s'engage à conserver confidentielles les informations communiquées par le
          client dans le cadre de la prestation, sauf obligation légale ou judiciaire contraire.
        </p>
        <p>
          Les données saisies dans le cadre du compte et des audits sont traitées selon la politique
          de confidentialité accessible sur le site.
        </p>
      </LegalSection>

      <LegalSection title="Suspension ou résiliation">
        <p>
          Artisan Gestion se réserve le droit de suspendre ou de résilier l'accès du client en cas
          de non-respect des présentes conditions, d'utilisation abusive des services ou de partage
          non autorisé des accès.
        </p>
        <p>Aucune résiliation ne donnera lieu à remboursement des sommes déjà versées.</p>
      </LegalSection>

      <LegalSection title="Modification des conditions">
        <p>
          Artisan Gestion peut modifier les présentes conditions afin de tenir compte de l'évolution
          du service, de la réglementation ou de son organisation. La version applicable est celle
          publiée sur le site au jour de l'utilisation.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable et litiges">
        <p>
          Les présentes conditions générales sont soumises au droit français. En cas de litige, les
          parties s'engagent à rechercher une solution amiable avant toute procédure judiciaire.
        </p>
        <p>
          À défaut d'accord amiable, le litige sera soumis aux juridictions compétentes
          conformément aux dispositions légales applicables.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative aux présentes conditions, l'utilisateur peut contacter
          Artisan Gestion à l'adresse : audit@artisan-gestion.fr.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
