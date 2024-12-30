let websocketGame = {

    // Constants
    LINE_SEGMENT : 0,
    CHAT_MESSAGE : 1,
    JOIN_CHATROOM_MESSAGE : 2,
    LEFT_CHATROOM_MESSAGE : 3,
    USERNAME_CHANGE_MESSAGE : 4,
    USER_DELETE : 5,
    STORE_NEW_GAME_NAME : 6,
    GET_ALL_POSSIBLE_GAME_LOBBIES_NAMES : 7,
    ADD_USERNAME_TO_GAME_LOBBY_X : 8,
    GET_ALL_USERNAMES_IN_LOBBY_X : 9,
    EXIT_USER_FROM_THE_GAME_LOBBY : 10,
    DELETE_GAME_LOBBY : 11,
    CHECK_USER_IS_NOT_IN_LOBBY : 12,
    GAME_READY_STARTER : 13,
    GAME_READY_MESSAGE : 14,

    INITIAL_GAME_DATA : 15,
    CARDS_ARE_GIVEN : 16,
    BET_VALUE_SET : 17,
    CARD_CHOICE : 18,

    CARD_COMPARE_RESULT : 19,
    CONTINUE_OR_START_NEW_ROUND_MESSAGE : 20,
    SEND_SCORE_PER_ROUND : 21,
    SEND_STICH_MESSAGE : 22,
    SHOW_THE_QUIT_WINDOW : 23,
    EXIT_FROM_THE_GAME : 24,

    OVER_ALL_WINNER : 99,


    // Helper Variables
    language : "Deutsch",
    username : "Max Mustermann",
    userId : "",
    inGameLobby : false,
    inGame : false,
    gameId : "",
    myIndex : 0,
    playerCounter : 0,
    handCartList : [],
    hasBet : false,
    hasCardChoice : false,
    turnCounter : 0,
    chosenCardId : "",
    leaveGameConfirmWindow : false,
}


// init script when the DOM ist ready
$(function(){
    // check if existence of WebSockets in browser
    if(window["WebSocket"]){

        //create connection
        websocketGame.socket = new WebSocket("ws://127.0.0.1:8000")

        // on open event
        websocketGame.socket.onopen = function (e) {
            console.log('Websocket connection established.' + e.type);
        };

        // on close event
        websocketGame.socket.onclose = function (e) {
            console.log('Websocket connection closed.' + e.type);
        };

        //on message event
        websocketGame.socket.onmessage = function (e) {
            // check if the received data is chat or line segment
            //console.log("onmessage event:", JSON.parse(e.data));
            let data = JSON.parse(e.data);

            //alert(data.dataType);
            if (data.dataType === websocketGame.CHAT_MESSAGE) {
                renderMessage("other", data);
                websocketGame.clients.forEach(function each(client) {
                    console.log('Client.ID: ' + client.id);
                });
            }
            else if (data.dataType === websocketGame.JOIN_CHATROOM_MESSAGE) {
                showJoinUserToChatroom(data);
            }
            else if (data.dataType === websocketGame.LEFT_CHATROOM_MESSAGE) {
                showLeftUserToChatroom(data);
            }
            else if(data.dataType === websocketGame.GET_ALL_POSSIBLE_GAME_LOBBIES_NAMES) {
                renderGameLobbies(data.message);
            }
            else if (data.dataType === websocketGame.ADD_USERNAME_TO_GAME_LOBBY_X){
                accessToTheLobby(data.message);
            }
            else if (data.dataType === websocketGame.GET_ALL_USERNAMES_IN_LOBBY_X){
                showAllPlayerInGameLobby(data.message);
            }
            else if (data.dataType === websocketGame.DELETE_GAME_LOBBY) {
                deletedLobbyMessage(data.message);
            }
            else if (data.dataType === websocketGame.CHECK_USER_IS_NOT_IN_LOBBY) {
                websocketGame.inGameLobby = data.message;
            }
            else if (data.dataType === websocketGame.GAME_READY_STARTER){
                confirmToGameReadyStarted(data.message);
            }
            else if (data.dataType === websocketGame.GAME_READY_MESSAGE){
                confirmGameStart(data.message)
            }
            else if (data.dataType === websocketGame.INITIAL_GAME_DATA){
                initialGameGUI(data.message);
            }
            else if(data.dataType === websocketGame.CARDS_ARE_GIVEN){
                showHandCards(data.message);
            }
            else if(data.dataType === websocketGame.BET_VALUE_SET){
                renderBetValue(data.message);
            }
            else if (data.dataType === websocketGame.CARD_CHOICE){
                renderCardChoice(data.message);
            }
            else if (data.dataType === websocketGame.CARD_COMPARE_RESULT){
                renderStichFinder(data.message);
            }
            else if (data.dataType === websocketGame.CONTINUE_OR_START_NEW_ROUND_MESSAGE){
                renderContinueRound();
            }
            else if (data.dataType === websocketGame.SEND_SCORE_PER_ROUND){
                renderScoreFromAllUsers(data.message);
            }
            else if (data.dataType === websocketGame.SEND_STICH_MESSAGE){
                renderEndRoundMessage(data.message);
            }
            else if (data.dataType === websocketGame.OVER_ALL_WINNER){
                renderWinnerOverAll(data.message);
            }
            else if (data.dataType === websocketGame.SHOW_THE_QUIT_WINDOW){
                openQuitWindow();
            }
            else if (data.dataType === websocketGame.EXIT_FROM_THE_GAME){
                renderExitFromGameMessage(data.message);
            }
        };
    }
});


// ****************************** clickListener ******************************
$("#joinUser").click(openMenu);

$("#openChat").click(joinChat);
$("#chatSend").click(sendMessage);
$("#newGame").click(newGame);
$("#joinGame").click(joinGame);
$("#mainSetup").click(setup);
$("#exitButton").click(exitButton);
$("#errorConfirmMain").click(errorMainWindowClose);
$("#failConfirmMain").click(errorMainWindowClose);

$("#chatroomBackButton").click(leftChat);

$("#startGame").click(confirmToGameReady)
$("#lobbyBackButton").click(lobbyBackButton);
$("#exitLobby").click(userExitLobby);
$("#deleteLobby").click(userDeleteLobby);
$("#errorConfirmDeleteLobby").click(errorLobbyWindowClose);
$("#confirmGameStopButton").click(gameStartWasCanceled)
$("#errorConfirmStatedLobby").click(errorMainWindowClose);

$("#setupBackButton").click(setupBackButton);
$("#changeUsername").click(setupNameChange);

$("#makeABetButton").click(showBetWindow);
$("#infoWindowButton").click(infoWindowButtonHandler);
$("#stopBetButton").click(closeInfoWindow);
$("#barrelGameRules").click(showGameRules);
$("#closeGameRulesButton").click(closeGameRules);
$("#hittingOrderButton").click(showTheHittingRank);
$("#closeHittingOrderButton").click(hiddeTheHittingRank);

$("#leaveButton").click(leaveButtonHandler);
$("#continueTheGameButton").click(continueTheGameButtonHandler);


// ****************************** General-Functions ******************************
// Check all inputFields for empty values
function checkUsernameInput(inputField){
    const usernameInput = inputField;
    let alertInputText = "";
    if (usernameInput.value ==="") {
        if (websocketGame.language === "Deutsch"){
            alertInputText = "Bitte einen Namen eintragen.";
        } else if (websocketGame.language === "English"){
            alertInputText = "Please enter a name.";
        }
        alert(alertInputText)
        return false;
    } else {
        return true;
    }
}
// Function to change the Username
function sendUserUpdate(username){
    let data = {};
    data.dataType = websocketGame.USERNAME_CHANGE_MESSAGE;
    data.message = username;
    websocketGame.socket.send(JSON.stringify(data));
}

// ConfirmButtonHandler by Errors
function errorMainWindowClose(){
    document.getElementById("errorBannerMainDiv").hidden = true;
    document.getElementById("toManyPlayerBannerMainDiv").hidden = true;
    document.getElementById("errorBannerStartedLobbyDiv").hidden = true;
}
// CheckFunktion for the state "inGameLobby"
function checkUserIsNotInLobby(){
    let data = {};
    data.dataType = websocketGame.CHECK_USER_IS_NOT_IN_LOBBY;
    data.message = "get all Lobbies";
    websocketGame.socket.send(JSON.stringify(data));
}


// ****************************** WelcomeSite-Functions ******************************
// Press Enter for confirmation
$("#username").keypress(function (event){
    if(event.keyCode === 13) {
        openMenu();
    }
});
// JoinNowButtonHandler
function openMenu(){
    const usernameInput = document.getElementById("username");
    if (checkUsernameInput(usernameInput)){
        console.log("open menu");
        $("#joinScreen").removeClass("active");
        $("#menuScreen").addClass("active");
        document.getElementById("joinScreen").hidden = true;
        document.getElementById("menuScreen").hidden = false;
        sendUserUpdate(usernameInput.value);
        websocketGame.username = usernameInput.value;
        usernameInput.value = "";
    }
}

// ****************************** MainSite-Functions ******************************
// JoinChatButtonHandler
function joinChat(){
    $("#menuScreen").removeClass("active");
    $("#chatScreen").addClass("active");
    sendJoinChatroomMessage(websocketGame.username);
}
// NewGameButtonHandler
function newGame(){
    checkUserIsNotInLobby();
    if (!(websocketGame.inGameLobby)){
        $("#menuScreen").removeClass("active");
        $("#lobbyScreen").addClass("active");
        let newGameName = setRandomGameName();
        let playList = [];
        showAllPlayerInGameLobby(playList, newGameName);
        document.getElementById("gameListDiv").hidden = true;
        websocketGame.inGameLobby = true;
    } else{
        document.getElementById("errorBannerMainDiv").hidden = false;
    }
}

// JoinExistingGameButtonHandler
function joinGame(){
    checkUserIsNotInLobby();
    getAllPossibleToJoinGameLobbies();
    document.getElementById("gameListDiv").hidden = false;
}
// Get all existing GameLobbies
function getAllPossibleToJoinGameLobbies(){
    let data = {};
    data.dataType = websocketGame.GET_ALL_POSSIBLE_GAME_LOBBIES_NAMES;
    data.message = "get all Lobbies";
    websocketGame.socket.send(JSON.stringify(data));
}
// Render all existing GameLobbies
function renderGameLobbies(listOfGameLobbies){
    // clear the existing GameLobbiesList
    document.querySelector(".tableContentMain .gameList").textContent = "";
    let gameListContainer = document.querySelector(".tableContentMain .gameList");

    if (listOfGameLobbies === undefined){
        let txt = "Kein Spiele vorhanden";
        if (websocketGame.language === "Deutsch"){
           txt = "Kein Spiele vorhanden";
        } else if (websocketGame.language === "English"){
            txt = "No Game present";
        }
        let el = document.createElement("div");
        el.setAttribute("class", "gameLobbyname");
        el.innerHTML = `                
                                           <div class="gameLobbyname" id="noGamePresent" >${txt}<div>
                                   `;
        // adds ListElement to GameLobbiesList
        gameListContainer.appendChild(el);
        gameListContainer.scrollTop = gameListContainer.scrollHeight - gameListContainer.clientHeight;
    } else {
        // init Variables
        let existGameLobbyList = [];
        let uniqueGameLobby= [];
        // split the incoming List of GameLobbies
        let gameLobbyList = listOfGameLobbies.split(';');
        // select the GameLobbiesList to add the ListElements
        // extraction the GameLobbiesNames
        gameLobbyList.forEach(gameLobbyName => {
            if (gameLobbyName !== " "){
                if(gameLobbyName !== "undefined" && gameLobbyName !== ""){
                    // alert(gameLobbyName + "|");
                    existGameLobbyList.push(gameLobbyName);
                }
            }
        })
        // delete the Duplicates
        existGameLobbyList.forEach(element => {if(!uniqueGameLobby.includes(element)) {
            uniqueGameLobby.push(element);
        }})
        // create ListElements
        uniqueGameLobby.forEach(gameLobbyName => {
            let el = document.createElement("div");
            el.setAttribute("class", "gameLobbyname");
            el.innerHTML = `                <!-- ListElement with Clicklistener-->
                                           <div class="gameLobbyname" onclick="loadExistingGameLobby(this.innerText)">${gameLobbyName}<div>
                                   `;
            // adds ListElement to GameLobbiesList
            gameListContainer.appendChild(el);
            gameListContainer.scrollTop = gameListContainer.scrollHeight - gameListContainer.clientHeight;
        });
    }
}
// SetupButtonHandler
function setup(){
    $("#menuScreen").removeClass("active");
    $("#setupScreen").addClass("active");
    document.getElementById("currentNameText").textContent = websocketGame.username;
    document.getElementById("gameListDiv").hidden = true;
}
// ExitButtonHandler
function exitButton(){
    document.getElementById("mainSiteConfirmDiv").hidden = false;
}
// ConfirmWindowFunction
function isConfirm(answer) {
    if (answer) {
        document.getElementById("mainSiteConfirmDiv").hidden = true;
        // all var reset
        websocketGame.hasBet = false;
        websocketGame.userId = "";
        websocketGame.inGameLobby = false;
        websocketGame.inGame = false;
        websocketGame.gameId = "";
        websocketGame.myIndex = 0;
        websocketGame.playerCounter = 0;
        websocketGame.handCartList = [];
        websocketGame.hasBet = false;
        websocketGame.hasCardChoice = false;
        websocketGame.turnCounter = 0;
        websocketGame.chosenCardId = "";
        websocketGame.leaveGameConfirmWindow = false;

        $("#menuScreen").removeClass("active");
        $("#joinScreen").addClass("active");
        let data = {};
        data.dataType = websocketGame.USER_DELETE;
        data.message = "delete this user";
        websocketGame.socket.send(JSON.stringify(data));
    } else {
        document.getElementById("mainSiteConfirmDiv").hidden = true;
    }
}


// ****************************** ChatroomSite-Functions ******************************
// Press Enter for confirmation
$("#chatInput").keypress(function (event){
    if(event.keyCode === 13) {
        sendMessage();
    }
});
// SendMessageButtonHandler
function sendMessage() {
    let message = $("#chatInput").val();

    // pack the message into an object.
    let data = {};
    data.dataType = websocketGame.CHAT_MESSAGE;
    data.message = message;
    websocketGame.socket.send(JSON.stringify(data));
    data.sender = "ich";
    renderMessage("my", data);

    $("#chatInput").val("");
}
// RenderChatMessage
function renderMessage(type, data) {
    let messageContainer = document.querySelector(".chatScreen .messages");
    if(type === "my") {
        let el = document.createElement("div");
        el.setAttribute("class", "message my-message");
        el.innerHTML = `
                        <div>
                            <div class="name">${data.sender}</div>
                            <div class="text">${data.message}<div>
                        </div>
                    `;
        messageContainer.appendChild(el);
    }else if(type === "other") {
        let el = document.createElement("div");
        el.setAttribute("class", "message other-message");
        el.innerHTML = `
                        <div>
                            <div class="name">${data.sender}</div>
                            <div class="text">${data.message}<div>
                        </div>
                    `;
        messageContainer.appendChild(el);
    }else if(type ==="update"){
        let el = document.createElement("div");
        el.setAttribute("class", "message update");
        el.innerHTML = `
                        <div>
                            <div class="name">${data.sender}</div>
                            <div class="text">${data.message}<div>
                        </div>
                    `;
        messageContainer.appendChild(el);
    }
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
}

// Send the Username to the Server by JoinChatroom
function sendJoinChatroomMessage(username){
    // pack the message into an object.
    let data = {};
    data.dataType = websocketGame.JOIN_CHATROOM_MESSAGE;
    data.message = username;
    websocketGame.socket.send(JSON.stringify(data));
    document.querySelector(".chatScreen .messages").textContent = "";
}
// incoming Username from the Server by JoinChatroom
function showJoinUserToChatroom(data){
    let joinUserMessages = document.querySelector(".chatScreen .userJoinMessagesDiv");
    // which language is set
    if (websocketGame.language === "Deutsch"){
        data.message = data.message + " ist dem Chat beigetreten.";
    } else if (websocketGame.language === "English"){
        data.message = data.message + " joined the chat.";
    }
    // create the ListElement
    let el = document.createElement("div");
    el.setAttribute("class", "message joinChat");
    el.innerHTML = `
                           <div class="userJoinChatroomText">${data.message}<div>
                    `;
    joinUserMessages.appendChild(el);
    joinUserMessages.scrollTop = joinUserMessages.scrollHeight - joinUserMessages.clientHeight;
}

// BackButtonHandler --> LeftChatroom
function leftChat() {
    $("#chatScreen").removeClass("active");
    $("#menuScreen").addClass("active");
    sendLeftChatroomMessage(websocketGame.username);
}
// Send the Username to the Server by LeftChatroom
function sendLeftChatroomMessage(username){
    // pack the message into an object.
    let data = {};
    data.dataType = websocketGame.LEFT_CHATROOM_MESSAGE;
    data.message = username;
    websocketGame.socket.send(JSON.stringify(data));
    document.querySelector(".chatScreen .userJoinMessagesDiv").textContent = "";
}
// incoming Username from the Server by LeftChatroom
function showLeftUserToChatroom(data){
    let leftUserMessages = document.querySelector(".chatScreen .userJoinMessagesDiv");
    // which language is set
    if (websocketGame.language === "Deutsch"){
        data.message = data.message + " hat den Chat verlassen.";
    } else if (websocketGame.language === "English"){
        data.message = data.message + " left the chat.";
    }
    // create the ListElement
    let el = document.createElement("div");
    el.setAttribute("class", "message joinChat");
    el.innerHTML = `
                            <div class="userLeftChatroomText">${data.message}<div>
                    `;
    leftUserMessages.appendChild(el);
    leftUserMessages.scrollTop = leftUserMessages.scrollHeight - leftUserMessages.clientHeight;
}



// ****************************** Lobby-Functions ******************************
// Create a PlayerList by JoinLobby (for a newGame and for en existing Game)
function showAllPlayerInGameLobby(playerList, newGameName=""){
    if (playerList.length !== 0){
        document.querySelector(".tableContentLobby .playerList").textContent = "";
        let playerListNew = playerList.split(":");
        playerList = [];
        for (let i = 0, len = playerListNew.length; i < len; i++){
            if (playerListNew[i] !== ""){
                playerList[i] = playerListNew[i];
            }
        }
    } else {
        // alert("Neues Game erstellt")
        document.querySelector(".tableContentLobby .playerList").textContent = "";
        playerList[0] = websocketGame.username;
        addUsernameToGameLobby(newGameName);
    }

    let listContainer = document.querySelector(".tableContentLobby .playerList");
    playerList.forEach(playerUserName => {
        let el = document.createElement("div");
        el.setAttribute("class", "playerUsername");
        el.innerHTML = `
                                <div class="playerUsername">${playerUserName}<div>
                        `;
        listContainer.appendChild(el);
        listContainer.scrollTop = listContainer.scrollHeight - listContainer.clientHeight;
    });
}
// Create a Random GameName for a newGame
function setRandomGameName() {
    let gameName = "Game-" + Math.floor((Math.random() + 1) * 100); // Number from 100 to 199.
    document.getElementById("gameName").textContent = gameName;
    storeNewGame(gameName);
    return gameName;
}
// Send the Name from NewGame on the Server
function storeNewGame(gameName) {
    let data = {};
    data.dataType = websocketGame.STORE_NEW_GAME_NAME;
    data.message = gameName;
    websocketGame.socket.send(JSON.stringify(data));
}
// Add User to the GameLobby with Check
function loadExistingGameLobby(gameName){
    addUsernameToGameLobby(gameName);
    getUsernameInGameLobby(gameName);
}
// Add User to the Lobby on Server
function addUsernameToGameLobby(gameName){
    let data = {};
    data.dataType = websocketGame.ADD_USERNAME_TO_GAME_LOBBY_X;
    data.message = gameName;
    websocketGame.socket.send(JSON.stringify(data));
}
// get all LobbyNames from the Server
function getUsernameInGameLobby(gameName){
    let data = {};
    data.dataType = websocketGame.GET_ALL_USERNAMES_IN_LOBBY_X;
    data.message = gameName;
    websocketGame.socket.send(JSON.stringify(data));
}
// Reaction from the Server to joinLobby
function accessToTheLobby(message){
    if (message === "already 6 players in the Lobby"){
        document.getElementById("toManyPlayerBannerMainDiv").hidden = false;
    } else {
        document.getElementById("gameListDiv").hidden = true;
        $("#menuScreen").removeClass("active");
        $("#lobbyScreen").addClass("active");
        document.getElementById("gameName").textContent = message;
    }
}

// User exit a GameLobby
function userExitLobby(){
    let gameLobbyName = document.getElementById("gameName").textContent;
    let data = {};
    data.dataType = websocketGame.EXIT_USER_FROM_THE_GAME_LOBBY;
    data.message = gameLobbyName;
    websocketGame.socket.send(JSON.stringify(data));
    lobbyBackToMenu()
}
// lobbyDeleteButtonHAndler
function userDeleteLobby(){
    let gameLobbyName = document.getElementById("gameName").textContent;
    let data = {};
    data.dataType = websocketGame.DELETE_GAME_LOBBY;
    data.message = gameLobbyName;
    websocketGame.socket.send(JSON.stringify(data));
}
// Reaction from the Server to the lobbyDeleteButtonHAndler
function deletedLobbyMessage(message){
    if (message === "Deleted"){
        lobbyBackToMenu()
    } else {
        document.getElementById("errorBannerDeleteLobbyDiv").hidden = false;
    }
}
// close the ErrorWindow from the LobbyDeleteButton
function errorLobbyWindowClose(){
    document.getElementById("errorBannerDeleteLobbyDiv").hidden = true;
}

// BackButtonHandler
function lobbyBackButton() {
    websocketGame.inGameLobby = true;
    lobbyBackToMenu()
    document.querySelector(".tableContentLobby .playerList").textContent = "";
}
// startGameHandler
function confirmToGameReady(){
    let data = {};
    data.dataType = websocketGame.GAME_READY_STARTER;
    data.message = document.getElementById("gameName").textContent;
    websocketGame.socket.send(JSON.stringify(data));
}
// Reaction if are too few player in the Lobby (gameStart)
function confirmToGameReadyStarted(message){
    if (message === "too few players"){
        document.getElementById("errorBannerStartedLobbyDiv").hidden = false;
    } else {
        document.getElementById("confirmToGameReadyDiv").hidden = false;
    }
}
// ReadyToPlayConfirmButtonHandler (Ready or Not)
function areYouReady(answer){
    let data = {};
    data.dataType = websocketGame.GAME_READY_MESSAGE;
    data.message = document.getElementById("gameName").textContent;

    if(answer){
        data.message += ";Yes"
        websocketGame.socket.send(JSON.stringify(data));

    } else {
        data.message += ";No"
        websocketGame.socket.send(JSON.stringify(data));
    }
    // hide confirmToGameReadyDiv
    document.getElementById("confirmToGameReadyDiv").hidden = true;
    // show confirmGameStartDiv
    document.getElementById("confirmGameStartDiv").style.width = "40%";
    document.getElementById("confirmGameStartDiv").style.border = "3px solid green";
    document.getElementById("confirmGameStartDiv").hidden = false;
    document.getElementById("confirmGameStartText").hidden = false;
}

// Are the Player ready to play or not?
function confirmGameStart(message){

    if (message === "START"){
        websocketGame.gameId = document.getElementById("gameName").textContent;
        $("#lobbyScreen").removeClass("active");
        $("#gameItself").addClass("active");
        getGameDataForInit();
        // hidde confirmGameStartDiv
        document.getElementById("confirmGameStartDiv").hidden = true;
        document.getElementById("confirmGameStartDiv").style.width = "0";
        document.getElementById("confirmGameStartDiv").style.border = "0";
        document.getElementById("confirmGameStartText").hidden = true;


    } else if (message === "Canceled"){
        // hidde confirmGameStartDiv
        document.getElementById("confirmGameStartDiv").hidden = true;
        document.getElementById("confirmGameStartDiv").style.width = "0";
        document.getElementById("confirmGameStartDiv").style.border = "0";
        document.getElementById("confirmGameStartText").hidden = true;
        // show confirmGameStopDiv
        document.getElementById("confirmGameStopDiv").style.width = "40%";
        document.getElementById("confirmGameStopDiv").style.border = "3px solid green";
        document.getElementById("confirmGameStopDiv").hidden = false;
        document.getElementById("gameStartStoppedText").hidden = false;
        document.getElementById("confirmGameStopButton").hidden = false;
        document.getElementById("confirmGameStopButton").style.border = "3px solid green";
    }

}
// confirmButtonHandler
function gameStartWasCanceled(){
    document.getElementById("confirmGameStopDiv").hidden = true;
    document.getElementById("confirmGameStopDiv").style.width = "0";
    document.getElementById("confirmGameStopDiv").style.border = "0";
    document.getElementById("gameStartStoppedText").hidden = true;
    document.getElementById("confirmGameStopButton").hidden = true;
    document.getElementById("confirmGameStopButton").style.border = "0";
}

// show Game-Rules
function showGameRules(){
    document.getElementById("gameRulesDiv").style.display = "grid";
    if (websocketGame.language === "Deutsch") {
       document.getElementById("gameRulesSite_DE").hidden = false;
    } else if (websocketGame.language === "English") {
        document.getElementById("gameRulesSite_EN").hidden = false;
    }
}

// hidde Game-Rules
function closeGameRules(){
    document.getElementById("gameRulesDiv").style.display = "none";
    document.getElementById("gameRulesSite_DE").hidden = true;
    document.getElementById("gameRulesSite_EN").hidden = true;
}

function lobbyBackToMenu(){
    $("#lobbyScreen").removeClass("active");
    $("#menuScreen").addClass("active");
}


// ****************************** Setup-Functions ******************************
// Set a new UserName
function setupNameChange(){
    let newUsernameField = document.getElementById("usernameNew");
    if (checkUsernameInput(newUsernameField)) {
        sendUserUpdate(newUsernameField.value);
        document.getElementById("currentNameText").textContent = newUsernameField.value;
        websocketGame.username = newUsernameField.value;
        newUsernameField.value = "";
    }
}
// Press Enter for confirmation
$("#changeUsername").keypress(function (event){
    if(event.keyCode === 13) {
        setupNameChange();
    }
});
// BackButtonHandler
function setupBackButton() {
    $("#setupScreen").removeClass("active");
    $("#menuScreen").addClass("active");
}



// ************************************************************ Game-Functions ************************************************************
// Get all Data from Game
function getGameDataForInit(){
    document.getElementById("gameItself").style.display = "grid";
    let data = {};
    data.dataType = websocketGame.INITIAL_GAME_DATA;
    data.message = websocketGame.gameId;
    websocketGame.socket.send(JSON.stringify(data));
    closeInfoWindow();
}
// Render the Game-Infos and fill the Data in the Places
function initialGameGUI(message){
    let messageValue = message.split(";");
    let playerUserNames = messageValue[0].split(",");
    let playerUserIds = messageValue[1].split(",");

    for (let i = 0; i < playerUserNames.length; i++) {
        if(playerUserNames[i] === websocketGame.username){
            playerUserNames.splice(i, 1);
            websocketGame.userId = playerUserIds[i];
            websocketGame.myIndex = i;
            playerUserIds.splice(i, 1);
        }
    }
    // User init
    websocketGame.playerCounter = playerUserNames.length;
    // user
    document.getElementById("userPlayerName").textContent = websocketGame.username;
    document.getElementById("totalScoreSoFarFromUser").textContent = "0";
    document.getElementById("currentScoreFromUser").textContent = "(0)";
    document.getElementById("madeBetsUser").textContent = "0";
    document.getElementById("estimatedBetsUser").textContent = "0";

    // Other Player init
    let indexList = [];
    switch (playerUserNames.length){
        case 1:
            indexList = [3];
            break
        case 2:
            indexList = [2, 4];
            break
        case 3:
            indexList = [2, 3, 4];
            break
        case 4:
            indexList = [1, 2, 4, 5];
            break
        case 5:
            indexList = [1, 2, 3, 4, 5];
            break
    }

    for (let i = 1; i < 6; i++) {
        for (let j = 1; j < indexList.length + 1; j++) {
            if (i === indexList[j - 1]) {
                document.getElementById("player" + i.toString()+ "Deck").style.height = "100%";
                document.getElementById("player" + i.toString() + "Deck").style.width = "100%";
                document.getElementById("labelP" + i.toString()).hidden = false;
                document.getElementById("player" + i.toString() + "Name").textContent = playerUserNames[j - 1];
                document.getElementById("player" + i.toString()+ "UserId").textContent = playerUserIds[j - 1];
                document.getElementById("totalScoreSoFarFromPlayer" + i.toString()).textContent = "0";
                document.getElementById("currentScoreFromPlayer" + i.toString()).textContent = "(0)";
                document.getElementById("madeBetsPlayer" + i.toString()).textContent = "0"
                document.getElementById("estimatedBetsPlayer" + i.toString()).textContent = "0";
            }
        }
    }
    // reset of the variable "turnCounter"
    websocketGame.turnCounter = 0;
}

// Get the HandCarts and show them
function showHandCards(cards) {
    websocketGame.handCartList = [];
    let cardCount = cards.length;
    for (let i = 0; i < cardCount; i++) {
        document.getElementById("cardPlace" + (i + 1).toString()).style.backgroundImage = "url(" + cards[i].imagePath + ")";
        document.getElementById("cardPlace" + (i + 1).toString()).style.display = "inherit";
        document.getElementById("cardPlace" + (i + 1).toString()).style.cursor = "pointer";
        websocketGame.handCartList.push(cards[i].imagePath);
    }
    document.getElementById("infoText").textContent = showInfoMessageNewBetRound();
    websocketGame.hasBet = false;

    // set turnCounter at the start Round
    if (websocketGame.playerCounter !== 0){
        websocketGame.turnCounter = (cardCount - 1);
        if (websocketGame.turnCounter > websocketGame.playerCounter){
            websocketGame.turnCounter = websocketGame.turnCounter % (websocketGame.playerCounter + 1) ;
        }
    }
    // update currentRoundText
    document.getElementById("currentRoundText").textContent = cards.length;
}

function hoverAdjustments(card){
    let cardCount = document.getElementById("currentRoundText").textContent;
    let hoverFactor;
    let marginLeftFaktor;
    switch (parseInt(cardCount)){
        case 6:
            hoverFactor = 140;
            marginLeftFaktor = -20;
            break;
        case 7:
            hoverFactor = 164;
            marginLeftFaktor = -32;
            break;
        case 8:
            hoverFactor = 184;
            marginLeftFaktor = -42;
            break;
        case 9:
            hoverFactor = 210;
            marginLeftFaktor = -55;
            break
        case 10:
            hoverFactor = 234;
            marginLeftFaktor = -67;
            break;
        default:
            hoverFactor = 132;
            marginLeftFaktor = -16;
            break;
    }
    if (window.innerWidth < 1400){
        hoverFactor += 60;
        marginLeftFaktor += -30;
    } else if(window.innerWidth < 1400 && hoverFactor >= 140 ){
        hoverFactor += 120;
        marginLeftFaktor += -60;
    } else if (window.innerWidth < 600 && hoverFactor >= 140){
        hoverFactor += 360;
        marginLeftFaktor += -180;
    }
    if (window.innerHeight < 501){
        if (!(websocketGame.hasCardChoice)){
            document.getElementById("userCards").style.backgroundImage = card.style.backgroundImage;
        }
    }
    card.style.zIndex = "10";
    card.style.height = hoverFactor.toString() + "%";
    card.style.width = hoverFactor.toString() + "%";
    card.style.marginLeft = marginLeftFaktor.toString() + "%";
}

function hoverStop(card){
    card.style.zIndex = "5";
    card.style.height = "100%";
    card.style.width = "100%";
    card.style.marginLeft = "0%";
    if(!(websocketGame.hasCardChoice)){
        document.getElementById("userCards").style.backgroundImage = 'url("../image/backCover.png")';
    }
}

// makeABetButtonHandler
function showBetWindow(){
    if (!(websocketGame.leaveGameConfirmWindow)) {

        let betWindowMessage;
        let betButtonText;
        let stopBetButtonText;
        if (websocketGame.language === "Deutsch") {
            betWindowMessage = "Für welche Stichanzahl entscheidest du dich?.";
            betButtonText = "Stichanzahl festlegen?";
            stopBetButtonText = "Zurück";
        } else if (websocketGame.language === "English") {
            betWindowMessage = "What number of stitches do you choose?";
            betButtonText = "Specify number of stitches?";
            stopBetButtonText = "Back";
        }
        let fontSize = 20;
        let heightFaktor = 100;
        if ((!websocketGame.hasBet)) {
            document.getElementById("betCounter").style.width = "25%";
            document.getElementById("infoWindowButton").textContent = betButtonText;
            document.getElementById("infoWindowText").textContent = betWindowMessage;
            document.getElementById("stopBetButton").textContent = stopBetButtonText;
            document.getElementById("stopBetButton").hidden = false;
            openInfoWindows(1)
        }
    }
}
// infoWindowButtonHandler
function infoWindowButtonHandler() {
    let betButtonText;
    let endGameButtonText;
    if (websocketGame.language === "Deutsch") {
        betButtonText = "Stichanzahl festlegen?";
        endGameButtonText = 'Zurück zum Hauptmenü.'
    } else if (websocketGame.language === "English") {
        betButtonText = "Specify number of stitches?";
        endGameButtonText = 'Back to main menu';
    }
    // Hide the betWindow
    if (document.getElementById("infoWindowButton").textContent === betButtonText) {
        let betSelect = document.getElementById("betCounter");
        let betValue = betSelect.value;
        document.getElementById("estimatedBetsUser").textContent = betValue;
        closeInfoWindow()
        websocketGame.hasBet = true;

        let data = {};
        data.dataType = websocketGame.BET_VALUE_SET;
        data.message = betValue + ";" + websocketGame.gameId;
        websocketGame.socket.send(JSON.stringify(data));

        let waitForTheBetsText;
        if (websocketGame.language === "Deutsch") {
            waitForTheBetsText = "Du hast deine Stiche gesetzt. Warte, bis alle Spieler ihre Stiche gesetzt haben.";
        } else if (websocketGame.language === "English") {
            waitForTheBetsText = "You have set your stitch. Wait for all players to take their stitch.";
        }
        document.getElementById("infoText").textContent = waitForTheBetsText;

    } else if (document.getElementById("infoWindowButton").textContent === endGameButtonText) {
        gameQuitHandler(null);
    }
    else {
        let waitForTheContinue;
        if (websocketGame.language === "Deutsch") {
            waitForTheContinue = 'Warte, bis alle Spieler auf "Weiter" geklickt haben.' ;
        } else if (websocketGame.language === "English") {
            waitForTheContinue = 'Wait for all players to click "Continue".';
        }
        document.getElementById("infoText").textContent = waitForTheContinue;

        continuesGameHandler();
    }
}

function closeInfoWindow(status){
    document.getElementById("infoWindow").style.width = "0";
    document.getElementById("infoWindow").style.height = "0";
    document.getElementById("infoWindow").style.border = "0";
    document.getElementById("betCounter").style.width = "0";
    document.getElementById("infoWindowButton").hidden = true;
    document.getElementById("infoWindowText").style.fontSize = "0";
    document.getElementById("stopBetButton").hidden = true;
}
function openInfoWindows(){
    let fontSize = 20;
    let heightFactor;
    if (document.getElementById("betCounter").style.width > "10%"){
        heightFactor = 130;
    } else {
        heightFactor = 100;
    }
    if(window.innerWidth < 600){
        fontSize -= 6;
    }
    if (window.innerHeight < 500) {
        heightFactor += 130;
    }
    if (status == 1){
        $("#infoWindow").show();
        $("#betCounter").show();
        $("#infoWindowButton").show();
        $("#infoWindowText").show();
        $("#stopBetButton").show();
    } else {
        $("#infoWindow").show();
        $("#infoWindowButton").show();
        $("#infoWindowText").show();
    }
}


function renderBetValue(message){
    let messageValue = message.split(";");
    let betValue = messageValue[0];
    let playerUserId = messageValue[1];
    let text = messageValue[2]; //"notAllBet" oder "allBet"

    if (playerUserId !== websocketGame.userId){
        for (let i = 1; i < 6; i++) {
            if (playerUserId === document.getElementById("player" + i.toString() + "UserId").textContent){
                document.getElementById("estimatedBetsPlayer" + i.toString()).textContent = betValue;
                document.getElementById("estimatedBetsPlayer" + i.toString()).style.display = "none"
            }
        }
    }
    // language SelectionHandler
    const listOfTurnText = showTurnMessage();
    if (text === "allBet"){
        for (let i = 1; i < 6; i++) {
            if (document.getElementById("player" + i.toString() + "UserId").textContent !== "") {
                document.getElementById("estimatedBetsPlayer" + i.toString()).style.display = "unset";
            }
        }
        // YourTurnTester
        if (parseInt(websocketGame.myIndex) === parseInt(websocketGame.turnCounter)){
            document.getElementById("infoText").textContent = listOfTurnText[0];
        } else {
            document.getElementById("infoText").textContent = listOfTurnText[1];
        }
    }
}

function cardSelection(id){
    // language SelectionHandler
    const listOfTurnText = showTurnMessage();
    let infoTextElement = document.getElementById("infoText");

    if (infoTextElement.textContent === listOfTurnText[0] && !(websocketGame.hasCardChoice) && !(websocketGame.leaveGameConfirmWindow)){
        if (document.getElementById(id).style.backgroundImage !==  "none"){
            let backgroundImage = document.getElementById(id).style.backgroundImage.split("(");
            let cardImageRaw = backgroundImage[1].split(")")
            let cardImage = cardImageRaw[0];

            // Delete Card from HandCartList
            for (let i = 0; i < websocketGame.handCartList.length; i++) {
                if (websocketGame.handCartList[i] !== undefined) {
                    let cardRaw = websocketGame.handCartList[i].split(".");
                    let cardImageRaw = cardImage.split(".");
                    if (cardRaw[2] === cardImageRaw[2]) {
                        websocketGame.handCartList.splice(i, 1);
                        // reset hasCardChoice-Var
                        websocketGame.hasCardChoice = true;
                        break;
                    }
                }
            }
            // the BackgroundImage is sent to all players via the server.
            let data = {};
            data.dataType = websocketGame.CARD_CHOICE;
            data.message = cardImage + ";" + websocketGame.gameId;
            websocketGame.socket.send(JSON.stringify(data));
            websocketGame.chosenCardId = id;

            infoTextElement.textContent = listOfTurnText[2];
            // Card disappears
            document.getElementById(websocketGame.chosenCardId).style.backgroundImage = "none";
            document.getElementById(websocketGame.chosenCardId).style.cursor = "default";
        }
    }
}

function renderCardChoice(message){
    let messageValue = message.split(";");
    let cardImg = messageValue[0];
    let playerUserId = messageValue[1];
    let text = messageValue[2];

    if (websocketGame.userId !== playerUserId) {
        for (let i = 1; i < 6; i++) {
            if (document.getElementById("player" + i + "UserId").textContent === playerUserId) {
                document.getElementById("player" + i + "Cards").style.backgroundImage = "url(" + cardImg + ")";
            }
        }
    } else {
        document.getElementById("userCards").style.backgroundImage = "url(" + cardImg + ")";
    }

    if (parseInt(websocketGame.turnCounter) < parseInt(websocketGame.playerCounter)){
        websocketGame.turnCounter = parseInt(websocketGame.turnCounter) + 1;
    } else {
        websocketGame.turnCounter = 0;
    }

    // language SelectionHandler
    let listOfTurnText = showTurnMessage();
    if (websocketGame.myIndex === websocketGame.turnCounter && !(websocketGame.hasCardChoice)){
        document.getElementById("infoText").textContent = listOfTurnText[0];
    }

    if (text === "all Player have placed a card."){
        /*document.getElementById(websocketGame.chosenCardId).style.backgroundImage = "none";
        document.getElementById(websocketGame.chosenCardId).style.cursor = "default";*/
    }
}

function renderStichFinder(message){
    let messageValue = message.split(";");
    let ownerId = messageValue[0];
    let points = messageValue[1];
    let indexFromStichWinner = messageValue[2];

    let infoMessageYouStich;
    let infoMessageOtherStich;
    let stichButtonText;
    let infoTextContinue;
    if (websocketGame.language === "Deutsch"){
        infoMessageYouStich = "Gratulation, du hast den Stich gemacht.";
        infoMessageOtherStich = "Der Stich wurde gemacht von ";
        stichButtonText = "Weiter"
        infoTextContinue = 'Klick auf "Weiter" um fortzufahren.'
    } else if (websocketGame.language === "English"){
        infoMessageYouStich = " Congratulations, you took the stitch.";
        infoMessageOtherStich = "The stitch was made by ";
        stichButtonText = "Continue"
        infoTextContinue = 'Click on "Continue" to continue';
    }
    openInfoWindows(2)
    document.getElementById("infoWindowButton").textContent = stichButtonText;
    // infoText update
    document.getElementById("infoText").textContent = infoTextContinue;

    // for the Stich-Winner-Sight
    if (websocketGame.userId === ownerId){
        document.getElementById("infoWindowText").textContent = infoMessageYouStich;
        let oldMadeBetsUser = document.getElementById("madeBetsUser").textContent;
        document.getElementById("madeBetsUser").textContent =  (parseInt(oldMadeBetsUser) + 1).toString();

        if (points !== 0){
            document.getElementById("currentScoreFromUser").textContent = "("  + (points).toString() + ")";
        }

    } else {
        for (let i = 1; i < 6; i++) {
            if (document.getElementById("player" + i + "UserId").textContent === ownerId){
                document.getElementById("infoWindowText").textContent = infoMessageOtherStich + document.getElementById("player" + i + "Name").textContent;
                let oldMadeBetsPlayer = document.getElementById("madeBetsPlayer" + i).textContent;
                document.getElementById("madeBetsPlayer" + i).textContent =  (parseInt(oldMadeBetsPlayer) + 1).toString();

                if (points !== 0){
                    document.getElementById("currentScoreFromPlayer" + i).textContent = "("+ (points).toString() + ")";
                }
            }
        }
    }
    document.getElementById("indexFromStichWinnerLabel").textContent = indexFromStichWinner;
}

function continuesGameHandler(){
    // Hide the infoWindow
    closeInfoWindow();
    // reset the hasCardChoice-Var
    websocketGame.hasCardChoice = false;

    // Reset playedCard and userCards (as a feedback)
    for (let i = 1; i < 6; i++) {
        document.getElementById("player" + i + "Cards").style.backgroundImage = "url(../image/cardImages/backCover.png)";
    }
    document.getElementById("userCards").style.backgroundImage = "url(../image/cardImages/backCover.png)";

    if (websocketGame.handCartList.length !== 0){
        websocketGame.turnCounter = document.getElementById("indexFromStichWinnerLabel").textContent;
    } else {
        showInfoMessageNewBetRound();
    }

    // init the Message to Server
    let data = {};
    data.dataType = websocketGame.CONTINUE_OR_START_NEW_ROUND_MESSAGE;
    data.message = websocketGame.gameId + ";" + websocketGame.handCartList.length;
    websocketGame.socket.send(JSON.stringify(data));
}

function renderContinueRound(){
    const listOfTurnText = showTurnMessage();
    //alert("websocketGame.myIndex === websocketGame.turnCounter = " + (parseInt(websocketGame.myIndex) === parseInt(websocketGame.turnCounter)));
    if (parseInt(websocketGame.myIndex) === parseInt(websocketGame.turnCounter)){
        document.getElementById("infoText").textContent = listOfTurnText[0];

    } else {
        document.getElementById("infoText").textContent = listOfTurnText[1];
    }
}

function renderScoreFromAllUsers(message){
    let messageValue = message.split(",");
    for (let i = 0, j = messageValue.length - 1; i < j; i++) {
        let pointMessage = messageValue[i].split(";");
        if (websocketGame.userId === pointMessage[0]){
            document.getElementById("totalScoreSoFarFromUser").textContent = pointMessage[1];
            // reset from currentScore
            document.getElementById("currentScoreFromUser").textContent = "(0)";
            // reset betScore
            document.getElementById("estimatedBetsUser").textContent = (0).toString();
            document.getElementById("madeBetsUser").textContent = (0).toString();
        } else {
            for (let i = 1; i < 6; i++) {
                if (document.getElementById("player" + i + "UserId").textContent === pointMessage[0]){
                    document.getElementById("totalScoreSoFarFromPlayer"  + i.toString() ).textContent = pointMessage[1];
                    // reset from currentScore
                    document.getElementById("currentScoreFromPlayer" + i.toString()).textContent = "(0)"
                    // reset betScore
                    document.getElementById("estimatedBetsPlayer" + i.toString()).textContent = (0).toString();
                    document.getElementById("madeBetsPlayer" + i.toString()).textContent = (0).toString();
                }
            }
        }
    }
}

function renderEndRoundMessage(message){
    // console.log("message in renderEndRoundMessage() = " + JSON.stringify(message));
    let messageValue = message.split(";");
    let playerId = messageValue[0];
    let currentPoints = messageValue[1];

    if (websocketGame.userId === playerId){
        // update the currentScoreFromUser
        let currentScoreElement = document.getElementById("currentScoreFromUser")
        let oldCurrentPointsRow = currentScoreElement.textContent.split("(");
        let oldCurrentPoints = oldCurrentPointsRow[1].split(")");
        let newCurrentPoints = parseInt(oldCurrentPoints[0]) + parseInt(currentPoints)
        currentScoreElement.textContent = "(" + newCurrentPoints.toString() + ")";
    } else {
        for (let i = 1; i < 6; i++) {
            if (document.getElementById("player" + i.toString() + "UserId").textContent === playerId){
                // update the currentScoreFromPlayerX
                let currentScoreElement = document.getElementById("currentScoreFromPlayer" + i.toString());
                let oldCurrentPointsRow = currentScoreElement.textContent.split("(");
                let oldCurrentPoints = oldCurrentPointsRow[1].split(")");
                let newCurrentPoints = parseInt(oldCurrentPoints[0]) + parseInt(currentPoints)
                currentScoreElement.textContent = "(" + newCurrentPoints.toString() + ")";
                break;
            }
        }
    }
}

function renderWinnerOverAll(winnerId){
    let youAreTheWinnerText;
    let youAreNotTheWinnerText;
    let endGameButtonText;
    if (websocketGame.language === "Deutsch"){
        youAreTheWinnerText = "Herzlichen Glückwunsch. Du hast das Spiel SkullKing gewonnen :)";
        youAreNotTheWinnerText = "Du hast leider das Spiel verloren :(";
        endGameButtonText = 'Zurück zum Hauptmenü.'
    } else if (websocketGame.language === "English"){
        youAreTheWinnerText = "Congratulations. You won the SkullKing game :)";
        youAreNotTheWinnerText = "Unfortunately you lost the game :(";
        endGameButtonText = 'Back to main menu';
    }
    document.getElementById("infoWindow").style.width ="100%";
    document.getElementById("infoWindow").style.height ="80%";
    document.getElementById("infoWindow").style.border ="orange 5px solid";
    document.getElementById("infoWindowButton").textContent = endGameButtonText;

    if (winnerId === websocketGame.userId){
        document.getElementById("infoWindowText").textContent = youAreTheWinnerText;
        document.getElementById("infoText").textContent = youAreTheWinnerText;
    } else {
        document.getElementById("infoWindowText").textContent = youAreNotTheWinnerText;
        document.getElementById("infoText").textContent = youAreNotTheWinnerText;
    }
}


// Infotext for a new BetRound
function showInfoMessageNewBetRound(){
    let startNewRound;
    if (websocketGame.language === "Deutsch"){
        startNewRound = "Schätze die Stiche, die du mit den Handkarten machen kannst.";
    } else if (websocketGame.language === "English"){
        startNewRound = " Estimate the tricks you can take with the cards in your hand.";
    }
    websocketGame.hasBet = false;
    return startNewRound;
}

function showTurnMessage(){
    let yourTurnMessage;
    let notYourTurnMessage;
    let waitForTheOthersMessage;
    if (websocketGame.language === "Deutsch"){
        yourTurnMessage = "Du bist am Zug. Wähle per Klick eine Karte aus, die du ausspielen willst.";
        notYourTurnMessage = "Du bist nicht am Zug. Warte bis du dran bist.";
        waitForTheOthersMessage = "Du hast gelegt. Warte bis alle Spieler eine Karte gelegt haben.";
    } else if (websocketGame.language === "English"){
        yourTurnMessage = " It's your turn. Click on a card you want to play.";
        notYourTurnMessage = "It's not your turn. wait your turn.";
        waitForTheOthersMessage = "You laid Wait until all players have placed a card.";
    }
    let listOfText = []
    listOfText.push(yourTurnMessage);
    listOfText.push(notYourTurnMessage);
    listOfText.push(waitForTheOthersMessage);
    return listOfText;
}

// show hittingOrderWindow
function showTheHittingRank(){
    document.getElementById("hittingOrderDiv").hidden = false;
}
// hidde hittingOrderWindow
function hiddeTheHittingRank(){
    document.getElementById("hittingOrderDiv").hidden = true;
}

// leaveButtonHandler ------------------------
function leaveButtonHandler() {
    let data = {};
    data.dataType = websocketGame.SHOW_THE_QUIT_WINDOW;
    data.message = websocketGame.gameId;
    websocketGame.socket.send(JSON.stringify(data));
}

function openQuitWindow(){
    websocketGame.leaveGameConfirmWindow = true;
    let heightFactor = 140;
    if(window.innerHeight < 501){
        heightFactor += 220;
    }
    document.getElementById("gameQuitWindow").style.height = heightFactor.toString() + "%";
    document.getElementById("gameQuitWindow").style.width = "160%";
    document.getElementById("gameQuitWindow").style.border = "red 3px solid";
    document.getElementById("gameQuitText").hidden = false;
    document.getElementById("gameQuitButtonYes").hidden = false;
    document.getElementById("gameQuitButtonNo").hidden = false;
}

function gameQuitHandler(answer){
    let data = {};
    data.dataType = websocketGame.EXIT_FROM_THE_GAME;
    data.message = websocketGame.gameId + ";";

    if (answer === null){
        data.message += "QuitGame";
        document.getElementById("infoWindowButton").hidden = true;
    } else if (answer){
        data.message += "QuitGame";
        document.getElementById("gameQuitText").hidden = true;
        document.getElementById("waitForTheAnswer").hidden = false;
    } else {
        data.message += "ContinueGame";
        document.getElementById("gameQuitText").hidden = true;
        document.getElementById("continueTheGameTextYou").hidden = false;
    }
    websocketGame.socket.send(JSON.stringify(data));

    document.getElementById("gameQuitButtonYes").hidden = true;
    document.getElementById("gameQuitButtonNo").hidden = true;
}

function renderExitFromGameMessage(message){
    if (message === "All players confirm leaving."){
        leaveGame();
    } else {
        document.getElementById("gameQuitText").hidden = true;
        document.getElementById("gameQuitButtonYes").hidden = true;
        document.getElementById("gameQuitButtonNo").hidden = true;
        document.getElementById("continueTheGameTextYou").hidden = true
        document.getElementById("continueTheGameTextOther").hidden = false;
        document.getElementById("continueTheGameButton").hidden = false;
    }
}

function continueTheGameButtonHandler(){
    websocketGame.leaveGameConfirmWindow = false;
    document.getElementById("gameQuitWindow").style.height = "0";
    document.getElementById("gameQuitWindow").style.width = "0";
    document.getElementById("gameQuitWindow").style.border = "0";
    document.getElementById("continueTheGameTextOther").hidden = true;
    document.getElementById("continueTheGameButton").hidden = true;
    document.getElementById("waitForTheAnswer").hidden = true;
}

function leaveGame(){
    // reset the handCartList-var and hasBet-var
    websocketGame.handCartList = []
    websocketGame.hasBet = false;
    // reset the Players
    for (let i = 1; i < 6; i++) {
                document.getElementById("player" + i.toString()+ "Deck").style.height = "1px";
                document.getElementById("player" + i.toString() + "Deck").style.width = "1px";
                document.getElementById("labelP" + i.toString()).hidden = true;
                document.getElementById("player" + i.toString() + "Name").textContent = "";
                document.getElementById("player" + i.toString()+ "UserId").textContent = "";
                document.getElementById("totalScoreSoFarFromPlayer" + i.toString()).textContent = "";
                document.getElementById("currentScoreFromPlayer" + i.toString()).textContent = "";
                document.getElementById("madeBetsPlayer" + i.toString()).textContent = "";
                document.getElementById("estimatedBetsPlayer" + i.toString()).textContent = "";
    }
    // hidde userDeck
    document.getElementById("userDeck").hidden = true;
    // reset playerCards and userCards
    for (let i = 1; i < 6; i++) {
        document.getElementById("player" + i + "Cards").style.backgroundImage = "url(../image/cardImages/backCover.png)";
    }
    document.getElementById("userCards").style.backgroundImage = "url(../image/cardImages/backCover.png)";
    // reset betWindow (event auslagern wegen Doppelt)
    closeInfoWindow();
    // reset handCards
    for (let i = 0; i < 10; i++) {
        document.getElementById("cardPlace" + (i + 1).toString()).style.backgroundImage = "none";
        document.getElementById("cardPlace" + (i + 1).toString()).style.display = "none";
        document.getElementById("cardPlace" + (i + 1).toString()).style.cursor = "default";
    }
    // reset the quitGameWindow
    continueTheGameButtonHandler();
    // left the game-Screen
    $("#gameItself").removeClass("active");
    $("#menuScreen").addClass("active");
}

// TODO Sprach-übersetzung für Game (Game-Rules)
