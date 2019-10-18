const express = require('express');
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const cors= require('cors');



serverSecret=require('./serverSecret');

var connection=mysql.createConnection(serverSecret.serverSecret.databaseLogin);
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
app.post("/api/addgebruiker",async (req, res) => {
    var data = req.body;
    data.pass = await bcrypt.hash(data.pass, 10 );
    console.log("Toevoeging gebruiker:");
    connection.query("INSERT INTO gebruiker (firstName, lastName, email, pass, phone, birth, img_link, isWerkgever) VALUES (?,?,?,?,?,?,?,?)",[data.firstName, data.lastName, data.email, data.pass, data.phone, data.birth, data.img_link, data.isWerkgever],
        (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(422);
            res.json({message:error});
        }else{
            res.status(201).send("Gebruiker toegevoegd.");
            console.log("Gebruiker toegevoegd.");
        }
    });
});

app.post("/api/Login", (req,res) =>{
    console.log(req.body);
    connection.query("SELECT email,pass FROM gebruiker where email = ?",[req.body.email],(err,values,fields)=>{
        console.log(values.length)
        console.log(err)
        if (err|| values.length === 0){

            res.status(400).send("Not valid")
        }
        else (bcrypt.compare(req.body.pass,values[0].pass,(err,res)=>{
            if(err){
                console.error(err)
            }
            console.log(res)

        }))



    })});

app.listen(5000,()=> {
    console.log("listening")

});