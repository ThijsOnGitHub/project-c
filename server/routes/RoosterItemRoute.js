const express = require('express');
app=express.Router();
const auth=require("../middleware/verifytoken");
const yourItem=require("../middleware/itemOfWerkgever")
var mysql = require('mysql');
var {serverSecret}=require('../serverSecret');
var connection=mysql.createConnection(serverSecret.databaseLogin);



app.post("/change/:id",[auth,yourItem],(req, res) => {
    console.log(req.body.beginTijd)
    console.log(req.body.eindTijd)
    connection.query("update roosterItems set beginTijd=?,eindTijd=? where itemId=?",[req.body.beginTijd,req.body.eindTijd,req.params.id],(err,values,query)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send("Gelukt!")
        }
    })
})

app.delete("/remove/:id",[auth,yourItem],(req, res) => {
    console.log("Start delete roosterItem")
    connection.query("delete from roosterItems where itemId=? ", [req.params.id], (err, values) => {
        if (err) {
            res.status(500).send(err)
            console.log("Delete Failed")
        } else {
            console.log("Delete Done")
            res.status(200).send("Verwijderen Gelukt")
        }
    })
})

app.post("/get",auth,(req,res)=>{
    console.log("start get rooster")
    console.log(req.body)
    connection.query(`select rI.*,CONCAT(firstName,' ',lastName) as naam,itemId from gebruiker join roosterItems rI on gebruiker.id = rI.userId where ${req.user.isWerkgever? "roosterId=(select roosterId from gebruiker where id=?)" : "gebruiker.id=?" } and (datum >= ?) and (datum <= ?) `,[req.user.id,req.body.beginDatum,req.body.eindDatum],(err,values)=>{
        if(err){
            console.log("get rooster failed")
            res.status(500).send(err)
        }else{
            console.log("get rooster succeed")
            console.log(newValues)
            var newValues=values.map(value => {
                value.beginTijd=`1899-12-31T${value.beginTijd}.000`;
                value.eindTijd=`1899-12-31T${value.eindTijd}.000`;
                return value
            });
            res.status(200).json(newValues)
        }
    })
});

module.exports=app