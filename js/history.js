// =========================
// CLOUDTRANSLATE - HISTORY
// =========================

const historyTableBody =
    document.getElementById("historyTableBody");

const totalTranslations =
    document.getElementById("totalTranslations");

const totalCharacters =
    document.getElementById("totalCharacters");

const lastTranslation =
    document.getElementById("lastTranslation");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");


// =========================
// MODAL ELEMENTS
// =========================

const translationModal =
    document.getElementById("translationModal");

const closeTranslationModal =
    document.getElementById(
        "closeTranslationModal"
    );

const modalDate =
    document.getElementById("modalDate");

const modalFromLanguage =
    document.getElementById(
        "modalFromLanguage"
    );

const modalToLanguage =
    document.getElementById(
        "modalToLanguage"
    );

const modalOriginalText =
    document.getElementById(
        "modalOriginalText"
    );

const modalTranslatedText =
    document.getElementById(
        "modalTranslatedText"
    );


// =========================
// LANGUAGE NAMES
// =========================

const languageNames = {

    en: "English",
    hi: "Hindi",
    fr: "French",
    de: "German",
    es: "Spanish",
    ta: "Tamil",
    te: "Telugu"
     ml: "Malayalam",
    kn: "Kannada"

};


// =========================
// LOAD HISTORY
// =========================

function loadHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "translationHistory"
            )
        ) || [];


    // =========================
    // TOTAL TRANSLATIONS
    // =========================

    totalTranslations.innerText =
        history.length;


    // =========================
    // TOTAL CHARACTERS
    // =========================

    let characters = 0;

    history.forEach(function (item) {

        if (item.text) {

            characters +=
                item.text.length;

        }

    });

    totalCharacters.innerText =
        characters;


    // =========================
    // LAST TRANSLATION
    // =========================

    if (history.length > 0) {

        lastTranslation.innerText =
            history[0].date;

    } else {

        lastTranslation.innerText =
            "None";

    }


    // =========================
    // EMPTY HISTORY
    // =========================

    if (history.length === 0) {

        historyTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty-history">

                        <div class="empty-icon">
                            📭
                        </div>

                        <h3>
                            No translations yet
                        </h3>

                        <p>
                            Your translation history
                            will appear here.
                        </p>

                        <a
                            href="translate.html"
                            class="history-translate-button"
                        >
                            Start Translating →
                        </a>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    // =========================
    // CLEAR TABLE
    // =========================

    historyTableBody.innerHTML = "";


    // =========================
    // DISPLAY HISTORY
    // =========================

    history.forEach(function (item) {

        const row =
            document.createElement("tr");


        // =========================
        // DATE
        // =========================

        const dateCell =
            document.createElement("td");

        dateCell.innerText =
            item.date || "-";


        // =========================
        // FROM
        // =========================

        const fromCell =
            document.createElement("td");

        fromCell.innerText =
            languageNames[item.from] ||
            item.from ||
            "-";


        // =========================
        // TO
        // =========================

        const toCell =
            document.createElement("td");

        toCell.innerText =
            languageNames[item.to] ||
            item.to ||
            "-";


        // =========================
        // ORIGINAL TEXT
        // =========================

        const textCell =
            document.createElement("td");

        textCell.className =
            "history-preview-text";

        textCell.innerText =
            shortenText(
                item.text || "-"
            );


        // =========================
        // TRANSLATION
        // =========================

        const translationCell =
            document.createElement("td");

        translationCell.className =
            "history-preview-text";

        translationCell.innerText =
            shortenText(
                item.translation || "-"
            );


        // =========================
        // ACTION
        // =========================

        const actionCell =
            document.createElement("td");

        const viewButton =
            document.createElement("button");

        viewButton.className =
            "history-view-button";

        viewButton.innerText =
            "View";


        viewButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                showTranslation(item);

            }
        );


        actionCell.appendChild(
            viewButton
        );


        // =========================
        // ADD CELLS
        // =========================

        row.appendChild(
            dateCell
        );

        row.appendChild(
            fromCell
        );

        row.appendChild(
            toCell
        );

        row.appendChild(
            textCell
        );

        row.appendChild(
            translationCell
        );

        row.appendChild(
            actionCell
        );


        // =========================
        // CLICK ROW
        // =========================

        row.style.cursor =
            "pointer";


        row.addEventListener(
            "click",
            function () {

                showTranslation(item);

            }
        );


        historyTableBody.appendChild(
            row
        );

    });

}


// =========================
// SHORTEN LONG TEXT
// =========================

function shortenText(text) {

    if (text.length <= 45) {

        return text;

    }

    return text.substring(
        0,
        45
    ) + "...";

}


// =========================
// SHOW TRANSLATION
// =========================

function showTranslation(item) {

    const fromLanguage =
        languageNames[item.from] ||
        item.from ||
        "-";


    const toLanguage =
        languageNames[item.to] ||
        item.to ||
        "-";


    modalDate.innerText =
        item.date || "-";


    modalFromLanguage.innerText =
        fromLanguage;


    modalToLanguage.innerText =
        toLanguage;


    modalOriginalText.innerText =
        item.text || "-";


    modalTranslatedText.innerText =
        item.translation || "-";


    translationModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    translationModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


// Close button

closeTranslationModal.addEventListener(
    "click",
    closeModal
);


// Click outside modal

translationModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            translationModal
        ) {

            closeModal();

        }

    }
);


// Press Escape

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            translationModal.classList.contains(
                "show"
            )
        ) {

            closeModal();

        }

    }
);


// =========================
// CLEAR HISTORY
// =========================

clearHistoryButton.addEventListener(
    "click",
    function () {

        const confirmation =
            confirm(
                "Are you sure you want to clear all translation history?"
            );


        if (confirmation) {

            localStorage.removeItem(
                "translationHistory"
            );

            loadHistory();

        }

    }
);


// =========================
// LOAD HISTORY
// =========================

loadHistory();