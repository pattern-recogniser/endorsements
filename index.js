
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL : "https://realtime-database-76bbc-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const publishEl = document.getElementById("publish-btn")
const endorsementTextEl = document.getElementById("endorsement-input")
const fromTextEl = document.getElementById("from-input")
const toTextEl = document.getElementById("to-input")

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
    let endorsementText = endorsementTextEl.value
    let fromText = fromTextEl.value
    let toText = toTextEl.value
    let this_message = {
        "from": fromText,
        "to": toText,
        "message": endorsementText
    }
    push(endorsementsInDB, this_message)
    clearAllInputs([fromTextEl, toTextEl, endorsementTextEl])
})



function getElementsFromDBAndDisplay(snapshot){
    // Given a snapshot, retrieves elements from it
    // And then displays it
    clearEndorsementListEL()
    let itemsArray = Object.entries(snapshot.val())
    // let res = JSON.parse(snapshot.val())
    // for (const key in res){
    //     if(obj.hasOwnProperty(key)){
    //         console.log(`${key}: ${res[key]}`)
    //     }
    // }
    for (let i = 0; i < itemsArray.length; i++){
        let currentItem = itemsArray[i][1]
        if(typeof currentItem === 'string'){
            // Condition to retain old entries when the UI did not have 
            // sender and receiver options
            appendToEndorsements(endorsementListEl, currentItem, "sender", "receiver")
        }
        else if(typeof currentItem === 'object') {
            // Actual flow
            let messageObject = currentItem
            let sender = messageObject.from
            let messageText = messageObject.message
            let receiver = messageObject.to
            appendToEndorsements(endorsementListEl, messageText, sender, receiver)
        }

    }
}

function appendToEndorsements(endorsementListEl, endorsementMessage, sender, receiver){
    // Given an endorsement text to append, it displays in the list of
    // endorsements
    let newEndorsementP = getElement("p", "endorsement-p", endorsementMessage)
    let newSenderP = getElement("p", "from-to-p", `From: ${sender}`)
    let newReceiverP = getElement("p", "from-to-p", `To: ${receiver}`)
    let newEndorsementDiv = getElement("div", "endorsement", ``)

    // Creating the new endorsement message div
    newEndorsementDiv.append(newReceiverP)
    newEndorsementDiv.append(newEndorsementP)
    newEndorsementDiv.append(newSenderP)

    // Appending the new endorsement div to container
    endorsementListEl.append(newEndorsementDiv)
}

function getElement(elementTypeStr, elementClassStr, elementTextContent){
    let newElement = document.createElement(elementTypeStr)
    newElement.classList.add(elementClassStr);
    newElement.textContent = elementTextContent
    return newElement
}

function clearEndorsementListEL(){
    // Clears the endorsement container
    endorsementListEl.innerHTML = ""
}

function clearAllInputs(inputList){
    // Given a list of inputs, set the input text blank
    for (let i = 0; i < inputList.length; i++){
        inputList[i].value = ""
    }
}

