// WelcomeSite
const welcomeTitle = document.getElementById('welcomeTitle');
const whatsYourName = document.getElementById('whatsYourName');
const buttonJoin = document.getElementById('joinUser');

// languageLabels
const welcomeLanguageLabel = document.getElementById("welcomeLanguagesLabel");
const mainLanguageLabel = document.getElementById("mainLanguagesLabel");
const lobbyLanguageLabel = document.getElementById("lobbyLanguagesLabel");
const setupLanguageLabel = document.getElementById("setupLanguagesLabel");
const gameLanguagesLabel = document.getElementById("gameLanguagesLabel");

// MainScreen
const mainTitleTxt = document.getElementById('mainTitle');
const startNewGameButton = document.getElementById('newGame');
const joinChatroomButton = document.getElementById('openChat');
const joinGameButton = document.getElementById('joinGame');
const mainSetupButton = document.getElementById('mainSetup');
const gameListInMainText = document.getElementById("gameListInMain");
const errorBannerMainText = document.getElementById("errorBannerMainText");
const errorConfirmMainText = document.getElementById("errorConfirmMain");
const toManyPlayerBannerMainText = document.getElementById("toManyPlayerBannerMainText");
const failConfirmMainButton = document.getElementById("failConfirmMain");

// ExitConfirmWindow
const exitConfirmText = document.getElementById('exitConfirmation');
const exitConfirmYesButton = document.getElementById('exitConfirmYesButton');
const exitConfirmNoButton = document.getElementById('exitConfirmNoButton');
const backChatText = document.getElementById("backChat");
const buttonSend = document.getElementById('chatSend');

// LobbyScreen
const lobbyTitleTxt = document.getElementById('lobbyTitle');
const playerListInLobbyText = document.getElementById("playerListInLobby");
const barrelGameRules = document.getElementById('barrelGameRules');
const exitLobbyButton = document.getElementById('exitLobby');
const deleteLobbyButton = document.getElementById('deleteLobby');
const startGameButton = document.getElementById('startGame');
const backLobbyText = document.getElementById("backLobby");
const errorBannerLobbyText = document.getElementById("errorBannerDeleteLobbyText");
const errorConfirmLobbyText = document.getElementById("errorConfirmDeleteLobby");
const errorBannerStartedLobbyText = document.getElementById("errorBannerStartedLobbyText");
const confirmToGameReadyText = document.getElementById("confirmToGameReadyText");
const readyToGameButtonYes = document.getElementById("readyToGameButtonYes");
const readyToGameButtonNo = document.getElementById("readyToGameButtonNo");
const confirmGameStartText = document.getElementById("confirmGameStartText");
const gameStartStoppedText = document.getElementById("gameStartStoppedText");
const confirmGameStopButton = document.getElementById("confirmGameStopButton");

// SetupScreen
const setupTitleTxt = document.getElementById("setupTitle");
const currentNameLabelTxt = document.getElementById("currentNameLabel");
const whatsYourNewNameTxt = document.getElementById("whatsYourNewName");
const changeUsernameTxt = document.getElementById("changeUsername");
const backSetupText = document.getElementById("backSetup");

// GameScreen
const leaveLabelText = document.getElementById("leaveLabel");
const userNameField = document.getElementById("userNameField");
const totalScoreSoFarField = document.getElementById("totalScoreSoFarField");
const currentScoreField = document.getElementById("currentScoreField");
const betScoreFieldStitches = document.getElementById("betScoreFieldStitches");
const betScoreFieldExplain = document.getElementById("betScoreFieldExplain");
const userCardsLabel = document.getElementById("userCardsLabel");
const makeABetButton = document.getElementById("makeABetButton");
const hittingOrderButton = document.getElementById("hittingOrderButton");
const currentRoundLabel = document.getElementById("currentRoundLabel");
const gameQuitText = document.getElementById("gameQuitText");
const waitForTheAnswer = document.getElementById("waitForTheAnswer");
const continueTheGameTextYou = document.getElementById("continueTheGameTextYou");
const continueTheGameTextOther = document.getElementById("continueTheGameTextOther");
const gameQuitButtonYes = document.getElementById("gameQuitButtonYes");
const gameQuitButtonNo = document.getElementById("gameQuitButtonNo");
const continueTheGameButton = document.getElementById("continueTheGameButton");

let dataEnglish = {};
dataEnglish["welcomeTitleTxt"] = "Welcome to Skull King";
dataEnglish["whatsYourNameTxt"] = "How would you like to be called?";
dataEnglish["buttonJoinButton"] =  "Join now";

dataEnglish["languageLabels"] = "Choose your language: "

dataEnglish["mainTitle"] = "Main menu";
dataEnglish["newGameBackground"] = "url(../image/barrelNewGameEN.png)";
dataEnglish["openChatBackground"] = "url(../image/barrelJoinChatroomEN.png)";
dataEnglish["joinGameBackground"] = "url(../image/barrelJoinGameEN.png)";
dataEnglish["mainSetupBackground"] = "url(../image/barrelSetupEN.png)";
dataEnglish["gameListInMainText"] = "List of Games (joinable)";
dataEnglish["errorBannerMainText"] = "An error has occurred. A player cannot start a new game if they are already in a game lobby.";
dataEnglish["toManyPlayerBannerMainText"] = "The lobby is full. The player can therefore not join.";

dataEnglish["exitConfirmation"] = "Are you sure you want to exit the game? All your data will then be deleted!";
dataEnglish["exitConfirmYesButton"] =  "Yes, quit now.";
dataEnglish["exitConfirmNoButton"] = "No, don't finish yet.";
dataEnglish["backText"] = "Back";
dataEnglish["buttonSendText"] = "send";

dataEnglish["lobbyTitle"] = "Game lobby";
dataEnglish["playerListInLobbyText"] = "List of players:";
dataEnglish["barrelGameRules"] = "url(../image/barrelGameRules_EN.png)";
dataEnglish["exitLobbyButton"] = "url(../image/barrelLobbyExitEN.png)";
dataEnglish["deleteLobbyButton"] = "url(../image/barrelLobbyDeleteEN.png)";
dataEnglish["startGameBackground"] = "url(../image/barrelStartGameEN.png)";
dataEnglish["backLobbyText"] = "to Main menu";
dataEnglish["errorBannerLobbyText"] = "An error has occurred. The game lobby cannot be deleted if there is more than 1 player in the lobby.";
dataEnglish["errorConfirmText"] = "Continue";
dataEnglish["errorBannerStartedLobbyText"] = "Two to six players are required to start the game.";
dataEnglish["confirmToGameReadyText"] = "Ready to start the game?";
dataEnglish["readyToGameButtonYes"] = "ready";
dataEnglish["readyToGameButtonNo"] = "not ready";
dataEnglish["confirmGameStartText"] = "Wait until all players are ready.";
dataEnglish["gameStartStoppedText"] = "One player wasn't ready. The game start was aborted.";

dataEnglish["setupTitleTxt"] = "Setup";
dataEnglish["currentNameLabelTxt"] = "Your name: ";
dataEnglish["whatsYourNewNameTxt"] = "What would you like to be called?";
dataEnglish["changeUsernameTxt"] = "change name";

dataEnglish["leaveLabelText"] = "Exit game";
dataEnglish["userNameField"] = "player name: ";
dataEnglish["totalScoreSoFarField"] = "total score: ";
dataEnglish["currentScoreField"] = "current score: ";
dataEnglish["betScoreFieldStitches"] = "stitches: ";
dataEnglish["betScoreFieldExplain"] = "reached/announced";
dataEnglish["userCardsLabel"] = "your laid card: ";
dataEnglish["makeABetButton"] = "Set stitch";
dataEnglish["hittingOrderButton"] = "Hitting-Order";
dataEnglish["currentRoundLabel"] = "The round is on at the moment:";
dataEnglish["gameQuitText"] = "Do you really want to quit the game early? This action can not be undone.";
dataEnglish["waitForTheAnswer"] = 'You clicked "Cancel Game". Wait for all players to decide';
dataEnglish["continueTheGameTextYou"] = 'You clicked "No, continue playing". The game continues.';
dataEnglish["continueTheGameTextOther"] = '"No, keep playing" was clicked. The game continues.';
dataEnglish["gameQuitButtonYes"] = "Yes, cancel game and exit.";
dataEnglish["gameQuitButtonNo"] = "No, I want to keep playing.";

let dataGerman = {};
dataGerman["welcomeTitleTxt"] = "Willkommen zu Skull King";
dataGerman["whatsYourNameTxt"] = "Wie möchtest du heissen?";
dataGerman["buttonJoinButton"] =  "Jetzt beitreten";

dataGerman["languageLabels"] = "Wähle deine Sprache: ";

dataGerman["mainTitle"] = "Hauptmenü";
dataGerman["newGameBackground"] = "url(../image/barrelNewGameDE.png)";
dataGerman["openChatBackground"] = "url(../image/barrelJoinChatroomDE.png)";
dataGerman["joinGameBackground"] = "url(../image/barrelJoinGameDE.png)";
dataGerman["mainSetupBackground"] = "url(../image/barrelSetupDE.png)";
dataGerman["gameListInMainText"] = "Liste aller Spiele (beitretbar):"
dataGerman["errorBannerMainText"] = "Ein Fehler ist aufgetreten. Ein Spieler kann kein neues Spiel wenn er bereits in einer Spiel-Lobby ist.";
dataGerman["toManyPlayerBannerMainText"] = "Die Lobby ist voll. Der Spieler kann deshalb nicht beitreten.";

dataGerman["exitConfirmation"] = "Sind sie sicher, dass sie das Spiel verlassen wollen? Alle Ihre Daten werden dann gelöscht!";
dataGerman["exitConfirmYesButton"] =  "Ja, jetzt beenden.";
dataGerman["exitConfirmNoButton"] = "Nein, noch nicht beenden.";
dataGerman["backText"] = "Zurück";
dataGerman["buttonSendText"] = "Senden";

dataGerman["lobbyTitle"] = "Spiel-Lobby";
dataGerman["playerListInLobbyText"] = "Spielerliste";
dataGerman["barrelGameRules"] = "url(../image/barrelGameRules_DE.png)";
dataGerman["exitLobbyButton"] = "url(../image/barrelLobbyExitDE.png)";
dataGerman["deleteLobbyButton"] = "url(../image/barrelLobbyDeleteDE.png)";
dataGerman["startGameBackground"] = "url(../image/barrelStartGameDE.png)";
dataGerman["backLobbyText"] = "zum Hauptmenü";
dataGerman["errorBannerLobbyText"] = "Ein Fehler ist aufgetreten. Die Game-Lobby kann nicht gelöscht werden, wenn mehr als 1 Spieler in der Lobby ist.";
dataGerman["errorConfirmText"] = "Fortsetzen";
dataGerman["errorBannerStartedLobbyText"] = "Um das Spiel zu starten benötigt es zwei bis sechs Spieler.";
dataGerman["confirmToGameReadyText"] = "Bereit, das Spiel zu starten?";
dataGerman["readyToGameButtonYes"] = "Bereit";
dataGerman["readyToGameButtonNo"] = "Nicht Bereit";
dataGerman["confirmGameStartText"] = "Warten, bis alle Spieler bereit sind.";
dataGerman["gameStartStoppedText"] = "Ein Spieler war nicht bereit. Der Spielstart wurde abgebrochen.";

dataGerman["setupTitleTxt"] = "Einstellungen";
dataGerman["currentNameLabelTxt"] = "Du heisst: ";
dataGerman["whatsYourNewNameTxt"] = "Wie möchtest du neu heissen?";
dataGerman["changeUsernameTxt"] = "Name ändern";

dataGerman["leaveLabelText"] = "Spiel verlassen"
dataGerman["userNameField"] = "Spielername: ";
dataGerman["totalScoreSoFarField"] = "totale Punktzahl: ";
dataGerman["currentScoreField"] = "aktuelle Punktzahl: ";
dataGerman["betScoreFieldStitches"] = "Stiche: ";
dataGerman["betScoreFieldExplain"] = "erreicht/angesagt";
dataGerman["userCardsLabel"] = "Deine gelegte Karte: ";
dataGerman["makeABetButton"] = "Stich festlegen";
dataGerman["hittingOrderButton"] = "Schlag-Reihen-Folge";
dataGerman["currentRoundLabel"] = "Im Moment läuft die Runde";
dataGerman["gameQuitText"] = "Willst du wirklich das Spiel vorzeitig abbrechen? Dieser Vorgang kann nicht rückgängig gemacht werden.";
dataGerman["waitForTheAnswer"] = 'Du hast auf "Spiel abbrechen" geklickt. Warte, bis alle Spieler sich entschieden haben.';
dataGerman["continueTheGameTextYou"] = 'Du hat auf "Nein, weiterspielen" geklickt. Das Spiel wird fortgeführt.';
dataGerman["continueTheGameTextOther"] = 'Es wurde auf "Nein, weiterspielen" geklickt. Das Spiel wird fortgeführt.';
dataGerman["gameQuitButtonYes"] = "Ja, Spiel abbrechen und verlassen.";
dataEnglish["gameQuitButtonNo"] = "Nein, ich will noch weiterspielen.";

let language = "Deutsch";
let index = 1;

function changeLanguageWelcome() {
    const l = document.getElementById('welcomeLanguages');
    index = l.value;
    const lang = l.options[l.selectedIndex].text;
    if (lang !== language) {
        language = lang;
        languageChange(language);
    }
    selectElement('mainLanguages', index);
    selectElement('lobbyLanguages', index);
    selectElement('setupLanguages', index);
    selectElement('gameLanguages', index);
}

function changeLanguageMain() {
    const l = document.getElementById('mainLanguages');
    index = l.value;
    const lang = l.options[l.selectedIndex].text;
    if (lang !== language) {
        language = lang;
        languageChange(language);
    }
    selectElement('welcomeLanguages', index);
    selectElement('lobbyLanguages', index);
    selectElement('setupLanguages', index);
    selectElement('gameLanguages', index);
}

function changeLanguageLobby() {
    const l = document.getElementById('lobbyLanguages');
    index = l.value;
    const lang = l.options[l.selectedIndex].text;
    if (lang !== language) {
        language = lang;
        languageChange(language);
    }
    selectElement('welcomeLanguages', index);
    selectElement('mainLanguages', index);
    selectElement('setupLanguages', index);
    selectElement('gameLanguages', index);
}

function changeLanguageSetup(){
    const l = document.getElementById('setupLanguages');
    index = l.value;
    const lang = l.options[l.selectedIndex].text;
    if (lang !== language) {
        language = lang;
        languageChange(language);
    }
    selectElement('welcomeLanguages', index);
    selectElement('mainLanguages', index);
    selectElement('lobbyLanguages', index);
    selectElement('gameLanguages', index);
}

function changeLanguageGameTable(){
    const l = document.getElementById('gameLanguages');
    index = l.value;
    const lang = l.options[l.selectedIndex].text;
    if (lang !== language) {
        language = lang;
        languageChange(language);
    }
    selectElement('welcomeLanguages', index);
    selectElement('mainLanguages', index);
    selectElement('lobbyLanguages', index);
    selectElement('setupLanguages', index);
}

function languageChange(languageNew){
    let data;
    if (languageNew === "English") {
        websocketGame.language = "English";
        data = dataEnglish;
    } else {
        websocketGame.language = "Deutsch";
        data = dataGerman;
    }

    welcomeTitle.textContent = data["welcomeTitleTxt"];
    whatsYourName.textContent = data["whatsYourNameTxt"];
    buttonJoin.textContent = data["buttonJoinButton"];

    welcomeLanguageLabel.textContent = data["languageLabels"];
    mainLanguageLabel.textContent = data["languageLabels"];
    lobbyLanguageLabel.textContent = data["languageLabels"];
    setupLanguageLabel.textContent = data["languageLabels"];
    gameLanguagesLabel.textContent = data["languageLabels"];

    mainTitleTxt.textContent = data["mainTitle"];
    startNewGameButton.style.backgroundImage = data["newGameBackground"];
    joinChatroomButton.style.backgroundImage = data["openChatBackground"];
    joinGameButton.style.backgroundImage = data["joinGameBackground"];
    mainSetupButton.style.backgroundImage = data["mainSetupBackground"];
    gameListInMainText.textContent = data["gameListInMainText"];
    errorBannerMainText.textContent = data["errorBannerMainText"];
    errorConfirmMainText.textContent = data["errorConfirmText"];
    toManyPlayerBannerMainText.textContent = data["toManyPlayerBannerMainText"];
    failConfirmMainButton.textContent = data["errorConfirmText"];

    exitConfirmText.textContent = data["exitConfirmation"];
    exitConfirmYesButton.textContent = data["exitConfirmYesButton"];
    exitConfirmNoButton.textContent = data["exitConfirmNoButton"];
    backChatText.textContent = data["backText"];
    buttonSend.innerText = data["buttonSendText"];

    lobbyTitleTxt.textContent = data["lobbyTitle"]
    playerListInLobbyText.textContent = data["playerListInLobbyText"];
    barrelGameRules.style.backgroundImage = data["barrelGameRules"];
    exitLobbyButton.style.backgroundImage = data["exitLobbyButton"];
    deleteLobbyButton.style.backgroundImage = data["deleteLobbyButton"];
    startGameButton.style.backgroundImage = data["startGameBackground"];
    backLobbyText.textContent = data["backLobbyText"];
    errorBannerLobbyText.textContent = data["errorBannerLobbyText"];
    errorConfirmLobbyText.textContent = data["errorConfirmText"];
    errorBannerStartedLobbyText.textContent = data["errorBannerStartedLobbyText"];
    confirmToGameReadyText.textContent = data["confirmToGameReadyText"];
    readyToGameButtonYes.textContent = data["readyToGameButtonYes"];
    readyToGameButtonNo.textContent = data["readyToGameButtonNo"];
    confirmGameStartText.textContent = data["confirmGameStartText"];
    gameStartStoppedText.textContent = data["gameStartStoppedText"];
    confirmGameStopButton.textContent = data["errorConfirmText"];

    setupTitleTxt.textContent = data["setupTitleTxt"];
    currentNameLabelTxt.textContent = data["currentNameLabelTxt"];
    whatsYourNewNameTxt.textContent = data["whatsYourNewNameTxt"];
    changeUsernameTxt.textContent = data["changeUsernameTxt"];
    backSetupText.textContent = data["backText"];

    leaveLabelText.textContent = data["leaveLabelText"];
    userNameField.textContent = data["userNameField"];
    totalScoreSoFarField.textContent = data["totalScoreSoFarField"];
    currentScoreField.textContent = data["currentScoreField"];
    betScoreFieldStitches.textContent = data["betScoreFieldStitches"];
    betScoreFieldExplain.textContent = data["betScoreFieldExplain"];
    userCardsLabel.textContent = data["userCardsLabel"];
    makeABetButton.textContent = data["makeABetButton"];
    hittingOrderButton.textContent = data["hittingOrderButton"];
    currentRoundLabel.textContent = data["currentRoundLabel"];
    gameQuitText.textContent = data["gameQuitText"];
    waitForTheAnswer.textContent = data["waitForTheAnswer"];
    continueTheGameTextYou.textContent = data["continueTheGameTextYou"];
    continueTheGameTextOther.textContent = data["continueTheGameTextOther"];
    gameQuitButtonYes.textContent = data["gameQuitButtonYes"];
    gameQuitButtonNo.textContent = data["gameQuitButtonNo"];
    continueTheGameButton.textContent = data["errorConfirmText"];
}

function selectElement(id, valueToSelect){
    const element = document.getElementById(id);
    element.value = valueToSelect;
}