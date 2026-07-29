// Récupère le solde SkyBlock (purse + banque) via l'API Hypixel
// et met à jour data.json avec la valeur du jour.

import { readFile, writeFile } from 'fs/promises';

const API_KEY = process.env.HYPIXEL_API_KEY;
const UUID = process.env.MC_UUID; // UUID Minecraft SANS tirets

if (!API_KEY || !UUID) {
  console.error('HYPIXEL_API_KEY ou MC_UUID manquant.');
  process.exit(1);
}

async function main() {
  const url = `https://api.hypixel.net/v2/skyblock/profiles?key=${API_KEY}&uuid=${UUID}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) {
    console.error('Erreur API Hypixel :', data.cause || JSON.stringify(data));
    process.exit(1);
  }

  const profiles = data.profiles || [];

  if (profiles.length === 0) {
    console.error('Aucun profil trouvé.');
    process.exit(1);
  }

  const profile = profiles.find(p => p.selected) || profiles[0];
  const member = profile.members?.[UUID];

  if (!member) {
    console.error('Membre introuvable.');
    process.exit(1);
  }

  // Décommente si tu veux voir tout le JSON du profil
  // console.log(JSON.stringify(profile, null, 2));

  // Purse
  const purse = Math.round(
    member.currencies?.coin_purse ??
    member.coin_purse ??
    0
  );

  // Banque (compatibilité plusieurs formats)
  const bank = Math.round(
    profile.bank_account ??
    profile.banking?.balance ??
    profile.profile?.bank_account ??
    0
  );

  const total = purse + bank;

  console.log('------------------------------');
  console.log(`Profil : ${profile.cute_name}`);
  console.log(`Purse  : ${purse.toLocaleString()}`);
  console.log(`Bank   : ${bank.toLocaleString()}`);
  console.log(`Total  : ${total.toLocaleString()}`);
  console.log('------------------------------');

  let entries = {};

  try {
    const raw = await readFile('data.json', 'utf8');
    entries = JSON.parse(raw);
  } catch {}

  const today = new Date().toISOString().slice(0, 10);
  entries[today] = total;

  await writeFile('data.json', JSON.stringify(entries, null, 2));

  console.log(`data.json mis à jour : ${today} -> ${total.toLocaleString()} coins`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
