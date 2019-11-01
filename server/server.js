const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var mysql = require('mysql');
const cors= require('cors');
serverLogin=require('./serverlogin');

var connection=mysql.createConnection(serverLogin.serverLogin);
connection.connect();

var app = express();

app.use(cors());
app.use(express.json());

app.get("/api/bedrijf",async (req,res)=>{
    console.log("Get bedrijven");
    connection.query('SELECT * FROM bedrijf', (error, results, fields) =>{
        res.json(results)
    });
});


app.get("/api/getAgenda/:userId",(req,res)=>{
    console.log("get agenda from user: "+req.params.userId)

    connection.query('SELECT datum,beginTijd,eindTijd FROM roosterItems where userId=?',[req.params.userId],(err,values)=>{
        //Hier worden de tijden omgezet in javascript format zodat ze tot DATE object kunnen worden gemaakt
        var newValues=values.map(value => {
            value.beginTijd=`1899-12-31T${value.beginTijd}.000`
            value.eindTijd=`1899-12-31T${value.eindTijd}.000`
            return value
        })
        res.json(newValues)
    })


})

app.post("/api/addbedrijf",(req,res)=>{
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
})

app.get("/api/test",(req,res)=>{
    res.status(200).send("Hello!")
})

// Zend een POST request dat de data uit de front-end in de database krijgt.
app.post("/api/addgebruiker", async (req, res) => {
    var data = req.body;
    data.pass = await bcrypt.hash(data.pass, 10 );
    console.log("Toevoeging gebruiker:");
    connection.query("INSERT INTO gebruiker (firstName, lastName, email, pass, phone, birth, isWerkgever) VALUES (?,?,?,?,?,?,?)",[data.firstName, data.lastName, data.email, data.pass, data.phone, data.birth, data.isWerkgever],
        (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(422);
            res.json({message:error});
        }else{
            res.status(201).send("Gebruiker toegevoegd.");
            console.log("Gebruiker toegevoegd.");

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
    });
});

app.put("/api/activeergebruiker", (req, res) => {
    let data = req.body;
    console.log("Activeren gebruiker:");
    connection.query("UPDATE gebruiker SET verificatie = 1 WHERE email = (?)", [data.email], (error, results, fields) =>{
        res.json(results);
        console.log("Gebruiker geactiveerd.");
    });
});

app.listen(5000,()=> {
    console.log("listening")
});