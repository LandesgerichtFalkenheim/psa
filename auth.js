const STORAGE_ANK = "lg_ankuendigungen";
const STORAGE_GESETZ = "lg_gesetzesaenderungen";
const STORAGE_AUTH = "lg_logged_in";

// Demo-Zugang
const DEMO_USER = "mitarbeiter";
const DEMO_PASS = "gericht2025";

/* Hilfsfunktionen */

function istEingeloggt() {
    return localStorage.getItem(STORAGE_AUTH) === "true";
}

function setLoginStatus(status) {
    localStorage.setItem(STORAGE_AUTH, status ? "true" : "false");
}

function ladeAnkuendigungen() {
    const raw = localStorage.getItem(STORAGE_ANK);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function speichereAnkuendigungen(list) {
    localStorage.setItem(STORAGE_ANK, JSON.stringify(list));
}

function ladeGesetze() {
    const raw = localStorage.getItem(STORAGE_GESETZ);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function speichereGesetze(list) {
    localStorage.setItem(STORAGE_GESETZ, JSON.stringify(list));
}

/* Login-Seite */

function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const errorEl = document.getElementById("loginError");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("username").value.trim();
        const pass = document.getElementById("password").value;

        if (user === DEMO_USER && pass === DEMO_PASS) {
            setLoginStatus(true);
            window.location.href = "dashboard.html";
        } else {
            errorEl.textContent = "Benutzername oder Passwort ist ungültig.";
        }
    });
}

/* Dashboard – Zugriffsschutz */

function schützeDashboard() {
    const onDashboard = window.location.pathname.endsWith("dashboard.html");
    if (!onDashboard) return;

    if (!istEingeloggt()) {
        window.location.href = "login.html";
    }
}

/* Dashboard – Logout */

function initLogout() {
    const btn = document.getElementById("logoutBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        setLoginStatus(false);
        window.location.href = "login.html";
    });
}

/* Dashboard – Ankündigung erstellen */

function initAnkuendigungForm() {
    const form = document.getElementById("ankuendigungForm");
    if (!form) return;

    const successEl = document.getElementById("ankSuccess");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const titel = document.getElementById("ankTitel").value.trim();
        const text = document.getElementById("ankText").value.trim();
        const kategorie = document.getElementById("ankKategorie").value;

        if (!titel || !text || !kategorie) return;

        const liste = ladeAnkuendigungen();
        liste.unshift({
            titel,
            text,
            kategorie,
            erstelltAm: new Date().toISOString()
        });
        speichereAnkuendigungen(liste);

        form.reset();
        successEl.textContent = "Ankündigung wurde gespeichert und ist auf der Startseite sichtbar.";
        setTimeout(() => successEl.textContent = "", 3000);
    });
}

/* Dashboard – Gesetzesänderungen */

function initGesetzForms() {
    const neuForm = document.getElementById("gesetzNeuForm");
    const vorhForm = document.getElementById("gesetzVorhForm");
    const radios = document.querySelectorAll("input[name='gesetzArt']");

    if (!neuForm || !vorhForm || !radios.length) return;

    // Umschalten der Formulare
    radios.forEach(r => {
        r.addEventListener("change", () => {
            if (r.checked && r.value === "neu") {
                neuForm.classList.remove("hidden");
                vorhForm.classList.add("hidden");
            } else if (r.checked && r.value === "vorhanden") {
                vorhForm.classList.remove("hidden");
                neuForm.classList.add("hidden");
            }
        });
    });

    // Neues Gesetzbuch
    const neuSuccess = document.getElementById("neuSuccess");
    neuForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("neuName").value.trim();
        const abk = document.getElementById("neuAbk").value.trim();
        const link = document.getElementById("neuLink").value.trim();
        const datum = document.getElementById("neuDatum").value;

        if (!name || !abk || !link || !datum) return;

        const liste = ladeGesetze();
        liste.unshift({
            art: "neu",
            name,
            abk,
            link,
            datum,
            notiz: ""
        });
        speichereGesetze(liste);

        neuForm.reset();
        neuSuccess.textContent = "Neues Gesetzbuch wurde gespeichert und ist in der Übersicht sichtbar.";
        setTimeout(() => neuSuccess.textContent = "", 3000);
    });

    // Vorhandenes Gesetzbuch
    const vorhSuccess = document.getElementById("vorhSuccess");
    vorhForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const buch = document.getElementById("vorhBuch").value.trim();
        const paragraph = document.getElementById("vorhParagraph").value.trim();
        const notiz = document.getElementById("vorhNotiz").value.trim();
        const datum = document.getElementById("vorhDatum").value;

        if (!buch || !paragraph || !datum || notiz.length < 10) {
            vorhSuccess.textContent = "Bitte alle Felder ausfüllen. Notiz mindestens 10 Zeichen.";
            return;
        }

        const liste = ladeGesetze();
        liste.unshift({
            art: "vorhanden",
            buch,
            paragraph,
            notiz,
            datum
        });
        speichereGesetze(liste);

        vorhForm.reset();
        vorhSuccess.textContent = "Gesetzesänderung wurde gespeichert und ist in der Übersicht sichtbar.";
        setTimeout(() => vorhSuccess.textContent = "", 3000);
    });
}

/* Initialisierung */

document.addEventListener("DOMContentLoaded", () => {
    initLogin();
    schützeDashboard();
    initLogout();
    initAnkuendigungForm();
    initGesetzForms();
});
