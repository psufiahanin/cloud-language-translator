// ===============================
// CLOUDTRANSLATE - TRANSLATION
// ===============================

const sourceText = document.getElementById("sourceText");
const translatedText = document.getElementById("translatedText");
const translateButton = document.getElementById("translateButton");
const copyButton = document.getElementById("copyButton");
const characterCount = document.getElementById("characterCount");
const translateMessage = document.getElementById("translateMessage");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const swapButton = document.getElementById("swapButton");


// ===============================
// CHARACTER COUNTER
// ===============================

sourceText.addEventListener("input", function () {

    characterCount.innerText =
        sourceText.value.length + " / 5000";

});


// ===============================
// SWAP LANGUAGES
// ===============================

swapButton.addEventListener("click", function () {

    // Swap selected languages
    const oldSourceLanguage = sourceLanguage.value;

    sourceLanguage.value =
        targetLanguage.value;

    targetLanguage.value =
        oldSourceLanguage;


    // Swap text and translation
    const oldSourceText =
        sourceText.value;

    const oldTranslation =
        translatedText.innerText;


    if (
        oldTranslation !==
        "Your translation will appear here."
    ) {

        sourceText.value =
            oldTranslation;

        translatedText.innerText =
            oldSourceText;

    }


    // Update character count
    characterCount.innerText =
        sourceText.value.length + " / 5000";


    // Clear message
    translateMessage.innerText = "";

});


// ===============================
// TRANSLATE BUTTON
// ===============================

translateButton.addEventListener("click", async function () {

    const text =
        sourceText.value.trim();


    const fromLanguage =
        sourceLanguage.value;


    const toLanguage =
        targetLanguage.value;


    // ===============================
    // EMPTY TEXT CHECK
    // ===============================

    if (text === "") {

        translateMessage.innerText =
            "Please enter some text to translate.";

        translateMessage.style.color =
            "#dc2626";

        return;
    }


    // ===============================
    // SAME LANGUAGE
    // ===============================

    if (fromLanguage === toLanguage) {

        translatedText.innerText =
            text;

        translateMessage.innerText =
            "Source and target languages are the same.";

        translateMessage.style.color =
            "#2563eb";

        return;
    }


    // ===============================
    // LOADING
    // ===============================

    translateButton.disabled = true;

    translateMessage.innerText =
        "Translating...";

    translateMessage.style.color =
        "#2563eb";


    try {

        // ===============================
        // FREE TRANSLATION API
        // ===============================

        const url =
            "https://api.mymemory.translated.net/get" +
            "?q=" +
            encodeURIComponent(text) +
            "&langpair=" +
            encodeURIComponent(
                fromLanguage + "|" + toLanguage
            );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Translation service unavailable."
            );

        }


        const data =
            await response.json();


        // ===============================
        // CHECK RESULT
        // ===============================

        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {

            throw new Error(
                "Translation failed."
            );

        }


        const result =
            data.responseData.translatedText;


        // ===============================
        // DISPLAY RESULT
        // ===============================

        translatedText.innerText =
            result;


        translateMessage.innerText =
            "Translation completed successfully!";

        translateMessage.style.color =
            "#16a34a";


        // ===============================
        // SAVE HISTORY
        // ===============================

        const history =
            JSON.parse(
                localStorage.getItem(
                    "translationHistory"
                )
            ) || [];


        const translationRecord = {

            date:
                new Date().toLocaleString(),

            from:
                fromLanguage,

            to:
                toLanguage,

            text:
                text,

            translation:
                result

        };


        history.unshift(
            translationRecord
        );


        // Keep latest 50 translations
        localStorage.setItem(

            "translationHistory",

            JSON.stringify(
                history.slice(0, 50)
            )

        );


    } catch (error) {

        console.error(
            "Translation error:",
            error
        );


        translatedText.innerText =
            "Unable to translate.";


        translateMessage.innerText =
            "Unable to connect to the translation service.";

        translateMessage.style.color =
            "#dc2626";


    } finally {

        translateButton.disabled =
            false;

    }

});


// ===============================
// COPY TRANSLATION
// ===============================

copyButton.addEventListener(
    "click",
    async function () {

        const text =
            translatedText.innerText.trim();


        if (
            text === "" ||
            text ===
                "Your translation will appear here." ||
            text ===
                "Unable to translate."
        ) {

            return;

        }


        try {

            await navigator.clipboard.writeText(
                text
            );


            translateMessage.innerText =
                "Translation copied successfully!";

            translateMessage.style.color =
                "#16a34a";


        } catch (error) {

            translateMessage.innerText =
                "Unable to copy the translation.";

            translateMessage.style.color =
                "#dc2626";

        }

    }
);
// =========================
// LANGUAGE POPUP
// =========================

const languageBadge =
    document.getElementById("languageBadge");

const languagePopup =
    document.getElementById("languagePopup");

const closeLanguagePopup =
    document.getElementById("closeLanguagePopup");


languageBadge.addEventListener(
    "click",
    function () {

        languagePopup.classList.toggle("show");

    }
);


closeLanguagePopup.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        languagePopup.classList.remove("show");

    }
);
// =========================
// DARK MODE
// =========================

const themeToggle =
    document.getElementById("themeToggle");


const savedTheme =
    localStorage.getItem("cloudTranslateTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.innerText = "☀️";

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark-mode");


        if (
            document.body.classList.contains("dark-mode")
        ) {

            themeToggle.innerText = "☀️";

            localStorage.setItem(
                "cloudTranslateTheme",
                "dark"
            );

        } else {

            themeToggle.innerText = "🌙";

            localStorage.setItem(
                "cloudTranslateTheme",
                "light"
            );

        }

    }
);