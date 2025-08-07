const ical = require("node-ical");
const axios = require("axios");
const ICS_URLS = require("./public/resources/scripts/icsURL.js").ICS_URLS;

// Récupération et mise en forme des données via le lien ICS publique
async function fetchICSData(id) {
  const url = ICS_URLS[id];

  if (!url) {
    throw new Error("ID de salle inconnu");
  }

  const response = await axios.get(url);
  const data = ical.parseICS(response.data);
  const now = new Date();

  const results = [];

  for (const e of Object.values(data)) {
    if (e.type !== "VEVENT" || !(e.start instanceof Date)) continue;

    if (e.rrule) {
      if (/annulé/i.test(e.summary)) continue;
      // On récupère tous les événement répétitifs d'aujourd'hui et on garde ceux qui ne sont pas encore terminés
      const searchStart = new Date(now);
      searchStart.setHours(0, 0, 0, 0);

      const searchEnd = new Date(now.getFullYear(), now.getMonth() + 3);
      const futureOccurrences = e.rrule.between(searchStart, searchEnd, true);
      const duration = e.end - e.start;

      // Envoi des événements répétitifs, dans le tableau des événements
      // Ne garder que les occurrences dont la fin est > maintenant
      for (const occ of futureOccurrences) {
        const occEnd = new Date(occ.getTime() + duration);
        if (occEnd <= now) continue; // déjà terminé, on ignore

        results.push({
          summary: e.summary,
          start: occ,
          end: occEnd,
        });
      }
    } else {
      if (/annulé/i.test(e.summary) || e.end <= now) continue;

      results.push({
        summary: e.summary,
        start: e.start,
        end: e.end,
      });
    }
  }

  // Tri dans l'ordre chronologique
  results.sort((a, b) => a.start - b.start);

  return results;
}

module.exports = fetchICSData;
