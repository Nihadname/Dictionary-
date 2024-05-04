$(document).ready(function(){
    $("#search").focus(function() {
        $(".search-box").addClass("border-searching");
        $(".search-icon").addClass("si-rotate");
    });
    $("#search").blur(function() {
        $(".search-box").removeClass("border-searching");
        $(".search-icon").removeClass("si-rotate");
    });
    $("#search").keyup(function() {
        if ($(this).val().length > 0) {
            $(".go-icon").addClass("go-in");
        } else {
            $(".go-icon").removeClass("go-in");
        }
    });
    $(".go-icon").click(function(){
        $(".search-form").submit();
    });

    let btn = document.querySelector(".btn");
    btn.addEventListener("click", GetDataFromApi);
});

async function GetDataFromApi() {
    const searchValue = document.querySelector("#search").value.trim();
    const cardWhole = document.querySelector(".cardWhole");
    const warningMessage = document.getElementById("warningMessage");

    // Function to show the warning message
    function showWarning() {
        warningMessage.classList.add("show");
    }

    // Function to hide the warning message
    function hideWarning() {
        warningMessage.classList.remove("show");
    }

    try {
        if (!searchValue) {
            return; // Don't proceed if search value is empty
        }

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchValue}`;
        const response = await fetch(url);

        if (!response.ok) {
            showWarning();
            return; // Stop execution if response is not successful
        }

        hideWarning();
        const json = await response.json();

        if (!json || json.length === 0) {
            return; // Stop execution if response data is empty
        }

        const word = json[0].word;
        if (word) {
            cardWhole.classList.remove("d-none");
        }

        const wordMain = document.querySelector(".wordMain");
        wordMain.textContent = word;

        const partOfSpeech = json[0].meanings[0]?.partOfSpeech; // Use optional chaining to avoid errors if partOfSpeech is undefined
        const phonetic = json[0]?.phonetic; // Use optional chaining to avoid errors if phonetic is undefined
        const thisHere = document.querySelector(".this");
        thisHere.innerHTML = `${partOfSpeech ? partOfSpeech + '/' : ''}${phonetic ? phonetic : ''}`;

        const meanings = json[0]?.meanings[0]?.definitions;
        const this2 = document.querySelector(".this2");
        const this3 = document.querySelector(".this3");
        let allDefinitionsHTML = "";
        let allExamplesHere = "";

        if (meanings && meanings.length > 0) {
            meanings.forEach((meaning, index) => {
                allDefinitionsHTML += `<p>Definition ${index + 1}: ${meaning.definition}</p>`;
                allExamplesHere += `<p>Example ${index + 1}: ${meaning.example ? meaning.example : 'No example available'}</p>`; // Provide a default message if example is undefined
            });
        } else {
            allDefinitionsHTML = "No definitions found.";
            allExamplesHere = "No examples found.";
        }

        this2.innerHTML = allDefinitionsHTML;
        this3.innerHTML = allExamplesHere;

        const synonyms = json[0]?.meanings[0]?.synonyms;
        const this4 = document.querySelector(".this4");

        if (synonyms && synonyms.length > 0) {
            let synonymsHTML = "Synonyms: ";
            synonyms.forEach((synonym, index) => {
                synonymsHTML += synonym;
                if (index !== synonyms.length - 1) {
                    synonymsHTML += ", "; // Add comma between synonyms
                }
            });
            this4.innerHTML = synonymsHTML;
        } else {
            this4.innerHTML = "No synonyms found.";
        }
        let antonyms=json[0]?.meanings[0]?.antonyms;
        let this5=document.querySelector(".this5");
        if(antonyms&&antonyms.length>0){
            let antonymsHtml = "antonyms: ";
            antonyms.forEach((antonym,index)=>{
                antonymsHtml+=antonym;
                if(index!==antonyms.length-1){
                    antonymsHtml+=","
                }
            });
            this5.innerHTML=antonymsHtml;
        }else{
            this5.innerHTML = "No synonyms found.";

        }
        const phoneticAudioUrl = json[0]?.phonetics[0]?.audio; // Extract audio URL from API response
        if (phoneticAudioUrl) {
            const audioElement = new Audio(phoneticAudioUrl); // Create new audio element
            const iconVolume = document.querySelector(".fa-volume-high");

            // Add click event to toggle audio playback
            iconVolume.addEventListener("click", () => {
                if (audioElement.paused) {
                    audioElement.play(); // Play audio
                    iconVolume.classList.add("fa-volume-mute"); // Change icon to indicate playing audio
                } else {
                    audioElement.pause(); // Pause audio
                    iconVolume.classList.remove("fa-volume-mute"); // Change icon to indicate paused audio
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
