
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL : "https://realtime-database-76bbc-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const publishEl = document.getElementById("publish-btn")
const inputTextEl = document.getElementById("endorsement-input")
const endorsementListEl = document.getElementById("endorsement-container")

onValue(endorsementsInDB, function(snapshot){
    if (snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
        clearEndorsementListEL()
        for (let i = 0; i < itemsArray.length; i++){
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendToEndorsements(endorsementListEl, currentItemValue)
        }
    }
    else {
        endorsementListEl.innerHTML = `<p> No endorsements here yet.</p>`
    }
})
publishEl.addEventListener("click", function(){
    let inputTextVal = inputTextEl.value
    console.log(inputTextVal)  
    inputTextEl.value = ""
    appendToEndorsements(endorsementListEl, inputTextVal)
})


function appendToEndorsements(endorsementListEl, textToAppend){
    push(endorsementsInDB, textToAppend)
    let newEndorsementP = document.createElement("p")
    newEndorsementP.classList.add("endorsement");
    newEndorsementP.textContent = textToAppend
    endorsementListEl.append(newEndorsementP)
}

function clearEndorsementListEL(){
    endorsementListEl.innerHTML = ""
}

