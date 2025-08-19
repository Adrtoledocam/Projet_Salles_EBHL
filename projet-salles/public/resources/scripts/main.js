import { ROOMS_DATA } from "/controllers/roomsData.js";

const mainInfo = document.querySelector(".info-main"); // Panneau principal (gauche)
const secondInfo = document.querySelector(".events"); // Panneau secondaire (droite)
const selectedRoom = document.getElementById("calendar-select"); // Sélecteur de salle (liste)
const roomStatus = document.getElementById("status"); // État de la salle (libre ou occupée)
const clock = document.getElementById("clock"); // Heure

// Mise à jour de l'heure et rafraîchissement de la page chaque minutes
setInterval(() => {
  let date = new Date();
  /*clock.innerHTML = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });*/
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
        secondInfo.innerHTML = "<h2>Aucun événement aujourd’hui</h2>";

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
            })}  
            </p>
            <p>
            <img src="/resources/images/horloge-b-64.png" alt="" draggable="false" />
            ${start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - 
            ${end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      `;

      // Elements and structure progress bar
      if (isInProgress) {
        //Container
        const progressWrapper = document.createElement("div");
        progressWrapper.classList.add("progress-wrapper");

        //Logo Bar progress
        const progressBarLogo = document.createElement("div");
        progressBarLogo.innerHTML = `
            <img src="/resources/images/hourglassLogo.png" alt="" draggable="false" class="progress-logo"  />
        `;
        //Progress bar
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-container");
        progressBar.innerHTML = `
          <div id="progress-bar"></div>        
          `;
        //Countdown number
        const countdownBar = document.createElement("div");
        countdownBar.classList.add("progress-countdown");
        countdownBar.innerHTML = `
          <div id="progress-bar-number"></div>
        `;

        //Display in HTML
        progressWrapper.appendChild(progressBarLogo);
        progressWrapper.appendChild(progressBar);
        progressWrapper.appendChild(countdownBar);
        mainInfo.appendChild(progressWrapper);

        // Fonction bar progress with number and color
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

          //Time Calculate
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

          //Time display
          barNumber.textContent = "- " + timeText;
          if (msLeft <= 10 * 60 * 1000) {
            bar.style.backgroundColor = "#ff0000ff"; // Red when < 10 minutes
          } else {
            bar.style.backgroundColor = "#007bff"; // Blue when >= 10 minutes
          }
          //bar.textContent = "- " + timeText;
          //bar.textContent = Math.round(percent) + "%";
        }
        updateProgressBar();

        //  Update progress bar
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

          //Conflit Event condition "En course"
          let conflitHtml = "";
          if (now >= eventStart && now <= eventEnd) {
            conflitHtml = `

          <img src="/resources/images/processing-time.png" alt="En cours" style="width:22px;vertical-align:middle; filter: brightness(0) invert(1);" draggable="false" />
          <span style="color: #ff0000ff; font-weight: bold;">En cours</span>
        </span>
      `;
          }

          row.innerHTML = `
            <p> 
              <img src="/resources/images/meetingLogo.png" alt="" draggable="false" style="filter: brightness(0) invert(1);" />
              ${event.summary || ""}
            </p>
            <p> 
              <img src="/resources/images/calendrier-w-64.png" alt="" draggable="false" />
              ${new Date(event.start).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })} &nbsp; &nbsp; &nbsp; &nbsp;
              <img src="/resources/images/horloge-w-64.png" alt="" draggable="false" />
              ${new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - 
              ${new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} &nbsp; &nbsp; &nbsp; &nbsp;
          ${conflitHtml}
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
      alert("Erreur lors du chargement des horaires");
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
