const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var mysql = require('mysql');
const cors= require('cors');
serverLogin=require('./serverlogin');
const path = require('path');
const multer = require('multer');



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

var connection=mysql.createConnection(serverLogin.serverLogin)

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


app.get("/api/getImage/:name",(req,res)=>{
    res.sendFile(__dirname+"/uploads/"+req.params.name)
})



// Zend een POST request dat de data uit de front-end in de database krijgt.
app.post("/api/addgebruiker",upload.single('profielFoto'),async (req, res) => {
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
        }
    })
});


app.listen(5000,()=> {
    console.log("listening")
});