name: Mise à jour du solde SkyBlock

on:
  schedule:
    - cron: '0 * * * *'   # toutes les heures, à HH:00
  workflow_dispatch:        # permet aussi de le lancer manuellement depuis l'onglet Actions

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Récupération du dépôt
        uses: actions/checkout@v4

      - name: Installation de Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Récupération du solde depuis l'API Hypixel
        env:
          HYPIXEL_API_KEY: ${{ secrets.HYPIXEL_API_KEY }}
          MC_UUID: ${{ vars.MC_UUID }}
        run: node scripts/update-balance.mjs

      - name: Commit et push si changement
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data.json
          git diff --staged --quiet || git commit -m "Mise à jour automatique du solde"
          git push
