import { ROOMS_DATA } from "/controllers/roomsData.js";

const mainInfo = document.querySelector(".info-main"); // Panneau principal (gauche)
const secondInfo = document.querySelector(".events"); // Panneau secondaire (droite)
const selectedRoom = document.getElementById("calendar-select"); // Sélecteur de salle (liste)
const roomStatus = document.getElementById("status"); // État de la salle (libre ou occupée)

// Mise à jour de l'heure et rafraîchissement de la page chaque minutes
setInterval(() => {
  let date = new Date();
}, 2);

// Chargement du calendrier selon la salle sélectionnée
function loadCalendar(room) {
  // Récupération du lien de la salle depuis le fichier roomsData.js
  const site = ROOMS_DATA[room]?.site || "pga";
  axios
    .get(`/api/calendar/${site}/${room}`)
    .then((res) => {
      const events = res.data;

      // Si aucun événement n'est trouvé
      if (events.length === 0) {
        mainInfo.innerHTML = "<h2>Aucun événement aujourd’hui</h2>";
        secondInfo.innerHTML = "<h2> </h2>";

        // Statut de la salle
        roomStatus.textContent = "Libre";
        roomStatus.className = "libre";
        return;
      }

      const first = events[0]; // Premier événement de la liste

      const now = new Date();
      const start = new Date(first.start);
      const end = new Date(first.end);
      const isInProgress = now >= start && now <= end; // Vérifie si l'événement est en cours

      // Statut de la salle
      roomStatus.textContent = isInProgress ? "Occupée" : "Libre";
      roomStatus.className = isInProgress ? "occupee" : "libre";

      // Affichage de l'événement principal
      mainInfo.innerHTML = `
        <h2>${isInProgress ? "Événement en cours" : "Prochain événement"}</h2>
        <div class="first-event">
          <p>
            <img src="/resources/images/meetingLogo.png" alt="" draggable="false" />
            ${first.summary}
          </p>
          <p>
            <img src="/resources/images/calendrier-b-64.png" alt="" draggable="false" />
            ${start.toLocaleDateString([], {
              day: "2-digit",
              month: "2-digit",
            })}  &nbsp; 

            ${start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - 
            ${end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            </p>
            <p>
          </p>
        </div>`;

      // Composants de la barre de progression
      if (isInProgress) {
        const progressWrapper = document.createElement("div");
        progressWrapper.classList.add("progress-wrapper");

        const progressBarLogo = document.createElement("div");
        progressBarLogo.innerHTML = `
        <img src="/resources/images/hourglassLogo.png" alt="" draggable="false" class="progress-logo"  />`;

        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-container");
        progressBar.innerHTML = `
        <div id="progress-bar"></div>`;

        const countdownBar = document.createElement("div");
        countdownBar.classList.add("progress-countdown");
        countdownBar.innerHTML = `
        <div id="progress-bar-number"></div>`;

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

          let msLeft = end - now;
          if (msLeft < 0) msLeft = 0;

          const totalSeconds = Math.floor(msLeft / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          let timeText = "";
          if (hours > 0) {
            timeText = `${hours}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          } else {
            timeText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
          }

          // Affichage du temps restant et changement de la couleur de la barre
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
            conflitHtml = `

          <img src="/resources/images/processing-time.png" alt="En cours" style="width:22px;vertical-align:middle; filter: brightness(0) invert(1);" draggable="false" />
          <span style="color: #d4583b; font-weight: bold;">En cours</span>
        </span>
      `;
          }

          row.innerHTML = `
             <p> 
              <img src="/resources/images/calendrier-w-64.png" alt="" draggable="false" />
              ${new Date(event.start).toLocaleDateString([], {
                day: "2-digit",
                month: "2-digit",
              })} &nbsp; 
              ${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - 
              ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} &nbsp; 
          ${conflitHtml}
            </p>


            <p class="summary-event"> 
              ${event.summary}
            </p>

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
const salleId = pathParts[2] || "Salle_PGA_Beau-Site_Vignerons";

selectedRoom.value = salleId;
// Initialisation du calendrier
loadCalendar(selectedRoom.value);

// Mise à jour des données du calendrier chaque 5 secondes
setInterval(() => {
  loadCalendar(selectedRoom.value);
}, 5000);
