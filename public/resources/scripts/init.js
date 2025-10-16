import { ROOMS_DATA } from "/controllers/roomsData.js";

const select = document.getElementById("calendar-select");

if (
  window.location.pathname.includes("/Default") ||
  (!window.location.pathname.includes("/pga") &&
    !window.location.pathname.includes("/ebhl") &&
    !window.location.pathname.includes("/cdg"))
) {
  select.removeAttribute("disabled");
}

// Récupération des informations sur le site et le nom de la salle depuis l'URL
const pathParts = window.location.pathname.split("/");
const site = pathParts[1] || "pga";
const salleId = pathParts[2] || "Default";

// Mise à jour du titre de la salle
document.getElementById("calendar-select").value = salleId;
fetchData(site, salleId);

// Mise à jour de l'URL lors du changement de salle depuis la liste déroulante
document.getElementById("calendar-select").addEventListener("change", (e) => {
  const newSalle = e.target.value;
  const newSite = ROOMS_DATA[newSalle]?.site || "pga";
  window.location.href = `/${newSite}/${newSalle}`;
});

async function fetchData(site, id) {
  const res = await fetch(`/api/calendar/${site}/${id}`);
  const events = await res.json();
}

const root = document.documentElement;
const logo = document.getElementById("site-logo");

// Mise à jour du style et du logo en fonction du site
switch (site) {
  case "ebhl":
    root.style.setProperty("--main-color", "#F1AB00");
    logo.src = "/resources/images/ebhl.png";
    break;
  case "cdg":
    root.style.setProperty("--main-color", "#CB0447");
    logo.src = "/resources/images/cdg.png";
    break;
  default:
    root.style.setProperty("--main-color", "#003596");
    logo.src = "/resources/images/pga.png";
}
