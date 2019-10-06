const express = require('express')
var mysql = require('mysql')
const cors= require('cors')
serverLogin=require('./serverlogin')

var connection=mysql.createConnection(serverLogin.serverLogin)
connection.connect();

var app = express()

app.use(cors())
app.use(express.json())


app.get("/api/bedrijf",async (req,res)=>{
    console.log("Get bedrijven")
    connection.query('SELECT * FROM bedrijf', (error, results, fields) =>{
        res.json(results)
    });
})


app.post("/api/addbedrijf",(req,res)=>{
    var data=req.body
    console.log("posting:")
    connection.query("INSERT INTO bedrijf (name, phone, loc, pass, img_link) VALUES (?,?,?,?,?)",[data.name,data.phone,data.loc,data.pass,data.img_link], (error,results, fields)=>{
        console.log(error)
        if (error) {
            res.status(422)
            res.json({message:error});
        }else{
            res.send("Done!")
        }
    })


})

// Zend een POST request dat de data uit de front-end in de database krijgt.
app.post("/api/addgebruiker", (req, res) => {
    var data = req.body;
    console.log("posting:");
    connection.query("INSERT INTO gebruiker (firstName, lastName, email, pass, phone, birth, img_link) VALUES (?,?,?,?,?,?,?)",[data.firstName, data.lastName, data.email, data.pass, data.phone, data.birth, data.img_link],
        (error, results, fields) => {console.log(error);
        if (error) {
            res.status(422);
            res.json({message:error});
        }else{
            res.send("Done!")
        }
    });
});

app.listen(5000,()=> {
    console.log("listening")
})