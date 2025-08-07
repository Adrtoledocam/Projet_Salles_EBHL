const ical = require("node-ical");
const axios = require("axios");

// Toutes les URL publiques pour accèder au fichier ICS de la ressource
const ICS_URLS = {
  "Salle_PGA_Beau-Site_Colloque":
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/726bb31e016a47dbbb8e399865c4a1d9@eben-hezer.ch/14454d8d84e741e98d21a203e8b339103993903089613600432/calendar.ics",
  "Salle_PGA_Beau-Site_Espace-Felix":
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/a13f7558b5044127bf913ce2b5c23fa3@eben-hezer.ch/d4c79109624649199bc2892fff526b745409380396816643899/calendar.ics",
  "Salle_PGA_Beau-Site_Quart-DHeure-Vaudois":
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/86fa51c8269f4906871ff9c78da70d42@eben-hezer.ch/94a4200763ef454da2ba6cf198484cfd12839416324990970364/calendar.ics",
  "Salle_PGA_Beau-Site_Veranda":
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/ba0b45356d3f40ebbc063763fed13bf5@eben-hezer.ch/f49fe575d7664f56ad96f59a072ca79b2966595426940186045/calendar.ics",
  "Salle_PGA_Beau-Site_Vignerons":
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/b6287f6654f04e5883b10befc62dc7f0@eben-hezer.ch/85753b96bdf44ff2a4062521f830a1be17337712867828642393/calendar.ics",
  Salle_PGA_Bonnettes_Colloque:
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/b838e7d766894afdaf7cea4e00b1a55b@eben-hezer.ch/b5dadfa0fc5041479a80dbdbf5b71ddf11107132211051048243/calendar.ics",
  "Salle_PGA_Coteau-Muraz_Colloque":
    "http://mailpersonnel.eben-hezer.ch/owa/calendar/21836e9a6aa0427095f45c47fda2aa4b@eben-hezer.ch/799e2cfed9554caca855c5f5a8737d852073725888054266005/calendar.ics",
};

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
