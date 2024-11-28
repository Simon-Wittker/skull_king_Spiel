const Cardtype = {
    Black: "black",
    Red: "red",
    Yellow: "yellow",
    Blue: "blue",
    White_flag: "white",
    Skull_King: "skullKing",
    Mermaid: "mermaid",
    Scary_Marry: "scaryMarry"
}

class Card{
    value;
    type;
    imagePath;
    state;
    owner;
    constructor(value, type, imagePath){
        this.value = value;
        this.type = type;
        this.imagePath = imagePath;
        this.state = "available";

    }
    takeCard(ownerId){
        this.state="taken";
        this.owner = ownerId;
    }
    resetCard(){
        this.state="available";
        this.owner = null;
    }

}


class CardSet{
    cards;
    constructor() {
        this.cards = [];
        //red
        const typRed = "red";
        for (let i = 1; i <= 13; i++){
            this.cards.push(new Card(i, typRed, "../image/cardImages/" + typRed + (i).toString() + ".png"));
        }
        //blue
        const typBlue = "blue";
        for (let i = 1; i <= 13; i++){
            this.cards.push(new Card(i, typBlue, "../image/cardImages/" + typBlue + (i).toString() + ".png"));
        }
        //yellow
        const typYellow = "yellow";
        for (let i = 1; i <= 13; i++){
            this.cards.push(new Card(i, typYellow, "../image/cardImages/" + typYellow + (i).toString() + ".png"));
        }
        //black
        const typBlack = "black";
        for (let i = 1; i <= 13; i++){
            this.cards.push(new Card(i + 13, typBlack, "../image/cardImages/" + typBlack + (i).toString() + ".png"));
        }
        //pirates
        const cardImagesPath = ["../image/cardImages/BadeyeJoe.png", "../image/cardImages/BettyBrave.png",
            "../image/cardImages/EvilEmmy.png", "../image/cardImages/HarryTheGiant.png", "../image/cardImages/TortugaJack.png" ];
        for (let i = 0; i < 5; i++){
            this.cards.push(new Card(40, "pirate", cardImagesPath[i]));
        }
        //White Flag
        const typWithe = "white";
        for (let i = 0; i < 5; i++){
            this.cards.push(new Card(0, typWithe, "../image/cardImages/" + typWithe + i + ".png"));
        }
        //Mermaid
        for (let i = 0; i < 2; i++){
            this.cards.push(new Card(30, "mermaid", "../image/cardImages/Mermaid" + i +".png"));
        }
        //Scary Marry
      //  this.cards.push(new Card(0,"scaryMarry", "../image/cardImages/ScaryMary.png"));

        //Skull King
        this.cards.push(new Card(50, "skullKing", "../image/cardImages/SkullKing.png"));
    }

    getRandomCard(ownerId){
        //Get random number between 0 and 64
        let r = Math.floor(Math.random() * (64 - 0 + 1) + 0);

        while (!this.checkIfCardIsAvailable(this.cards[r])){
               r = Math.floor(Math.random() * (64 - 0 + 1) + 0);
        }
        this.cards[r].takeCard(ownerId);
        return this.cards[r];
    }

    checkIfCardIsAvailable(card){
        if (card.state === "available"){
            return true;
        }else{
            return false;
        }
    }

    resetDeck(){
        for (let i = 0; i < this.cards.length; i++){
            this.cards[i].resetCard();
        }
    }

}

module.exports.CardSet = CardSet;