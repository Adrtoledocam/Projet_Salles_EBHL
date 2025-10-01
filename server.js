const ical = require("node-ical");
const axios = require("axios");
const ROOMS_DATA = require("./public/controllers/roomsData.js").ROOMS_DATA;

// Récupération et mise en forme des données via le lien ICS
async function fetchICSData(room) {
  const url = ROOMS_DATA[room]?.url;

  if (!url) {
    throw new Error("Le nom de salle est incorrect/inexistant.");
  }
  const response = await axios.get(url);
  const data = ical.parseICS(response.data); // Transformation des données ICS en object JS
  const now = new Date();

  const results = [];

  // Parcours de tous les événements récupérés dans
  for (const e of Object.values(data)) {
    if (e.type !== "VEVENT" || !(e.start instanceof Date)) continue;

    if (/annulé/i.test(e.summary) || e.summary == "") continue;
    // Si l'événement est un événement récurrent on va créer toutes les occurrences
    if (e.rrule) {
      // On récupère tous les événement répétitifs d'aujourd'hui et on garde ceux qui ne sont pas encore terminés
      const searchRangeStart = new Date(now);
      searchRangeStart.setHours(0, 0, 0, 0);

      // On va créer les événements qui se répèten pour le mois en cours
      const searchRangeEnd = new Date(searchRangeStart);
      searchRangeEnd.setDate(searchRangeEnd.getDate() + 31);

      const rruleEvents = e.rrule.between(
        searchRangeStart,
        searchRangeEnd,
        true
      );

      // On ajoute le dernier élément récurrent s'il est dans la période
      if (e.rrule.options.until && e.rrule.options.until <= searchRangeEnd) {
        rruleEvents.push(e.rrule.options.until);
      }

      const eventDuration = e.end - e.start;

      for (const rrE of rruleEvents) {
        const rreStart = new Date(
          rrE.getTime() + rrE.getTimezoneOffset() * 60000
        );
        const rreEnd = new Date(rreStart.getTime() + eventDuration);

        if (rreEnd <= now) continue;

        results.push({
          summary: e.summary,
          start: rreStart,
          end: rreEnd,
        });
      }
    } else {
      if (e.end <= now) continue;

      // Envoi de l'événement dans le tableau
      results.push({
        summary: e.summary,
        start: e.start,
        end: e.end,
      });
    }
  }

  results.sort((a, b) => a.start.getTime() - b.start.getTime());

  return results.slice(0, 4); // On ne garde que les 4 premiers événements
}

// Récupération et mise en forme des données suite à leur récupération depuis la base de données
async function fetchDBData(events) {
  const now = new Date();
  const results = [];

  for (const e of Object.values(events)) {
    if (/annulé/i.test(e.titleEvent) || e.titleEvent == "") continue; // Si l'événement est annulé, on l'ignore

    const start = e.startEvent;
    const end = e.endEvent;
    if (end <= now) continue; // Ignore les événements passés

    // Envoi de l'événement dans le tableau
    results.push({
      summary: e.titleEvent,
      organizer: e.organizerEvent,
      start,
      end,
    });
  }

  results.sort((a, b) => a.start - b.start); // Tri dans l'ordre chronologique

  return results.slice(0, 3); // On ne garde que les 4 premiers événements
}

module.exports = { fetchICSData, fetchDBData };
