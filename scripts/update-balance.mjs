// Récupère le solde SkyBlock (purse + banque) via l'API Hypixel
// et met à jour data.json avec la valeur du jour.

import { readFile, writeFile } from 'fs/promises';

const API_KEY = process.env.HYPIXEL_API_KEY;
const UUID = process.env.MC_UUID; // UUID Minecraft SANS tirets

if (!API_KEY || !UUID) {
  console.error('HYPIXEL_API_KEY ou MC_UUID manquant (vérifie les secrets/variables du repo).');
  process.exit(1);
}

async function main() {
  const url = `https://api.hypixel.net/v2/skyblock/profiles?key=${API_KEY}&uuid=${UUID}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) {
    console.error('Erreur API Hypixel:', data.cause || JSON.stringify(data));
    process.exit(1);
  }

  const profiles = data.profiles || [];
  if (profiles.length === 0) {
    console.error('Aucun profil SkyBlock trouvé pour cet UUID.');
    process.exit(1);
  }

  // Le profil actuellement joué (celui sur lequel tu es entré en dernier)
  const profile = profiles.find(p => p.selected) || profiles[0];
  const member = profile.members?.[UUID];

  if (!member) {
    console.error('Membre introuvable dans le profil sélectionné.');
    process.exit(1);
  }

  // La structure de l'API a changé au fil du temps, on essaie plusieurs chemins
  const purse = Math.round(member.currencies?.coin_purse ?? member.coin_purse ?? 0);
  const bankingAvailable = profile.banking && typeof profile.banking.balance === 'number';
  const bank = bankingAvailable ? Math.round(profile.banking.balance) : 0;
  const total = purse + bank;

  if (!bankingAvailable) {
    console.warn('⚠️ Aucune donnée de banque reçue : active "Banking" dans les paramètres API en jeu (/api).');
  }

  console.log(`Profil: ${profile.cute_name || profile.profile_id} | Purse: ${purse} | Banque: ${bank} | Total: ${total}`);

  let entries = {};
  try {
    const raw = await readFile('data.json', 'utf-8');
    entries = JSON.parse(raw);
  } catch (e) {
    entries = {};
  }

  // Date du jour (UTC). Change 'sv-SE' timezone-aware si tu veux un autre fuseau.
  const today = new Date().toISOString().slice(0, 10);
  entries[today] = total;

  await writeFile('data.json', JSON.stringify(entries, null, 2));
  console.log(`data.json mis à jour pour ${today} : ${total} coins`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
