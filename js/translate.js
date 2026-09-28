const ctSourceText = document.getElementById("sourceText");
const ctTranslatedText = document.getElementById("translatedText");
const ctTranslateButton = document.getElementById("translateButton");
const ctCopyButton = document.getElementById("copyButton");
const ctCharacterCount = document.getElementById("characterCount");
const ctTranslateMessage = document.getElementById("translateMessage");


// ========================================
// AWS API
// ========================================

const ctApiUrl =
    "https://gvsjyh3yzc.execute-api.eu-north-1.amazonaws.com/prod/translate";


// ========================================
// LANGUAGE CODE
// ========================================

function ctGetLanguageCode(id) {

    const select = document.getElementById(id);

    if (!select) return "";

    const option =
        select.options[select.selectedIndex];

    if (!option) return "";

    if (option.value) {

        return option.value
            .trim()
            .toLowerCase();

    }

    const name =
        option.textContent
            .trim()
            .toLowerCase();


    const languages = {

        english: "en",
        hindi: "hi",
        french: "fr",
        german: "de",
        spanish: "es",
        tamil: "ta",
        telugu: "te",
        malayalam: "ml",
        kannada: "kn"

    };


    for (const language in languages) {

        if (name.includes(language)) {

            return languages[language];

        }

    }


    return "";

}


// ========================================
// CHARACTER COUNT
// ========================================

if (ctSourceText && ctCharacterCount) {

    ctSourceText.addEventListener(
        "input",
        function () {

            ctCharacterCount.textContent =
                this.value.length + " / 5000";

        }
    );

}


// ========================================
// TRANSLATE
// ========================================

if (ctTranslateButton) {

    ctTranslateButton.addEventListener(
        "click",
        async function () {

            const text =
                ctSourceText.value.trim();


            const sourceLanguage =
                ctGetLanguageCode(
                    "sourceLanguage"
                );


            const targetLanguage =
                ctGetLanguageCode(
                    "targetLanguage"
                );


            if (!text) {

                ctTranslateMessage.textContent =
                    "Please enter some text to translate.";

                return;

            }


            if (
                !sourceLanguage ||
                !targetLanguage
            ) {

                ctTranslateMessage.textContent =
                    "Please select both languages.";

                return;

            }


            if (text.length > 5000) {

                ctTranslateMessage.textContent =
                    "Please keep the text under 5000 characters.";

                return;

            }


            ctTranslateButton.disabled = true;

            ctTranslateMessage.textContent =
                "Translating...";


            try {

                const response =
                    await fetch(
                        ctApiUrl,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                text: text,

                                source:
                                    sourceLanguage,

                                target:
                                    targetLanguage

                            })

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "AWS request failed: " +
                        response.status
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "AWS Translation Response:",
                    data
                );


                if (!data.translation) {

                    throw new Error(
                        "No translation received from AWS."
                    );

                }


              ctTranslatedText.value = data.translation;
ctTranslatedText.textContent = data.translation;


                // Remove placeholder class
                ctTranslatedText.classList.remove(
                    "translated-placeholder"
                );


                ctTranslateMessage.textContent =
                    "Translation completed successfully.";


                // ========================================
                // SAVE HISTORY
                // ========================================

                const history =
                    JSON.parse(
                        localStorage.getItem(
                            "translationHistory"
                        ) || "[]"
                    );


                history.unshift({

                    sourceText:
                        text,

                    translatedText:
                        data.translation,

                    sourceLanguage:
                        sourceLanguage,

                    targetLanguage:
                        targetLanguage,

                    date:
                        new Date().toLocaleString()

                });


                localStorage.setItem(

                    "translationHistory",

                    JSON.stringify(
                        history.slice(0, 50)
                    )

                );


            } catch (error) {

                console.error(
                    "Translation Error:",
                    error
                );


                ctTranslateMessage.textContent =
                    "Translation failed. Please try again.";

            }


            ctTranslateButton.disabled =
                false;

        }
    );

}


// ========================================
// COPY
// ========================================

if (ctCopyButton) {

    ctCopyButton.addEventListener(
        "click",
        async function () {

            const text =
    (ctTranslatedText.value || ctTranslatedText.textContent).trim();


            if (!text) {

                ctTranslateMessage.textContent =
                    "Nothing to copy.";

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    text
                );


                ctTranslateMessage.textContent =
                    "Translation copied!";


            } catch (error) {

                ctTranslatedText.select();

                document.execCommand(
                    "copy"
                );


                ctTranslateMessage.textContent =
                    "Translation copied!";

            }

        }
    );

}
// ========================================
// SWAP LANGUAGES
// ========================================

const ctSwapButton =
    document.getElementById("swapButton");

if (ctSwapButton) {

    ctSwapButton.addEventListener(
        "click",
        function () {

            const sourceLanguage =
                document.getElementById("sourceLanguage");

            const targetLanguage =
                document.getElementById("targetLanguage");


            if (!sourceLanguage || !targetLanguage) {
                return;
            }


            // Swap selected languages
            const oldSource =
                sourceLanguage.value;

            sourceLanguage.value =
                targetLanguage.value;

            targetLanguage.value =
                oldSource;


            // Also swap the text
            const oldText =
                ctSourceText.value;

            ctSourceText.value =
                ctTranslatedText.value;

            ctTranslatedText.value =
                oldText;


            // Update character count
            if (ctCharacterCount) {

                ctCharacterCount.textContent =
                    ctSourceText.value.length +
                    " / 5000";

            }


            // Clear message
            if (ctTranslateMessage) {

                ctTranslateMessage.textContent =
                    "Languages swapped.";

            }

        }
    );

}