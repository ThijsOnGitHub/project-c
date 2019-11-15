const express = require('express');
app=express.Router()
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var mysql = require('mysql');
const multer = require('multer');
const auth=require("../verifytoken")
var {serverSecret}=require('../serverSecret');



var storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: (req,file,cb) =>{
        //
        console.log(file.fieldname==="profielFoto")
        if(file.fieldname === "profielFoto"){
            cb(null,"Profielfoto"+Date.now()+".png")
        }else{
            cb(null,"randow "+new Date().toDateString()+".png")
        }
    }
})

var upload=multer({storage:storage})

var connection=mysql.createConnection(serverSecret.databaseLogin);

app.get("/bedrijf",async (req,res)=>{
    console.log("Get bedrijven");
    connection.query('SELECT * FROM bedrijf', (error, results, fields) =>{
        res.json(results)
    });
});


app.get("/getAgenda",auth,(req,res)=>{
    console.log(req.user)
    console.log("get agenda from user: "+req.user.id);
    connection.query('SELECT datum,beginTijd,eindTijd FROM roosterItems where userId=?',[req.user.id],(err,values)=>{
        //Hier worden de tijden omgezet in javascript format zodat ze tot DATE object kunnen worden gemaakt
        var newValues=values.map(value => {
            value.beginTijd=`1899-12-31T${value.beginTijd}.000`;
            value.eindTijd=`1899-12-31T${value.eindTijd}.000`;
            return value
        });
        res.json(newValues)
    })


});

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

app.get("/test",(req,res)=>{
    res.status(200).send("Hello!")
});


app.get("/avatar/:name",(req,res)=>{
    console.log(__dirname.split("/"))
    res.sendFile(__dirname.split("\\").slice(0,-1).join("\\")+"/uploads/"+req.params.name)
})

// ---------------- REGISTRATIE ----------------

// Zend een POST request dat de data uit de front-end in de database krijgt en daarmee een nieuwe gebruiker aanmaakt.
app.post("/addgebruiker", upload.single('profielFoto'), async (req, res) => {
    let data = req.body;
    let image = "defaultAvatar.png";

    if (req.file !== undefined) {image = req.file.filename;}
    data.pass = await bcrypt.hash(data.pass, 10 );

    connection.query("INSERT INTO gebruiker (firstName, lastName, email, pass, phone, birth, profielFotoLink, isWerkgever) VALUES (?,?,?,?,?,?,?,?)",[data.firstName, data.lastName, data.email, data.pass, data.phone, data.birth,image ,data.isWerkgever?1:0],
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

// ---------------- NOTIFICATIES ----------------

app.post("/addnotif",async (req, res) => {
    var data = req.body;
    console.log("Notificatie toevoegen: ");
    connection.query("INSERT INTO Notifications (userId, messageType, roosterId) VALUES (?,?,?)", [data.person, data.messageId, data.roosterId],
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
    connection.query('SELECT CONCAT(firstName, " " , lastName) as name, messageType FROM Notifications JOIN gebruiker ON Notifications.userId = gebruiker.id', [], (err, result, val) => {
        if (err !== null) {
            console.log(err);
            res.status(400).send()
        }
        console.log(val);
        console.log(result);
        res.json(result)
    })
})
app.get("/getgebruikerinfo",auth,async (req,res)=>{
    console.log("Get user info");
    connection.query("SELECT firstName, lastName, email, phone, birth, profielFotoLink FROM roosterit.gebruiker where id= ?",[req.user.id], (error, results, fields) =>{
        res.json(results)
    });
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports=app