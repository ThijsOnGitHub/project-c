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

app.get("/get",auth,(req,res)=>{
    console.log("get rooster")
    console.log(req.user.isWerkgever)
    if(req.user.isWerkgever){
        console.log('werkgever queary')
        connection.query("select rI.*,CONCAT(firstName,' ',lastName) as naam,itemId from gebruiker join roosterItems rI on gebruiker.id = rI.userId where roosterId=(select roosterId from gebruiker where id=?)",[req.user.id],(err,values)=>{
            if(err){
                res.status(500).send(err)
            }else{
                console.log(newValues)
                var newValues=values.map(value => {
                    value.beginTijd=`1899-12-31T${value.beginTijd}.000`;
                    value.eindTijd=`1899-12-31T${value.eindTijd}.000`;
                    return value
                });
                res.status(200).json(newValues)
            }
        })
    }else{
        console.log("get agenda from user: "+req.user.id);
        connection.query("SELECT datum,beginTijd,eindTijd,userId,CONCAT(firstName,' ',lastname) as naam,itemId FROM roosterItems join gebruiker g on roosterItems.userId = g.id where userId=?",[req.user.id,req.user.id],(err,values)=>{
            //Hier worden de tijden omgezet in javascript format zodat ze tot DATE object kunnen worden gemaakt
            if(err){
                res.status(500).send(err)
            }else{
                var newValues=values.map(value => {
                    value.beginTijd=`1899-12-31T${value.beginTijd}.000`;
                    value.eindTijd=`1899-12-31T${value.eindTijd}.000`;
                    return value
                });
                res.json(newValues)
            }
        })
    }
});

module.exports=app