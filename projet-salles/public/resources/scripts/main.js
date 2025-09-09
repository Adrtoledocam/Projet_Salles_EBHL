import { ROOMS_DATA } from "/controllers/roomsData.js";

const mainInfo = document.querySelector(".info-main"); // Panneau principal (gauche)
const secondInfo = document.querySelector(".events"); // Panneau secondaire (droite)
const selectedRoom = document.getElementById("calendar-select"); // Sélecteur de salle (liste)
const roomStatus = document.getElementById("status"); // État de la salle (libre ou occupée)

// Chargement du calendrier selon la salle sélectionnée
function loadCalendar(room) {
  // Récupération de la salle depuis le fichier de données
  const site = ROOMS_DATA[room]?.site || "pga";
  axios
    .get(`/api/calendar/${site}/${room}`)
    .then((res) => {
      const events = res.data;

      // Si aucun événement n'est trouvé
      if (events.length === 0) {
        mainInfo.innerHTML = "<h2>Aucun événement aujourd’hui</h2>";

        // Statut de la salle
        roomStatus.textContent = "Libre";
        roomStatus.className = "libre";
        return;
      }

      const first = events[0]; // Premier événement de la liste

      const now = new Date();
      const start = new Date(first.start);
      const end = new Date(first.end);
      const isInProgress = now >= start && now <= end; // Booléen: Vérifie si l'événement est en cours

      // Statut de la salle
      roomStatus.textContent = isInProgress ? "Occupée" : "Libre";
      roomStatus.className = isInProgress ? "occupee" : "libre";

      // Fonction pour formater l'heure
      function formatUTCTime(date) {
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }

      // Affichage de l'événement principal
      mainInfo.innerHTML = `
        <h2>${isInProgress ? "Événement en cours" : "Prochain événement"}</h2>
        <div class="first-event">
           <p>
             <img src="/resources/images/meeting-b-64.png" alt="" draggable="false" />
            ${first.summary}
          </p>
          
       ${
         // Affichage de l'organisateur de l'événement s'il existe
         first.organizer
           ? `
          <p>
             <img src="/resources/images/organisateur-b-64.png" alt="" draggable="false" />
            ${first.organizer}
          </p>
          `
           : ""
       }

          <p class="timestamp">
            <img src="/resources/images/calendrier-b-64.png" alt="" draggable="false" />
            ${start.toLocaleDateString([], {
              day: "2-digit",
              month: "2-digit",
            })}  &nbsp; 

            ${formatUTCTime(start)} - ${formatUTCTime(end)}
            </p>
            <p>
          </p>

        </div>`;

      if (isInProgress) {
        // Suppression de l'horloge si l'événement est en cours
        const timestamp = document.querySelector(".timestamp");
        timestamp.remove();

        // Composants de la barre de progression
        const progressWrapper = document.createElement("div");
        progressWrapper.classList.add("progress-wrapper");

        const progressBarLogo = document.createElement("div");
        progressBarLogo.innerHTML = `
        <img src="/resources/images/sablier-b-64.png" alt="" draggable="false" class="progress-logo"  />`;

        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-container");
        progressBar.innerHTML = `
        <div id="progress-bar"></div>`;

        const countdownBar = document.createElement("div");
        countdownBar.classList.add("progress-countdown");
        countdownBar.innerHTML = `
        <div id="progress-bar-number" style="font-size:1.5rem;"></div>`;

        progressWrapper.appendChild(progressBarLogo);
        progressWrapper.appendChild(progressBar);
        progressWrapper.appendChild(countdownBar);
        mainInfo.appendChild(progressWrapper);

        // Fonction qui met à jour la barre de progression
        function updateProgressBar() {
          const now = new Date();
          const percent = Math.max(
            0,
            Math.min(100, ((now - start) / (end - start)) * 100)
          );
          const bar = progressBar.querySelector("#progress-bar");
          const barNumber = countdownBar.querySelector("#progress-bar-number");
          bar.style.width = percent + "%";
          barNumber.style.color = "#414141";

          let msLeft = end - now;
          if (msLeft < 0) msLeft = 0;

          // Affichage du temps restant et changement de la couleur de la barre
          barNumber.textContent =
            end.getHours().toString().padStart(2, "0") +
            ":" +
            end.getMinutes().toString().padStart(2, "0");

          if (msLeft <= 10 * 60 * 1000) {
            bar.style.backgroundColor = "#d4583b";
          } else {
            bar.style.backgroundColor = "#27955a";
          }
        }
        updateProgressBar();

        //  Mise à jour de la barre de progression
        const intervalId = setInterval(() => {
          updateProgressBar();
          if (new Date() >= end) clearInterval(intervalId);
        }, 1000);
      }

      // Affichage des événements suivants
      if (events.length > 1) {
        secondInfo.innerHTML = "<h2>Événements à venir</h2>";

        // Suppression du premier événement, car il a déjà été affiché précédemment
        events.slice(1).forEach((event) => {
          const row = document.createElement("div");
          row.classList.add("event");

          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);

          // Gestion des conflits si un événement se produit en même temps qu'un autre
          let conflitHtml = "";
          if (now >= eventStart && now <= eventEnd) {
            conflitHtml = `<span style="color: #f4f4f8; font-weight: bold; text-decoration: underline;">En cours</span>`;
          }

          row.innerHTML = `
            <div class="event-info">


              ${
                // Suppression de la date de l'événement si l'événement est un conflit afin de laisser la place au texte "En cours"
                !conflitHtml && !conflitHtml.trim().length > 0
                  ? `
              <img src="/resources/images/calendrier-w-64.png" alt="" draggable="false" />
    `
                  : `<img src="/resources/images/processing-w-64.png" alt="" draggable="false" />`
              }

              <p>${conflitHtml}

             ${
               // Suppression de la date de l'événement si l'événement est un conflit afin de laisser la place au texte "En cours"
               !conflitHtml && !conflitHtml.trim().length > 0
                 ? `
              ${new Date(event.start).toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
              })} &nbsp; 
            `
                 : "&nbsp; "
             }
              ${formatUTCTime(new Date(event.start))} - ${formatUTCTime(
            new Date(event.end)
          )} &nbsp; 
            </p>
            </div>

            <div class="event-info">
              <img src="/resources/images/meeting-w-64.png" alt="" draggable="false" />
              <p class="summary-event"> 
                ${event.summary || ""}
              </p>
            </div>

            <div class="event-info">
            ${
              event.organizer && event.organizer.trim().length > 0
                ? `<img src="/resources/images/organisateur-w-64.png" alt="" draggable="false" />
                <p class="summary-event"> 
                  ${event.organizer || ""}
                </p>`
                : ""
            }
            </div>

 
          `;
          // Ajout de l'événement panneau secondaire
          secondInfo.appendChild(row);
        });
      } else {
        // Si aucun événement n'est pas trouvé
        secondInfo.innerHTML = "<h2>Pas d’autres événements</h2>";
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// Récupération du nom de la salle depuis l'URL, par défaut Salle_PGA_Beau-Site_Vignerons
const pathParts = window.location.pathname.split("/");
const salleId = pathParts[2] || "Default";

selectedRoom.value = salleId;
// Initialisation du calendrier
loadCalendar(selectedRoom.value);

// Mise à jour des données du calendrier chaque 5 secondes
setInterval(() => {
  loadCalendar(selectedRoom.value);
}, 5000);
