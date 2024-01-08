
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, child, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { doc, getDoc } from  "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

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
publishEl.addEventListener("click", function(e){
    // On clicking publish, add item to DB
    // console.log(e.target)
    let endorsementText = endorsementTextEl.value
    let fromText = fromTextEl.value
    let toText = toTextEl.value
    let this_message = {
        "from": fromText,
        "to": toText,
        "message": endorsementText,
        "likes": 0,
        "isLiked": false
    }
    push(endorsementsInDB, this_message)
    clearAllInputs([fromTextEl, toTextEl, endorsementTextEl])
})

endorsementListEl.addEventListener("click", function(e){
    
    if(e.target.getAttribute("class") === "likes"){
        let grandparentID = (e.target.parentNode).parentNode.id
        addLikesToEndorsement(grandparentID)
    }
    
    
})


function getElementsFromDBAndDisplay(snapshot){
    // Given a snapshot, retrieves elements from it
    // And then displays it
    clearEndorsementListEL()
    let itemsArray = Object.entries(snapshot.val())
    let snapshotVal = snapshot.val()
    snapshotVal = Object.fromEntries(Object.entries(snapshotVal).reverse())
    for(let key in snapshotVal){
        let keyVal = snapshotVal[key]
        if(typeof keyVal === 'string'){
            // Condition to retain old entries when the UI did not have 
            // sender and receiver options
            appendToEndorsements(endorsementListEl, keyVal, "sender", "receiver", "0", "key")
        }
        else if(typeof keyVal === 'object') {
            // Actual flow
            let messageObject = keyVal
            let sender = messageObject.from
            let messageText = messageObject.message
            let receiver = messageObject.to
            let likes = messageObject.likes
            let id = key
            appendToEndorsements(endorsementListEl, messageText, sender, receiver, likes, key)
        }
    }
   
}

function appendToEndorsements(endorsementListEl, endorsementMessage, sender, receiver, likes, key){
    // Given an endorsement text to append, it displays in the list of
    // endorsements
    let newEndorsementP = getElement("p", "endorsement-p", endorsementMessage)
    let newSenderP = getElement("p", "from-p", `From: ${sender}`)
    let newReceiverP = getElement("p", "to-p", `To: ${receiver}`)
    let newEndorsementDiv = getElement("div", "endorsement", ``)
    newEndorsementDiv.setAttribute("id", key)
    let newLikesSpan = getElement("span", "likes", likes+"♥")

    // Creating the new endorsement message div
    newEndorsementDiv.append(newReceiverP)
    newEndorsementDiv.append(newEndorsementP)
    newEndorsementDiv.append(newSenderP)
    newSenderP.append(newLikesSpan)

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

function addLikesToEndorsement(endorsementID){
    // functionaltiy that increments likes by 1 in DB
    // Step 1: Get value of likes from DB
    // Define what to write into DB
    // Write into DB
    // Update display -> OnValue will take care of that

    let messageObject = {}
    let updates = {}



    get(child(endorsementsInDB, `${endorsementID}`)).then((snapshot) => {
        let messageObject = snapshot.val()
        // if (messageObject.isLiked === true){
        //     console.log("already liked")
        // }
        // else {
        messageObject.isLiked = !messageObject.isLiked
        messageObject.likes += 1
        updates[endorsementID] = messageObject
        return update(endorsementsInDB, updates)
        // }



    })


}

// listen for click on which endorsement element has been clicked
// which endorsement document relates to teh element the user clicked on
// how many likes does that endorsement have
// Has the user liked the endorsement previously