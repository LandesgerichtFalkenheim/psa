// Schlüssel für localStorage
const STORAGE_ANK = "lg_ankuendigungen";
const STORAGE_GESETZ = "lg_gesetzesaenderungen";

function ladeAnkuendigungen() {
    const raw = localStorage.getItem(STORAGE_ANK);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
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

/* Startseite – Ankündigungen */

function renderAnkuendigungen(filter = "alle") {
    const container = document.getElementById("ankuendigungenListe");
    if (!container) return;

    const daten = ladeAnkuendigungen();
    container.innerHTML = "";

    const gefiltert = daten.filter(a => filter === "alle" || a.kategorie === filter);

    if (gefiltert.length === 0) {
        container.innerHTML = `<p class="hint-text">Derzeit liegen keine Ankündigungen in dieser Kategorie vor.</p>`;
        return;
    }

    gefiltert.forEach(a => {
        const card = document.createElement("article");
        card.className = "card ank-card";

        const badge = document.createElement("span");
        badge.className = "ank-kategorie " + (a.kategorie === "Rot" ? "rot" : a.kategorie === "Gelb" ? "gelb" : "gruen");
        badge.textContent = a.kategorie;

        const title = document.createElement("h4");
        title.textContent = a.titel;

        const text = document.createElement("p");
        text.textContent = a.text;

        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(text);

        container.appendChild(card);
    });
}

/* Gesetzesänderungen-Seite */

function renderGesetze() {
    const container = document.getElementById("gesetzesListe");
    if (!container) return;

    const daten = ladeGesetze();
    container.innerHTML = "";

    if (daten.length === 0) {
        container.innerHTML = `<p class="hint-text">Derzeit sind keine Gesetzesänderungen veröffentlicht.</p>`;
        return;
    }

    daten.forEach(g => {
        const card = document.createElement("article");
        card.className = "card gesetz-card";

        const type = document.createElement("div");
        type.className = "gesetz-type";
        type.textContent = g.art === "neu" ? "Neues Gesetzbuch" : "Änderung eines bestehenden Gesetzbuchs";

        const meta = document.createElement("div");
        meta.className = "gesetz-meta";

        if (g.art === "neu") {
            meta.innerHTML = `
                <strong>${g.name}</strong> (${g.abk})<br>
                In-Kraft-Tretung: ${g.datum}<br>
                Link: <a href="${g.link}" target="_blank" rel="noopener">Google-Docs</a>
            `;
        } else {
            meta.innerHTML = `
                Gesetzbuch: <strong>${g.buch}</strong><br>
                Paragraph: ${g.paragraph}<br>
                In-Kraft-Tretung: ${g.datum}
            `;
        }

        const notiz = document.createElement("p");
        notiz.style.marginTop = "6px";
        notiz.style.fontSize = "0.9rem";
        notiz.textContent = g.notiz || "";

        card.appendChild(type);
        card.appendChild(meta);
        if (g.notiz) card.appendChild(notiz);

        container.appendChild(card);
    });
}

/* Filter-Buttons auf Startseite */

function initFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");
            renderAnkuendigungen(filter);
        });
    });
}

/* Initialisierung */

document.addEventListener("DOMContentLoaded", () => {
    renderAnkuendigungen();
    renderGesetze();
    initFilter();
});
