// script.js

//Change theme based on room selection
document.getElementById('room-select').addEventListener('change', function () {
    const room = this.value;
    const body = document.body;
    const logo = document.querySelector('.header-right img');

    // Réinitialise toutes les classes de thème
    body.classList.remove('theme-default', 'theme-pga', 'theme-cdg');

    if (room === 'conference') {
        body.classList.add('theme-pga');
        logo.src = 'assets/logoPGA.png';
    } else if (room === 'willy') {
        body.classList.add('theme-cdg');
        logo.src = 'assets/logoCDG.png';
    } else {
        body.classList.add('theme-default');
        logo.src = 'assets/logo.png';
    }
});

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