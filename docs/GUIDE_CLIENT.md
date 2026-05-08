# Guide client - Artisan Gestion

## Activer un utilisateur

1. Connectez-vous a Supabase Studio.
2. Ouvrez le projet Artisan Gestion.
3. Allez dans Table Editor, puis ouvrez la table `profiles`.
4. Trouvez l'utilisateur par son email.
5. Cliquez sur la cellule `is_active`.
6. Passez la valeur a `true`.
7. L'utilisateur peut maintenant creer un audit depuis son tableau de bord.

Un utilisateur non active voit le message : "Votre compte est en attente d'activation. Si vous avez paye via Calendly, votre acces sera active sous 24h."

## Modifier le contenu sans developpement

Dans Supabase Studio, table `questions`, vous pouvez modifier :

- `text` : texte de la question.
- `explanation` : texte affiche dans "En savoir plus".
- `weight` : poids de la question, entre 1 et 10.
- `risk_level` : niveau de risque, entre 1 et 5, ou vide.
- `display_order` : ordre d'affichage dans la categorie.

Dans la table `categories`, vous pouvez modifier :

- `name` : nom affiche.
- `description` : description interne.
- `weight_percent` : poids de la categorie dans le score final.

La somme des `weight_percent` des categories doit toujours faire 100. Le scoring de l'application lit ces valeurs dans Supabase a chaque finalisation d'audit.

## Ajouter une question

1. Ouvrez la table `questions`.
2. Cliquez sur Insert row.
3. Renseignez `category_id`, `text`, `weight`, `display_order`.
4. Ajoutez `risk_level` et `explanation` si necessaire.
5. Enregistrez.

La nouvelle question sera disponible pour les nouveaux audits. Evitez de modifier fortement les questions pendant qu'un prospect complete deja son audit.

## Supprimer une question

1. Ouvrez la table `questions`.
2. Selectionnez la question.
3. Supprimez la ligne.

Les reponses liees aux audits concernes peuvent etre affectees. Pour garder l'historique propre, privilegiez la modification du texte ou du poids plutot que la suppression.

## Ce qui necessite un developpeur

- Modifier l'algorithme mathematique de scoring.
- Modifier l'interface utilisateur, les couleurs ou les layouts.
- Ajouter une nouvelle categorie au-dela des 6 categories prevues.
- Ajouter une generation PDF automatique.
- Ajouter un dashboard admin web.
- Modifier les emails transactionnels en profondeur.

## Exploitation courante

- Les rendez-vous et paiements sont geres dans Calendly avec Stripe natif.
- Apres paiement, activez manuellement le compte dans `profiles`.
- A la finalisation d'un audit, l'application envoie automatiquement un email au prospect avec Gary-Alban en CC.
- Le rapport Excel contient une synthese et un detail question par question.
