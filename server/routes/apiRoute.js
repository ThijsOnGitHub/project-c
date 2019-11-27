const express = require('express');
app=express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const roosterItemRoute = require('./RoosterItemRoute');
const multer = require('multer');
const auth=require("../middleware/verifytoken");
const yourItem=require("../middleware/itemOfWerkgever");

var mysql = require('mysql');
var {serverSecret}=require('../serverSecret');
var connection=mysql.createConnection(serverSecret.databaseLogin);



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
    console.log(__dirname.split("/"));
    res.sendFile(__dirname.split("\\").slice(0,-1).join("\\")+"/uploads/"+req.params.name)
});

// ---------------- REGISTRATIE ----------------

app.get("/avatarWithId/:id",(req,res)=>{
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
});
// Zend een POST request dat de data uit de front-end in de database krijgt en daarmee een nieuwe gebruiker aanmaakt.
app.post("/addgebruiker", upload.single('profielFoto'), async (req, res) => {
    let data = req.body;
    let image = "defaultAvatar.png";

    if (req.file !== undefined) {image = req.file.filename;}
    data.pass = await bcrypt.hash(data.pass, 10 );
console.log(data);
    connection.query("INSERT INTO gebruiker (firstName, lastName, email, pass, phone, birth, profielFotoLink, isWerkgever) VALUES (?,?,?,?,?,?,?,?)",[data.firstName, data.lastName, data.email, data.pass, data.phone, data.birth,image ,data.isWerkgever==='true'],
    (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(422).json;
            res.json({message:error});
        } else {
            res.status(201).send(data.firstName + " toegevoegd.");
            console.log(data.firstName + " toegevoegd.");

            // Hier wordt het verificatie-email verstuurd. Wanneer we ook op andere plekken email gaan gebruiken kan deze code centraler opgeslagen worden.
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'roosteritHRO@gmail.com',
                    pass: 'hogeschoolr'
                }
            });

            const mailOptions = {
                from: 'roosteritHRO@gmail.com',
                to: data.email,
                subject: 'Verificatie RoosterIt',
                html: ` 
                <h1>Geachte meneer/mevrouw ${data.lastName},</h1><p>Volg deze link om uw registratie te voltooien:</p>
                <p><a href='http://localhost:3000/emailverificatie/${data.email}'>Verifieer email</a></p>
                `
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email verstuurd: ' + info.response);
                }
            });
        }
    })
});

// Voeg een rooster toe aan de database met de verstuurde naam.
app.post("/addrooster", (req, res) => {
    let data = req.body;
    connection.query("INSERT INTO rooster (roosterName) VALUES (?)", [data.roosterName], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(422);
            res.json({message: error});
        } else {
            console.log("Rooster " + data.roosterName + " toegevoegd.");
        }
    });

    // Haal het roosterId op van het zojuist aangemaakte rooster.
    connection.query("SELECT roosterId FROM rooster WHERE roosterName = (?)", [data.roosterName], (error, results, fields) => {
        let roosterId = results[0].roosterId;

        // Voeg de gegenereerde koppelcode toe aan de database.
        connection.query("INSERT INTO koppelCode (koppelCode, roosterId) VALUES (?,?)", [data.koppelCodeWerkgever, roosterId], (error, results, fields) => {
            console.log("Koppelcode toegevoegd.");

            // Update in de gebruikerstabel de werkgever met het roosterId van het rooster dat hij heeft aangemaakt.
            connection.query("UPDATE gebruiker SET roosterId = ? WHERE email = ?", [roosterId, data.email], (error, results, fields) => {});
        });
    });
});

app.put("/koppelgebruiker", (req, res) => {
    let data = req.body;

    // Haal het roosterId op van het rooster dat bij de ingevoerde koppelcode hoort.
    connection.query("SELECT roosterId FROM koppelCode WHERE koppelCode = ?", [data.koppelCodeWerknemer], (error, results, fields) => {
       let roosterId = results[0].roosterId;

        // Update in de gebruikerstabel de werknemer met het roosterId dat bij de ingevoerde koppelcode past.
       connection.query("UPDATE gebruiker SET roosterId = ? WHERE email = ?", [roosterId, data.email], (error, results, fields) => {
           console.log("Gebruiker gekoppeld aan rooster " + roosterId);
       });
    });
});

// Activeer een gebruiker in de database nadat deze de link in de verificatie-email heeft gevolgd.
app.put("/activeergebruiker", (req, res) => {
    let data = req.body;
    console.log("Activeren gebruiker:");
    connection.query("UPDATE gebruiker SET verificatie = 1 WHERE email = (?)", [data.email], (error, results, fields) =>{
        res.json(results);
        console.log("Gebruiker geactiveerd.");
    });
});

// Update user
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
    connection.query('SELECT CONCAT(firstName, " " , lastName) as name, messageType, profielFotoLink FROM Notifications JOIN gebruiker ON Notifications.userId = gebruiker.id ORDER BY Notifications.id DESC', [], (err, result, val) => {
        if (err !== null) {
            console.log(err);
            res.status(400).send()
        }
        res.json(result)
    })
});
app.get("/getNextShift", auth, (req, res) => {
    console.log("Getting next shift...");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '/' + mm + '/' + dd;
    connection.query('SELECT datum, beginTijd, eindTijd FROM roosterItems WHERE (datum > ?) AND (userId = ?) LIMIT 1', [today, req.user.id], (err, result, val) => {
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
    connection.query("SELECT firstName, lastName, email, phone, birth, profielFotoLink FROM roosterit.gebruiker where id= ?",[req.user.id], (error, results, fields) =>{
        res.json(results)
    });
});

app.get('/getRoosterAndPerson', auth, async (req, res) => {
    console.log("Getting sick person's data...");
    connection.query("SELECT concat(firstName, ' ', lastName) as naam, beginTijd, eindTijd, datum FROM roosterit.Notifications LEFT JOIN roosterItems rI on Notifications.roosterItemId = rI.itemId LEFT JOIN gebruiker g on Notifications.userId = g.id WHERE Notifications.id = ?", [this.userId])
});

app.use("/rooster",roosterItemRoute);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports=app;