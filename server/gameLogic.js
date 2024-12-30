const {CardSet} = require("./cardset");
const {DBConnector} = require("./db");

// Constants
const CHAT_MESSAGE = 1;
const JOIN_CHATROOM_MESSAGE = 2;
const LEFT_CHATROOM_MESSAGE = 3;
const USERNAME_CHANGE_MESSAGE = 4;
const USER_DELETE = 5;
const STORE_NEW_GAME_NAME = 6;
const GET_ALL_POSSIBLE_GAME_LOBBIES_NAMES = 7;
const ADD_USERNAME_TO_GAME_LOBBY_X = 8;
const GET_ALL_USERNAMES_IN_LOBBY_X = 9;
const EXIT_USER_FROM_THE_GAME_LOBBY = 10;
const DELETE_GAME_LOBBY = 11;
const CHECK_USER_IS_NOT_IN_LOBBY = 12;
const GAME_READY_STARTER = 13;
const GAME_READY_MESSAGE = 14;

const INITIAL_GAME_DATA = 15;
const CARDS_ARE_GIVEN = 16;
const BET_VALUE_SET = 17;
const CARD_CHOICE = 18;
const CARD_COMPARE_RESULT = 19;
const CONTINUE_OR_START_NEW_ROUND_MESSAGE = 20;

const SEND_SCORE_PER_ROUND = 21;
const SEND_STICH_MESSAGE = 22;
const SHOW_THE_QUIT_WINDOW = 23;
const EXIT_FROM_THE_GAME = 24;

const OVER_ALL_WINNER = 99;

class User {
    // class variablen
    socket;
    id;
    username;
    inChat;
    inGameLobby;
    readyToGame;
    points;
    cards;
    bet;
    hasBet;
    hasCardChoice;
    stiche;
    pointsDuringRound;

    constructor(socket) {
        this.socket = socket;
        this.id = "0";
        this.username = "Max Mustermann";
        this.inChat = false;
        this.inGameLobby = false;
        this.readyToGame = false;
        this.points = 0;
        this.cards = [];
        this.bet = 0;
        this.hasBet = false;
        this.hasCardChoice = false;
        this.stiche = 0;
        this.pointsDuringRound = 0;
    }

    // setter
    setUsername(username){
        this.username = username;
        if(this.id === "0"){
            this.id = "1" + Math.floor(Math.random() * 1000000000);
        }
        //Update User on Database
        let dbcon = new DBConnector();
        let query = { id: this.id};
        let newvalues = { $set: {username : username, id : this.id}};
        dbcon.update(query, newvalues, "users");
    }

    setBet = function(bet){ this.bet = bet; }
    setPoints = function(points){ this.points += points; }
    addCard = function (card) { this.cards.push(card); }

    // getter
    getInChat(){ return this.inChat; }
    getBet = function(){ return this.bet; }
    playCard = function(card){
        for  (let i = 0; i < this.cards.length -1; i++){
            if (this.cards[i].value === card.value && this.cards[i].type === card.type){
                this.cards.splice(i, 1);
            }
        }
    }
}

class GameLobby{
    playerUserNames;
    playerUserId;
    inGame;
    playerInLobbyCounter;
    gameName;
    playerReadyToGame;

    constructor(gameName) {
        this.playerUserNames = [];
        this.playerUserId = [];
        this.inGame = false;
        this.gameName = gameName;
        this.playerInLobbyCounter = 0;
        this.playerReadyToGame = 0;
    }

    // setter
    addUsernameToLobby(userName){ this.playerUserNames.push(userName); }
    addUserIdToLobby(userId){ this.playerUserId.push(userId); }
    setInGame(state){ this.inGame = state; } // true or false
    setGameName(gameName){ this.gameName = gameName; }

    // remove
    removeUsernameFromLobby(username){
        for (let i = this.playerUserNames.length; i >= 0; i--){
            if (this.playerUserNames[i] === username){
                this.playerUserNames.splice(i, 1);
            }
        }
    }
    removeUserIdFromLobby(userId){
        for (let i = this.playerUserId.length; i >= 0; i--){
            if (this.playerUserId[i] === userId){
                this.playerUserId.splice(i, 1);
            }
        }
    }

    // getter
    getPlayerUserName(){ return this.playerUserNames; }
    getPlayerUserId(){ return this.playerUserId; }
    getInGameStatus(){ return this.inGame; }
    getPlayerInLobbyCounter(){ return this.playerInLobbyCounter; }
    getGameName(){ return this.gameName; }
    getPlayerReadyToGame(){ return this.playerReadyToGame; }
}


class Room{
    // class variable
    users;
    gameLobbies;
    gameList;

    constructor() {
        this.users = [];
        this.gameLobbies = [];
        this.gameList = [];
    }

    // setter
    addUser(user){
        this.users.push(user);
        let room = this;
        // handle user closing
        user.socket.onclose = function (){
            console.log('A connection left.');
            room.removeUser(user);
        };
        this.handleOnUserMessage(user);

        let dbcon = new DBConnector();
        dbcon.insert(user, "users");

    }

    addGameLobby(gameLobby, userId){
        this.gameLobbies.push(gameLobby);
        this.users.forEach(user => {
            if (user.id !== userId) {
                if (!(user.inGameLobby)){
                    this.getAllGameLobbies(user.id);
                }
            }
        });
    }

    addGameToGameList(game){ this.gameList.push(game); }

    // remover
    removeUser(user){
        for (let i = this.users.length; i >= 0; i--){
            if (this.users[i] === user){
                // reset all var
                user.inChat = false;
                user.inGameLobby = false;
                user.readyToGame = false;
                user.points = 0;
                user.cards = [];
                user.bet = 0;
                user.hasBet = false;
                user.hasCardChoice = false;
                user.stiche = 0;
                user.pointsDuringRound = 0;
                // removeUser
                this.users.splice(i, 1);
            }
        }
    }

    removeGameLobby(gameLobby){
        for (let i = this.gameLobbies.length; i >= 0; i--){
            if (this.gameLobbies[i] === gameLobby){
                this.gameLobbies.splice(i, 1);
            }
        }
    }

    removeGameFromGameList(game){
        for (let i = this.gameList.length; i >= 0; i--){
            if (this.gameList[i] === game){
                this.gameList.splice(i, 1);
            }
        }
    }

    // getter
    getUsers(){ return this.users; }

    getASingleUser(userId){
        let userInRoom;
        this.users.forEach(user => {
            if (user.id === userId) {
                userInRoom = user;
            }
        });
        return userInRoom;
    }

    getGameLobbies(){ return this.gameLobbies; }

    trimTheGameLobbyName(gameName){
        let gameNameCharList = gameName.split("");
        let gameNameNew = "";
        // to delete the \n from the data.message
        for (let i = 0, wordLength = 8; i < wordLength; i++){
            gameNameNew += gameNameCharList[i];
        }
        return gameNameNew;
    }

    handleOnUserMessage(user){
        let room = this;
        user.socket.on("message", function (message){
            console.log("Receive message from " + user.id + ": " + message);
            // construct the message
            let data = JSON.parse(message);

            if(data.dataType === CHAT_MESSAGE) {
                // add the sender information into the message data object.
                data.sender = user.username;

                // send to all clients in room.
                room.sendAll(JSON.stringify(data), user.id);

            } else if (data.dataType === JOIN_CHATROOM_MESSAGE){
                data.sender = user.username;
                // set inChat to true
                user.inChat = true;
                // send to all clients in room.
                room.sendAll(JSON.stringify(data), user.id);
            }
            else if (data.dataType === LEFT_CHATROOM_MESSAGE){
                data.sender = user.username;
                // set inChat to false
                user.inChat = false;
                // send to all clients in room.
                room.sendAll(JSON.stringify(data), user.id);
            }
            else if (data.dataType === USERNAME_CHANGE_MESSAGE){
                user.setUsername(data.message);
            }
            else if (data.dataType === USER_DELETE) {
                room.removeUser(user);
            }
            else if (data.dataType === STORE_NEW_GAME_NAME) {
                let newGameLobby = new GameLobby(data.message);
                newGameLobby.users += user;
                room.addGameLobby(newGameLobby, user.id);
            }
            else if(data.dataType === GET_ALL_POSSIBLE_GAME_LOBBIES_NAMES) {
                room.getAllGameLobbies(user.id);
            }
            else if (data.dataType === ADD_USERNAME_TO_GAME_LOBBY_X){
                room.addUserToGameLobby(data.message, user.id);
            }
            else if (data.dataType === GET_ALL_USERNAMES_IN_LOBBY_X) {
                room.getAllUsernamesInGameLobby(data.message, user.id)
            }
            else if (data.dataType === EXIT_USER_FROM_THE_GAME_LOBBY) {
                room.exitUserFromGameLobby(data.message, user.id);
            }
            else if (data.dataType === DELETE_GAME_LOBBY) {
                room.deleteGameLobby(data.message, user.id);
            }
            else if (data.dataType === CHECK_USER_IS_NOT_IN_LOBBY) {
                room.checkUserIsNotInLobby(user.id);
            }
            else  if (data.dataType === GAME_READY_STARTER){
                room.sendConfirmGameStart(data.message);
            }
            else if (data.dataType === GAME_READY_MESSAGE) {
                room.userIsReadyToGame(data.message, user.id)
            }
            else if (data.dataType === INITIAL_GAME_DATA){
                room.sendAllInitialGameData(data.message, user.id);
            }
            else if (data.dataType === BET_VALUE_SET){
                room.betValueSaveInGame(data.message, user.id);
            }
            else if (data.dataType === CARD_CHOICE){
                room.setCardAndSendToAllPlayers(data.message, user.id)
            }
            else if (data.dataType === CONTINUE_OR_START_NEW_ROUND_MESSAGE){
                room.newRoundHandler(data.message, user.id);
            }
            else if (data.dataType === SHOW_THE_QUIT_WINDOW){
                room.showToAllPlayerTheQuitWindow(data.message);
            }
            else if (data.dataType === EXIT_FROM_THE_GAME){
                room.exitFromTheGameHandler(data.message, user.id);
            }
        });
    }

    sendAll(message, senderId){
        for (let i = 0, length = this.users.length; i < length; i++){
            // Kontrolle, welche User sind aktiv.
            if (this.users[i].id !== senderId && this.users[i].getInChat()) {
                this.users[i].socket.send(message);
            }
        }
    }

    getAllGameLobbies(userId){
        const userToSend = this.getASingleUser(userId);
        let gameLobbyList = [];
        let data = {};
        data.dataType = GET_ALL_POSSIBLE_GAME_LOBBIES_NAMES;
        // searching for all gameLobbyNames.
        for (let i = 0, length = this.gameLobbies.length; i < length; i++) {
            if (this.gameLobbies[i].gameName !== "Muster-game" && this.gameLobbies[i].gameName !== "undefined"
                && this.gameLobbies[i].gameName !== undefined) {
                data.message += ";" + this.gameLobbies[i].gameName + ";";
                gameLobbyList.push(this.gameLobbies[i]);
            }
        }

        // if the user is already in a GameLobby
        if (userToSend.inGameLobby) {
            gameLobbyList.forEach(gameLobby => {
                for (let i = 0, length = gameLobby.playerInLobbyCounter; i < length; i++) {
                    if (gameLobby.playerUserId[i] === userToSend.id) {
                        data.message = gameLobby.gameName + ";";
                    }
                }
            });
        }
        // send the List of gameLobbyNames back.
        userToSend.socket.send(JSON.stringify(data));
    }

    addUserToGameLobby(gameName, userId){
        const userToAdd = this.getASingleUser(userId);
        const gameNameNew = this.trimTheGameLobbyName(gameName);

        let data = {};
        data.dataType = ADD_USERNAME_TO_GAME_LOBBY_X;
        this.gameLobbies.forEach(gameLobby => {
            if(gameLobby.gameName === gameNameNew){
                for (let i = 0, j = 7; i < j ; i++){
                    if (gameLobby.playerInLobbyCounter === 6){
                        data.message = "already 6 players in the Lobby";
                        break;
                    } else if (gameLobby.playerUserId[i] === userToAdd.id){
                        // Player is already in the Lobby
                        data.message = gameNameNew;
                    } else if (userToAdd.inGameLobby === false && gameLobby.playerInLobbyCounter < 6){
                        gameLobby.playerUserNames[gameLobby.playerInLobbyCounter] = userToAdd.username;
                        gameLobby.playerUserId[gameLobby.playerInLobbyCounter] = userToAdd.id;
                        gameLobby.playerInLobbyCounter++;
                        userToAdd.inGameLobby = true;
                        data.message = gameNameNew;
                        break;
                    }
                }
            }
        });
        userToAdd.socket.send(JSON.stringify(data));
    }

    getAllUsernamesInGameLobby(gameName, userId){
        const gameNameNew = this.trimTheGameLobbyName(gameName);
        let usernameList = [];
        let userIdList = [];

        // List from all users in a GameLobby
        this.gameLobbies.forEach(gameLobby => {
            if(gameLobby.gameName === gameNameNew){
                for (let i = 0, j = gameLobby.playerUserNames.length; i < j ; i++){
                    usernameList += gameLobby.playerUserNames[i] + ":";
                    userIdList.push(gameLobby.playerUserId[i])
                }
            }

        });
        // send the usernameList back
        let data = {};
        data.dataType = GET_ALL_USERNAMES_IN_LOBBY_X;
        data.message = usernameList;
        this.sendToOneUser(userId, data, userIdList);
    }

    exitUserFromGameLobby(gameName, userId){
        const exitUser = this.getASingleUser(userId);
        const gameNameNew = this.trimTheGameLobbyName(gameName);
        let usernameList = [];
        let userIdList = [];
        let counter = 0;

        this.gameLobbies.forEach(gameLobby => {
            if(gameLobby.gameName === gameNameNew) {
                // If only one Player left --> the GameLobby will be deleted.
                if (gameLobby.playerInLobbyCounter === 1) {
                    this.deleteGameLobby(gameName, userId);
                } else {
                    for (let i = 0, j = gameLobby.playerInLobbyCounter; i < j; i++) {
                        if (gameLobby.playerUserId[i] !== exitUser.id) {
                            gameLobby.playerUserNames[counter] = gameLobby.playerUserNames[i];
                            gameLobby.playerUserId[counter] = gameLobby.playerUserId[i];
                            counter++;
                            usernameList += gameLobby.playerUserNames[i] + ":";
                            userIdList.push(gameLobby.playerUserId[i]);
                        } else {
                            exitUser.inGameLobby = false;
                        }
                    }
                    gameLobby.playerInLobbyCounter = counter;
                    let data = {};
                    data.dataType = GET_ALL_USERNAMES_IN_LOBBY_X;
                    data.message = usernameList;
                    this.sendToOneUser(userId, data, userIdList);
                }
            }
        });
    }

    deleteGameLobby(gameName, userId){
        const deleteLobbyUser = this.getASingleUser(userId);
        const gameNameNew = this.trimTheGameLobbyName(gameName);
        let data = {};
        data.dataType = DELETE_GAME_LOBBY;
        this.gameLobbies.forEach(gameLobby => {
            if (gameLobby.gameName === gameNameNew) {
                if (gameLobby.playerInLobbyCounter !== 1) {
                    data.message = "Error";
                } else {
                    deleteLobbyUser.inGameLobby = false;
                    gameLobby.gameName = "Muster-game";
                    data.message = "Deleted";
                }
            }
        });
        deleteLobbyUser.socket.send(JSON.stringify(data));
        this.users.forEach(user => {
            if (user.id !== userId) {
                if (!(user.inGameLobby)){
                    this.getAllGameLobbies(user.id);
                }
            }
        });
    }

    checkUserIsNotInLobby(userId){
        let data = {};
        data.dataType = CHECK_USER_IS_NOT_IN_LOBBY;
        this.users.forEach(user => {
            // true if user is in a GameLobby
            if (user.id === userId) {
                data.message = !!user.inGameLobby;
            }
            user.socket.send(JSON.stringify(data));
        });
    }


    sendConfirmGameStart(gameName){
        const gameNameNew = this.trimTheGameLobbyName(gameName);
        let data = {};
        data.dataType = GAME_READY_STARTER;
        this.gameLobbies.forEach(gameLobby => {
            if(gameLobby.gameName === gameNameNew) {
                if (gameLobby.playerInLobbyCounter < 2){
                    data.message = "too few players";
                } else {
                    data.message = "get Ready";
                }
                // Message on all Player in Lobby
                this.users.forEach(user => {
                    for (let i = 0, j = gameLobby.playerInLobbyCounter; i < j; i++) {
                        if (user.id === gameLobby.playerUserId[i]) {
                            user.socket.send(JSON.stringify(data));
                        }
                    }
                });
            }
        });
    }

    userIsReadyToGame(dataMessage, userId){
        let message = dataMessage.split(";");
        const gameNameNew = this.trimTheGameLobbyName(message[0]);
        const userIsReady = this.getASingleUser(userId);
        let data = {};
        data.dataType = GAME_READY_MESSAGE;

        this.gameLobbies.forEach(gameLobby => {
            if(gameLobby.gameName === gameNameNew) {
                if (message[1] === "Yes"){
                    userIsReady.readyToGame = true;
                    gameLobby.playerReadyToGame += 1;
                    if (gameLobby.playerReadyToGame === gameLobby.playerInLobbyCounter){
                        data.message = "START";
                        gameLobby.inGame = true;
                        let userList = [];
                        this.users.forEach(user => {
                            for (let i = 0, j = gameLobby.playerInLobbyCounter; i < j; i++) {
                                if (user.id === gameLobby.playerUserId[i]) {
                                   userList.push(user);
                                }
                            }
                        });
                        // Game wird erstellt.
                        let game =  new Game(gameLobby.gameName, gameLobby.playerUserNames,
                            gameLobby.playerUserId, userList);
                        this.addGameToGameList(game)
                    }
                } else {
                    data.message = "Canceled";
                    gameLobby.playerReadyToGame = 0;
                }
                // Message on all Player in Lobby
                this.users.forEach(user => {
                    for (let i = 0, j = gameLobby.playerInLobbyCounter; i < j; i++) {
                        if (user.id === gameLobby.playerUserId[i]) {
                            if (data.message === "Canceled"){
                                user.readyToGame = false;
                            }
                            user.socket.send(JSON.stringify(data));
                        }
                    }
                });
            }
        });
    }

    sendToOneUser(userId, data, userIdList){
        this.users.forEach(user => {
            userIdList.forEach(userID => {
                if (user.id === userID) {
                    user.socket.send(JSON.stringify(data));
                }
            });
        });
    }

    sendAllInitialGameData(gameId, userId){
        let data = {}
        let user = this.getASingleUser(userId);
        data.dataType = INITIAL_GAME_DATA;
        this.gameList.forEach(game =>{
            if (game.gameId === gameId){
                data.message = game.playerUserNames + ";" + game.playerUserId;
            }
        });
        user.socket.send(JSON.stringify(data));
    }

    betValueSaveInGame(message, userId){
        let userBet = this.getASingleUser(userId);
        let messageValue = message.split(";");
        let betValue = messageValue[0];
        // setBet to the User
        userBet.setBet(betValue);
        userBet.hasBet = true;

        let gameId = messageValue[1];
        let data = {};
        data.dataType = BET_VALUE_SET;
        data.message = betValue + ";" + userId + ";";

        this.gameList.forEach(game =>{
            if (game.gameId === gameId){
                game.playerHasBet += 1;
                if (game.playerHasBet === game.playerUserId.length){
                    data.message += "allBet";
                    game.playerHasBet = 0;
                } else {
                    data.message += "notAllBet";
                }
                game.playerUserId.forEach(playerId => {
                    this.getASingleUser(playerId).socket.send(JSON.stringify(data));
                });
            }
        });
    }

    setCardAndSendToAllPlayers(message, userId){
        let messageValue = message.split(";");
        let cardImgRaw = messageValue[0].split('"');
        let cardImg = cardImgRaw[1];
        let gameId = messageValue[1];
        let data = {};
        data.dataType = CARD_CHOICE;
        data.message = cardImg + ";" + userId + ";";
        let cardOwner = this.getASingleUser(userId);
        this.gameList.forEach(game => {
            if (game.gameId === gameId) {
                // Set the cardOwner to the player, that laid the card
                for (let i = 0, j = game.playedCards.length; i < j; i++){
                    if (game.playedCards.imagePath === cardImg) {
                        game.playedCards[i].owner = userId;
                    }
                }

                game.cardSet.cards.forEach(card =>{
                    if (card.imagePath === cardImg){
                        game.playedCards.push(card)
                        for (let i = 0, j = cardOwner.cards.length; i < j; i++){
                            if (card === cardOwner.cards[i]){
                                cardOwner.cards.splice(i, 1);
                                cardOwner.hasCardChoice = true;
                            }
                        }
                    }
                });

                if (game.playedCards.length !== game.playerUserId.length){
                    data.message += "wait for the other players.";
                } else {
                    data.message += "all Player have placed a card.";
                    game.findStich();
                }
                game.playerUserId.forEach(playerId => {
                    this.getASingleUser(playerId).socket.send(JSON.stringify(data));
                });
            }
        });
        console.log("cardOwner.cards = " + JSON.stringify(cardOwner.cards));
    }

    newRoundHandler(message, userId){
        let messageValue = message.split(";");
        let gameId = messageValue[0];
        let handCardLength = messageValue[1];

        // parallelisieren
        this.gameList.forEach(game => {
            if (game.gameId === gameId) {
                game.playerList.forEach(player => {
                    if (player.id === userId) {
                        game.listOfContinueClickedPlayer.push(player.id);
                    }
                });
                if (game.listOfContinueClickedPlayer.length === game.playerUserId.length){
                    if (parseInt(handCardLength) !== 0){
                        // Continue thee Round
                        let data = {};
                        data.dataType = CONTINUE_OR_START_NEW_ROUND_MESSAGE;
                        game.messageToAllPlayer(data);
                    } else {
                        // Start A new Round
                        game.endRound();
                    }
                    // reset listOfContinueClickedPlayer
                    game.listOfContinueClickedPlayer = [];
                }
            }
        });
    }

    showToAllPlayerTheQuitWindow(gameId){
        let data = {};
        data.dataType = SHOW_THE_QUIT_WINDOW;
        data.message = "show the QuitGameWindow";
        this.gameList.forEach(game => {
            if (game.gameId === gameId) {
                game.messageToAllPlayer(data);
            }
        });
    }

    exitFromTheGameHandler(message, userId){
        let messageValue = message.split(";");
        let gameId = messageValue[0];
        let answer = messageValue[1]; // QuitGame or ContinueGame

        console.log("answer answer answer answer = " + answer)

        let data = {};
        data.dataType = EXIT_FROM_THE_GAME;

        this.gameList.forEach(game => {
            if (game.gameId === gameId) {
                game.playerList.forEach(player => {
                    if (player.id === userId) {
                        if (answer === "QuitGame"){
                            game.listOfQuitGamePlayer.push(userId);
                        } else {
                            data.message = "one player wants to continue the Game"
                            game.messageToAllPlayer(data);
                            game.listOfQuitGamePlayer = [];
                        }
                    }
                });
                if (game.listOfQuitGamePlayer.length === game.playerUserId.length){
                    data.message = "All players confirm leaving."
                    game.messageToAllPlayer(data);
                    // delete the GameLobby
                    this.gameLobbies.forEach(lobby => {
                        if (lobby.gameName === game.gameId){
                            lobby.gameName = "Muster-game"
                        }
                    });
                    // reset all lobby- and game-status
                    game.playerList.forEach(player => {
                        player.inGameLobby = false;
                        player.readyToGame = false;
                        player.points = 0;
                        player.cards = [];
                        player.bet = 0;
                        player.hasBet = false;
                        player.hasCardChoice = false;
                        player.stiche = 0;
                        player.pointsDuringRound = 0;
                    });
                    // delete the Game
                    game.gameId = null;
                }
            }
        });
    }

}


class Game {
    gameId;
    playerUserId;
    playerUserNames;
    playerList;
    round;
    cardSet;
    winner;
    winningCard;
    playedCards;
    playerHasBet;
    listOfContinueClickedPlayer;
    listOfQuitGamePlayer;

    constructor (gameLobbyName, playerUserNames, playerUserId, userList){
        this.gameId = gameLobbyName;
        this.playerUserId = playerUserId;
        this.playerUserNames = playerUserNames;
        this.playerList = userList;
        this.round = 1;
        this.cardSet = new CardSet();
        this.playerHasBet = 0;

        this.dealCards()
        this.winner = null;
        this.winningCard = null;
        this.playedCards = [];
        this.listOfContinueClickedPlayer = [];
        this.listOfQuitGamePlayer = [];

        let dbcon = new DBConnector();
        dbcon.insert(this, "games");

    }

    dealCards(){
        console.log('Start Deal Cards');
        let data = {};
        data.dataType = CARDS_ARE_GIVEN;
        for (let i = 0; i < this.playerUserId.length; i++) {
            for (let r = 1; r <= this.round; r++){
                this.playerList[i].addCard(this.cardSet.getRandomCard(this.playerUserId[i]));
            }
            data.message = this.playerList[i].cards;
            this.playerList[i].socket.send(JSON.stringify(data));
        }
    }

    startNewRound(){
        this.round++;
        this.cardSet.resetDeck();
        this.dealCards();
    }

    endRound(){
        console.log('***** Start endRound *****');

        let data = {};
        data.dataType = SEND_SCORE_PER_ROUND;
        data.message = [];
        for (let i = 0; i < this.playerList.length; i++){
            if (parseInt(this.playerList[i].bet) === 0 && this.playerList[i].stiche === 0){
                this.playerList[i].points += (this.round * 10);
                console.log("IF (Nullrunde) player = " + this.playerUserNames[i] + " mit den Points " + this.playerList[i].points + " bei geschätzten " + this.playerList[i].bet + " und effektiven " + this.playerList[i].stiche + " Stichen ");
            }
            else  if (parseInt(this.playerList[i].bet) === 0 && this.playerList[i].stiche > 0) {
                this.playerList[i].points += (this.round * -10);
            }
            else if (parseInt(this.playerList[i].bet) < this.playerList[i].stiche || parseInt(this.playerList[i].bet) > this.playerList[i].stiche ){
                this.playerList[i].points += Math.abs(this.playerList[i].stiche - parseInt(this.playerList[i].bet)) * (-10);
                console.log("IF (zu viele oder zu wenige Stiche) player = " + this.playerUserNames[i] + " mit den Points " + this.playerList[i].points + " bei geschätzten " + this.playerList[i].bet + " und effektiven " + this.playerList[i].stiche + " Stichen ");
            }
            else {
                this.playerList[i].points += this.playerList[i].pointsDuringRound;
                console.log("ELSE (die richtige Anzahl erraten) player = " + this.playerUserNames[i] + " mit den Points "  + this.playerList[i].points  + " bei geschätzten " + this.playerList[i].bet + " und effektiven " + this.playerList[i].stiche + " Stichen " );
            }

            data.message += (this.playerUserId[i] + ";" + this.playerList[i].points + ",").toString();
            console.log("JSON.stringify(data)" + JSON.stringify(data));
            //Werte resetten
            this.playerList[i].bet = 0;
            this.playerList[i].hasBet = false;

            this.playerList[i].pointsDuringRound = 0;
            this.playerList[i].stiche = 0;
        }

        // Send the Score from all at all
        this.messageToAllPlayer(data);
        if (this.round < 10){
            this.startNewRound();
        } else {
            this.getOverallWinner();
        }

        //Update Game on Database
        let dbcon = new DBConnector();
        let query = { gameId: this.gameId};
        let newvalues = { $set: this};
        dbcon.update(query, newvalues, "games");


    }

    findStich() {
        console.log('***** Start Find Stich *****');
        let points = 0;
        let data = {};
        data.dataType = CARD_COMPARE_RESULT;

        let foundSkullKing = false;
        let indexSkullKing = 0;
        let foundMermaid = false;
        let foundPirate = false;
        let foundBlack = false;
        let highestValue = 0;
        let indexHighestNbr = -1;
        let firstColor = "";

        for (let i = 0; i < this.playedCards.length; i++){
            if (this.playedCards[i].type === "skullKing") {
                indexSkullKing = i;
                foundSkullKing = true;
                break;
            }
        }

        // SkullKing was played
        if (foundSkullKing) {
            let nbrOfPirates = 0;
            for (let i = 0; i < this.playedCards.length; i++){
                if (this.playedCards[i].type === "mermaid") {
                    points = 50;
                    data.message = this.playedCards[i].owner + ";" + points + ";";
                    this.addStichToPlayer(this.playedCards[i].owner, points);
                    foundMermaid = true;
                    break;
                } else if (this.playedCards[i].type === "pirate") {
                    nbrOfPirates++;
                }
            }
            if (!foundMermaid) {
                points = 50 + nbrOfPirates * 30;
                data.message = this.playedCards[indexSkullKing].owner + ";" + points + ";";
                this.addStichToPlayer(this.playedCards[indexSkullKing].owner, points);
            }
        }
        // No SkullKing
        else {
            for (let i = 0; i < this.playedCards.length; i++){
                console.log("***** current playedCard = " + JSON.stringify(this.playedCards[i]));

                if (this.playedCards[i].type === "pirate" && this.playedCards[i].value > highestValue) {
                    highestValue = this.playedCards[i].value + 1;
                    indexHighestNbr = i;
                    foundPirate = true;
                    //break;
                }
                // No Pirate
                else if (this.playedCards[i].type === "mermaid" && this.playedCards[i].value > highestValue && !(foundPirate)) {
                    highestValue = this.playedCards[i].value;
                    foundMermaid = true;
                    indexHighestNbr = i;
                    //break;
                }
                // No Mermaid
                else if (this.playedCards[i].type === "black" && (this.playedCards[i].value) > highestValue  && !(foundPirate)  && !(foundMermaid)) {
                    highestValue = this.playedCards[i].value;
                    foundBlack = true;
                    indexHighestNbr = i;
                }
                // No Black
                else if (!(foundPirate)  && !(foundMermaid) && !(foundBlack)){
                    if (firstColor !== "" && firstColor === this.playedCards[i].type && this.playedCards[i].value > highestValue) {
                        highestValue = this.playedCards[i].value;
                        indexHighestNbr = i;
                    } else if ((firstColor === "" || firstColor === "white") && this.playedCards[i].type !== "white") {
                        firstColor = this.playedCards[i].type;
                        highestValue = this.playedCards[i].value;
                        indexHighestNbr = i;
                    }
                    // Just white
                    else if (firstColor === "" && this.playedCards[i].value > highestValue) {
                        // die Karte ist weiss
                        firstColor = this.playedCards[i].type;
                        highestValue = this.playedCards[i].value;
                        indexHighestNbr = i;
                    }
                }
            }
            data.message = this.playedCards[indexHighestNbr].owner + ";" + points + ";";
            this.addStichToPlayer(this.playedCards[indexHighestNbr].owner, points);
        }
        for (let i = 0; i < this.playerUserId.length; i++) {
            if (this.playedCards[indexHighestNbr].owner === this.playerList[i].id){
                data.message += i.toString();
            }
            this.playerList[i].hasCardChoice = false;
        }
        this.messageToAllPlayer(data);
        // Reset the playedCards
        this.playedCards = [];
    }

    addStichToPlayer(playerId, points){
        console.log("***** addStichToPlayer() *****");
        let data = {};
        data.dataType = SEND_STICH_MESSAGE;
        for (let i = 0; i < this.playerUserId.length; i++){
            if (this.playerUserId[i] === playerId){
                this.playerList[i].stiche++;
                if (this.playerList[i].stiche <= this.playerList[i].bet){
                    this.playerList[i].pointsDuringRound += 20 + points;
                } else {
                    this.playerList[i].pointsDuringRound = Math.abs(this.playerList[i].stiche - this.playerList[i].bet) * (-10);
                }
                data.message = playerId + ";" + this.playerList[i].pointsDuringRound + ";" + i + ";" + this.playerUserNames[i];

                console.log("player: " + this.playerUserNames[i] + " with this.playerList[i].pointsDuringRound = " + this.playerList[i].pointsDuringRound);

                // send a Message to all Player
                console.log("STICH_MESSAGE SEND NOW..................")
                this.messageToAllPlayer(data);
            }
        }
    }

    getOverallWinner(){
        let maxPoints=0;
        let maxIndex=-1;
        for (let i = 0; i < this.playerList.length; i++){
            if (this.playerList[i].points > maxPoints){
                maxPoints = this.playerList[i].points;
                maxIndex = i;
            }
        }

        let data = {};
        data.dataType = OVER_ALL_WINNER;
        data.message = this.playerUserId[maxIndex];
        console.log("getOverallWinner() = " + JSON.stringify(data));
        this.messageToAllPlayer(data);
        let dbcon = new DBConnector();
        let winner = {};
        winner.usernameid = this.playerUserId[maxIndex];
        winner.username = this.playerUserNames[maxIndex];
        winner.points = maxPoints;
        dbcon.insert(winner, "winners");
    }

    messageToAllPlayer(data){
        for (let i = 0; i < this.playerUserId.length; i++) {
            this.playerList[i].socket.send(JSON.stringify(data));
        }

    }
}

module.exports.User = User;
module.exports.Room = Room;