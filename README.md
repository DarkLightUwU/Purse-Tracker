# Purse Tracker — Hypixel Skyblock

Suivi de ta fortune (purse + banque) sur Hypixel Skyblock, avec courbe et
mise à jour automatique toutes les heures via l'API Hypixel.

## 1. Créer le dépôt

1. Crée un nouveau dépôt **public** sur GitHub (ex: `skyblock-purse-tracker`).
2. Mets-y tous les fichiers de ce dossier en gardant la même arborescence :

```
index.html
data.json
scripts/update-balance.mjs
.github/workflows/update-balance.yml
```

## 2. Activer GitHub Pages

Dans le dépôt : **Settings → Pages** → Source: `Deploy from a branch` →
Branch: `main` / `/ (root)` → Save.

Ton site sera accessible à une adresse du type :
`https://TON-PSEUDO-GITHUB.github.io/skyblock-purse-tracker/`

## 3. Récupérer une clé API Hypixel

1. Va sur https://developer.hypixel.net et connecte-toi avec ton compte
   Hypixel/Minecraft.
2. Crée une application, puis génère une **clé API personnelle**.
3. Garde cette clé secrète (ne la mets jamais directement dans le code).

## 4. Récupérer ton UUID Minecraft

Va sur https://api.mojang.com/users/profiles/minecraft/TON_PSEUDO
(remplace `TON_PSEUDO`), et note la valeur du champ `"id"` (32 caractères,
**sans tirets**). C'est ton UUID.

## 5. Configurer les secrets du dépôt

Dans le dépôt : **Settings → Secrets and variables → Actions**

- Onglet **Secrets** → `New repository secret` :
  - Nom : `HYPIXEL_API_KEY`
  - Valeur : ta clé API Hypixel

- Onglet **Variables** → `New repository variable` :
  - Nom : `MC_UUID`
  - Valeur : ton UUID (sans tirets)

## 6. Lancer le premier import

Va dans l'onglet **Actions** du dépôt → sélectionne le workflow
"Mise à jour du solde SkyBlock" → **Run workflow** pour le lancer une
première fois manuellement (au lieu d'attendre la prochaine heure pile).

Ensuite, il se relance automatiquement toutes les heures (`cron: 0 * * * *`)
et met à jour `data.json` avec ton solde du jour. Le site va chercher ce
fichier à chaque chargement de page et affiche la dernière valeur connue.

## Notes

- Le solde correspond à **purse + banque**. Si tu veux uniquement le purse,
  supprime `+ bank` dans `scripts/update-balance.mjs`.
- Le dépôt doit être public pour que GitHub Pages soit gratuit : ton
  historique de solde (`data.json`) sera donc visible publiquement.
- Tu peux toujours ajouter/corriger une entrée manuellement depuis le
  formulaire du site — l'automatisation écrasera seulement la valeur du
  **jour en cours** au prochain passage horaire.
- Si l'action échoue, regarde les logs dans l'onglet Actions : la cause la
  plus fréquente est une clé API invalide ou un UUID mal copié.
