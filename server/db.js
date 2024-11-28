

class DBConnector {
    mongoosedb ;
    uri;
    constructor() {
        this.mongoosedb = require("mongoose");
        this.uri = "mongodb+srv://admin:skullking@skullking.end1wqk.mongodb.net/?retryWrites=true&w=majority";
    }


    async connect() {


        try {
            await this.mongoosedb.connect(this.uri)
            console.log("Connected to MongoDB")
        } catch (error) {
            console.error(error)
        }
    }

    async insert(message, collection){

            this.mongoosedb.connect(this.uri, function(err, db) {
                if (err) {
                    console.log ("Fehler bei Verbindung auf Datenbank: " + err);
                }else {
                    let myobj = message;
                    // var dbo = db.db("skullKing");
                    db.collection(collection).insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("1 record inserted");
                        db.close();
                    });
                }
            });


    }

    async update(myquery, newvalues, collection){
        this.mongoosedb.connect(this.uri, function(err, db) {
            if (err) {
                console.log ("Fehler bei Verbindung auf Datenbank: " + err);
            }else {

                db.collection(collection).updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                });
            }
        });
    }



}
module.exports.DBConnector = DBConnector;



// Aufruf in anderen js Files
/*
const {DBConnector} = require("./db");




 setUsername(username){
        this.username = username;

        //Update User on Database
        let dbcon = new DBConnector();
        let query = { id: this.id};
        let newvalues = { $set: {username : username}};
        dbcon.update(query, newvalues, "users");

    }

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
 */