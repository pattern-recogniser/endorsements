
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
        getElementsFromDBAndDisplay(snapshot)
    }
    else {
        endorsementListEl.innerHTML = `<p> No endorsements here yet.</p>`
    }
})
publishEl.addEventListener("click", function(){
    // On clicking publish, add item to DB
    let inputTextVal = inputTextEl.value
    push(endorsementsInDB, inputTextVal)
    inputTextEl.value = ""
})


function appendToEndorsements(endorsementListEl, textToAppend){
    // Given an endorsement text to append, it displays in the list of
    // endorsements
    let newEndorsementP = document.createElement("p")
    newEndorsementP.classList.add("endorsement");
    newEndorsementP.textContent = textToAppend
    endorsementListEl.append(newEndorsementP)
}

function clearEndorsementListEL(){
    endorsementListEl.innerHTML = ""
}

function getElementsFromDBAndDisplay(snapshot){
    // Given a snapshot, retrieves elements from it
    // And then displays it
    clearEndorsementListEL()
    let itemsArray = Object.entries(snapshot.val())
    for (let i = 0; i < itemsArray.length; i++){
        let currentItem = itemsArray[i]
        let currentItemID = currentItem[0]
        let currentItemValue = currentItem[1]
        appendToEndorsements(endorsementListEl, currentItemValue)
    }
}

