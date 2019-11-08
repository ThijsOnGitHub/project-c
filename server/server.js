const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var mysql = require('mysql');
const cors= require('cors');
const multer = require('multer');
const jwt = require  ('jsonwebtoken');

serverSecret=require('./serverSecret');

var connection=mysql.createConnection(serverSecret.serverSecret.databaseLogin);





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
    console.log("get agenda from user: "+req.params.userId);

    connection.query('SELECT datum,beginTijd,eindTijd FROM roosterItems where userId=?',[req.params.userId],(err,values)=>{
        //Hier worden de tijden omgezet in javascript format zodat ze tot DATE object kunnen worden gemaakt
        var newValues=values.map(value => {
            value.beginTijd=`1899-12-31T${value.beginTijd}.000`;
            value.eindTijd=`1899-12-31T${value.eindTijd}.000`;
            return value
        });
        res.json(newValues)
    })


});

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
});

app.get("/api/test",(req,res)=>{
    res.status(200).send("Hello!")
});


app.get("/api/getImage/:name",(req,res)=>{
    res.sendFile(__dirname+"/uploads/"+req.params.name)
})



// Zend een POST request dat de data uit de front-end in de database krijgt.
app.post("/api/addgebruiker", upload.single('profielFoto'), async (req, res) => {
    var data = req.body;
    console.log(data.firstName)
    data.pass = await bcrypt.hash(data.pass, 10 );
    console.log("Toevoeging gebruiker:");
    connection.query("INSERT INTO gebruiker (firstName, lastName, email, pass, phone, birth, profielFotoLink, isWerkgever) VALUES (?,?,?,?,?,?,?,?)",[data.firstName, data.lastName, data.email, data.pass, data.phone, data.birth, req.file.filename,data.isWerkgever?1:0],
        (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(422).json;
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
    })
});

app.put("/api/activeergebruiker", (req, res) => {
    let data = req.body;
    console.log("Activeren gebruiker:");
    connection.query("UPDATE gebruiker SET verificatie = 1 WHERE email = (?)", [data.email], (error, results, fields) =>{
        res.json(results);
        console.log("Gebruiker geactiveerd.");
    });
});

app.post("/api/addnotif",async (req, res) => {
    var data = req.body;
    console.log("Notificatie toevoegen: ");
    connection.query("INSERT INTO Notifications (userId, messageType, bedrijfId) VALUES (?,?,?)", [data.person, data.messageId, data.bedrijfId],
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

app.get("/api/getnotifs", (req, res) => {
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
app.get("/api/getgebruikerinfo",async (req,res)=>{
    console.log("Get user info");
    connection.query("SELECT firstName, lastName, email, phone, birth, profielFotoLink FROM roosterit.gebruiker where firstname='Delano'", (error, results, fields) =>{
        res.json(results)
    });
});

app.post("/api/Login", (req,res) =>{



    console.log(req.body);
    connection.query("SELECT email,pass,id FROM gebruiker where email = ?",[req.body.email],(err,values,fields)=>{
        console.log(values.length)
        console.log(err)

        if (err|| values.length === 0) {

            res.status(401).send("Not valid")
        }
        else (bcrypt.compare(req.body.pass,values[0].pass,(err,result)=>{
            if(err){
                console.error(err)
            }
            console.log(result)
            if(result){
                var payLoad={id:values[0].id}
                var token=jwt.sign(payLoad, serverSecret.serverSecret.secret,{expiresIn:"1h"});
                res.status(200).send(token)
            }else{
                res.status(401).send("Not valid")
            }
}))
    })});

app.listen(5000,()=> {
    console.log("listening")

});