const infoMain = document.querySelector(".info-main");
const eventsContainer = document.querySelector(".events");
const select = document.getElementById("calendar-select");
const eventStatus = document.getElementById("status");
const clock = document.getElementById("clock");

setInterval(() => {
  let date = new Date();
  clock.innerHTML = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}, 1000);

function loadCalendar(room) {
  // Appel de l'API pour récupérer les événements de la salle sélectionnée
  fetch(`/api/calendar/${room}`)
    .then((res) => res.json())
    .then((events) => {
      if (events.length === 0) {
        infoMain.innerHTML = "<h2>Aucun événement aujourd’hui</h2>";
        eventsContainer.innerHTML = "<h2>Aucun événement aujourd’hui</h2>";
        eventStatus.textContent = "Libre";
        eventStatus.className = "libre";
        return;
      }

      const first = events[0];
      const now = new Date();
      const start = new Date(first.start);
      const end = new Date(first.end);
      const isInProgress = now >= start && now <= end;

      eventStatus.textContent = isInProgress ? "Occupée" : "Libre";
      eventStatus.className = isInProgress ? "occupee" : "libre";

      // Affichage de l'événement en cours ou du prochain événement
      infoMain.innerHTML = `
              <h2>${
                isInProgress ? "Événement en cours" : "Prochain événement"
              }</h2>
              <div class="first-event">
              <p>
              <img
              src="resources/images/calendrier-b-64.png"
              alt="Logo PGA avec fond transparent"
              draggable="false"
              />
                ${first.summary || ""}</p>
              <p>
              <img
              src="resources/images/horloge-b-64.png"
              alt="Logo PGA avec fond transparent"
              draggable="false"
              />  
                ${start.toLocaleDateString([], {
                  day: "2-digit",
                  month: "2-digit",
                })}  ${start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}</p>
            </div>
            `;

      // Affichage du reste des événements futurs
      if (events.length > 1) {
        eventsContainer.innerHTML = "<h2>Événements à venir</h2>";
        events.slice(1).forEach((event) => {
          const row = document.createElement("div");
          row.classList.add("event");
          row.innerHTML = `
                  <p>
              <img
              src="resources/images/calendrier-w-64.png"
              alt="Logo PGA avec fond transparent"
              draggable="false"
              />

                    ${event.summary || ""}</p>
                  <p>
              <img
              src="resources/images/horloge-w-64.png"
              alt="Logo PGA avec fond transparent"
              draggable="false"
              />  
                    ${new Date(event.start).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    })} ${new Date(event.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(event.end).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
                `;
          eventsContainer.appendChild(row);
        });
      } else {
        eventsContainer.innerHTML = "<h2>Pas d’autres événements</h2>";
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Erreur lors du chargement des horaires");
    });
}

loadCalendar(select.value);

select.addEventListener("change", () => {
  loadCalendar(select.value);
});
