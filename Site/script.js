// script.js


//Date and Time clock 
function updateDateTime() {
    const now = new Date();
    const dateElem = document.getElementById("date-now");
    const timeElem = document.getElementById("time-now");

    const optionsDate = { weekday: "long", day: "numeric", month: "long" };
    const heure = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    dateElem.textContent = now.toLocaleDateString("fr-FR", optionsDate).toUpperCase();
    timeElem.textContent = heure;
}


//Date and time call
setInterval(updateDateTime, 1000);