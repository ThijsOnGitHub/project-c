const express = require('express');
app = express.Router();
const nodemailer = require('nodemailer');
const roosterItemRoute = require('./apiRoutes/RoosterItemRoute')
const multer = require('multer');
const auth=require("../middleware/verifytoken");
const roosterStructuur=require("./apiRoutes/RoosterStructuur")
const accountRoute = require('./accountRoute');
const bcrypt = require('bcryptjs');


var mysql = require('mysql');
var {serverSecret}=require('../serverSecret');
var connection=mysql.createPool(serverSecret.databaseLogin);

var storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: (req,file,cb) =>{
        //
        if(file.fieldname === "profielFoto"){
            cb(null,"Profielfoto"+Date.now()+".png")
        }else{
            cb(null,"randow "+new Date().toDateString()+".png")
        }
    }
});

var upload=multer({storage:storage});

app.post("/addbedrijf",(req,res)=>{
    var data=req.body;
    console.log("posting:");
    connection.query("INSERT INTO bedrijf (name, phone, loc, pass, img_link) VALUES (?,?,?,?,?)",[data.name,data.phone,data.loc,data.pass,data.img_link], (error,results, fields)=>{
        console.log(error);
        if (error) {
            res.status(422);
            res.json({message:error});
        }else{
            res.send("Done!")
        }
    })
});

app.get("/avatar/:name",(req,res)=>{
    console.log("start getting avatar")
    console.log(__dirname.split("/"));
    res.sendFile(__dirname.split("\\").slice(0,-1).join("\\")+"/uploads/"+req.params.name)
    console.log("succeed getting avatar")
});

// ---------------- ACCOUNTS ----------------

app.get("/avatarWithId/:id",(req,res)=>{
    console.log("start getting avatar")
    connection.query("select profielFotoLink as avatar from gebruiker where id =?",[req.params.id],(err,values)=>{
        if(err){
            res.status(500).send(err)
        }else{
            console.log(values);
            if(values.length===0){
                res.status(400)
            }else{
                res.sendFile(__dirname.split("\\").slice(0,-1).join("\\")+"/uploads/"+values[0].avatar)
            }

        }
    })
console.log("succeed getting avatar")
});

app.get("/GetMedewerkers",auth, ((req, res) =>{
    if(req.user.isWerkgever){
        connection.query("SELECT id, firstName, lastName, CONCAT(firstName,' ',lastName) as naam FROM gebruiker WHERE roosterid = (select roosterId from gebruiker where id=?)", [req.user.id], ( err, result, val) => {
            res.status(200).json(result)
        });
    }else{
        res.status(401).send("Je bent geen werkgever")
    }
}));

// Update user via de accountpagina
app.put("/updategebruiker",auth, (req, res) => {
    let data = req.body;
    console.log("Updaten gebruiker...:");
    connection.query("UPDATE gebruiker SET firstName = (?), lastName = (?), email = (?), phone = (?) WHERE Id = (?)", [data.newVoornaam, data.newAchternaam, data.newEmail, data.newTelefoon, req.user.id], (error, results, fields) =>{
        res.json(results);
        if (error) {
            console.log(error);
        }
        console.log("Gebruiker geupdatet.");
    });
});

// Update user via de accountpagina
app.put("/updategebruiker2",auth, async (req, res) => {
    let data = req.body;
    data.newPassword = await bcrypt.hash(data.newPass, 10 );
    console.log("Updaten gebruiker... met wachtwoord" + data.newPassword);
    connection.query("UPDATE gebruiker SET firstName = (?), lastName = (?), email = (?), pass = (?), phone = (?) WHERE Id = (?)", [data.newVoornaam, data.newAchternaam, data.newEmail, data.newPassword, data.newTelefoon, req.user.id], (error, results, fields) =>{
        res.json(results);
        if (error) {
            console.log(error);
        }
        console.log("Gebruiker geupdatet.");
    });
});
// ---------------- NOTIFICATIES ----------------

app.post("/addnotif",async (req, res) => {
    var data = req.body;
    console.log("Notificatie toevoegen: ");
    connection.query("INSERT INTO Notifications (userId, messageType, roosterId, roosterItemId) VALUES (?,?,?,?)", [data.person, data.messageId, data.roosterId, data.roosterItemId],
        (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(422);
                res.json({message:error});
            }
            else {
                res.status(201).send("Notificatie toegevoegd.");
                console.log("Notificatie toegevoegd.")
            }
        })
});

app.get("/getnotifs", (req, res) => {
    console.log("Getting notifs...");
    connection.query('SELECT CONCAT(firstName, " " , lastName) as name, messageType, profielFotoLink, roosterItemId, Notifications.id AS notifId FROM Notifications JOIN gebruiker ON Notifications.userId = gebruiker.id ORDER BY Notifications.id DESC', [], (err, result, val) => {
        if (err !== null) {
            console.log(err);
            res.status(400).send()
        }
        res.json(result)
    })
});

app.get("/GetMedewerkers",auth, ((req, res) =>{

   if(req.user.isWerkgever){
       connection.query("SELECT id, firstName, lastName FROM gebruiker WHERE roosterid = 1", [], ( err, result, val) => {
           res.json(result)
       });
   }

}));

app.post("/deleteUser",auth,((req,res) => {
    console.log(req.body)
    if(req.user.isWerkgever){
        connection.query("DELETE FROM gebruiker WHERE id = ?  ", [req.body.id], (err,values,field)=>{
            if(err){
                res.status(500).send(err)
            }else{
                res.status(200).send()

            }
        })
    }else{
        res.status(401).send("Je bent geen werkgever")
    }
}));

app.get("/getNextShift", auth, (req, res) => {
    console.log("Getting next shift...");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;
    connection.query('SELECT datum, beginTijd, eindTijd FROM roosterItems WHERE (datum > ?) AND (userId = ?) ORDER BY datum LIMIT 1', [today, req.user.id], (err, result, val) => {
        if (err !== null) {
            console.log(err);
            res.status(500).send()
        }
        console.log(val);
        console.log(result);
        console.log("Next shift received!");
        res.json(result)
    })
});

app.get("/getgebruikerinfo",auth,async (req,res)=>{
    console.log("Get user info");
    connection.query("SELECT firstName, lastName, email, phone, pass, birth, profielFotoLink FROM roosterit.gebruiker where id= ?",[req.user.id], (error, results, fields) =>{
        res.json(results)
    });
});


app.post('/getRoosterAndPerson', auth, (req, res) => {
    console.log("Getting sick person's data...");
    connection.query("SELECT concat(firstName, ' ', lastName) as naam, beginTijd, eindTijd, datum FROM roosterit.Notifications LEFT JOIN roosterItems rI on Notifications.roosterItemId = rI.itemId LEFT JOIN gebruiker g on Notifications.userId = g.id WHERE Notifications.roosterItemId = ?", [req.body.roosterItemId], (error, results, fields) =>{
        console.log(results);
        res.json(results[0])
    });
});

app.post('/ziekMeld', auth, (req, res) => {
    console.log("Start ziekMeld");
    console.log(req.body.roosterItemId);
    connection.query("UPDATE roosterItems SET state = 2 WHERE itemId = ?", [req.body.roosterItemId], (error, results, fields) =>{
        if(error){
            res.status(500).send(error);
            console.log('ziekMeld failed')
        }
        else {
            res.status(200).send();
            console.log('ziekMeld succeeded')
        }
    })
});

app.post('/ziekAccept', auth, (req, res) => {
    console.log("start ziekAccept");
    connection.query("UPDATE roosterItems SET userId = ?, state = 1 WHERE itemId = ?", [req.user.id, req.body.roosterItemId], (error, results, fields) =>{
        if(error){
            res.status(500).send(error);
            console.log('ziekAccept failed', error)
        }
        else {
            res.status(200).send();
            console.log('ziekAccept succeeded')
        }
    })
});

app.post('/delNotif', auth, (req, res) => {
    console.log("start delNotif");
    connection.query('DELETE FROM Notifications WHERE id = ?', [req.body.notifId], (error, results, fields) => {
        if(error){
            res.status(500).send(error);
            console.log('delNotif failed', error)
        }
        else {
            res.status(200).send();
            console.log('delNotif succeeded')
        }
    })
});

app.use("/rooster", roosterItemRoute);
app.use("/account", accountRoute);
app.use("/roosterstructuur",roosterStructuur)


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports=app;