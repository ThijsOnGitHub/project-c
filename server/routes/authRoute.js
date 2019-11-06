const express=require("express")
router=express.Router()
const mysql = require('mysql');
const jwt=require("jsonwebtoken")
const bcrypt = require('bcrypt');
var {serverSecret}=require('../serverSecret');
var connection=mysql.createConnection(serverSecret.databaseLogin);


router.post("/Login", (req,res) => {
    console.log(req.body);
    connection.query("SELECT email,pass,id,verificatie=1 as verificatie FROM gebruiker where email = ?", [req.body.email], (err, values, fields) => {
        console.log(values.length)
        console.log(values)

            if (err || values.length === 0) {
                res.status(401).send("Wachtwoord of E-mail niet geldig")
            } else {
                console.log(values[0].verificatie)
                if (values[0].verificatie) {
                    (bcrypt.compare(req.body.pass, values[0].pass, (err, result) => {
                        if (err) {
                            console.error(err)
                        }
                        console.log(result)
                        if (result) {
                            var payLoad = {id: values[0].id}
                            var sessionToken = jwt.sign(payLoad, serverSecret.sessionSecret, {expiresIn: "5m"});
                            var refreshToken = jwt.sign(payLoad, serverSecret.refreshSecret)
                            connection.query("INSERT INTO authSessions(refreshToken, gebruikerId, tokenCreated) value (?,?,?)", [refreshToken, values[0].id,Date.now()], (err, values, fiels) => {
                                if (err) {
                                    console.log(err)
                                    res.status(502).send(err)
                                } else {
                                    res.status(200).json({sessionToken: sessionToken, refreshToken: refreshToken})
                                }
                            })
                        } else {
                            res.status(401).send("Wachtwoord of E-mail niet geldig")
                        }
                    }))
                } else {
                    res.status(401).send("Mail is niet geverifieerd")
                }
            }

    });

})

router.get("/refresh",(req, res) => {
    connection.query("SELECT *  FROM authSessions WHERE refreshToken=?",[req.header("refreshToken")],(err,values)=>{
        if(err){
            res.status(401).send()
        }
        if(values.length!==0){
            const token=req.header("refreshToken")
            jwt.verify(token,serverSecret.refreshSecret,(err1, decoded) => {
                if(err1){
                    res.status(401).send()
                }else{
                    const authToken=jwt.sign({id:decoded.id},serverSecret.sessionSecret,{expiresIn:"5m"})
                    res.status(200).send(authToken)
                }
            })
        }else{
            res.status(401).send()
        }
    })
})

router.delete("/logout",((req, res) => {
    console.log(req.header("refreshToken"))
    console.log("hello")
    connection.query("DELETE FROM authSessions WHERE `refreshToken` = ? ",[req.header("refreshToken")],(err,values)=>{
        if(err){
            res.status(400).send()
        }else{
            res.status(200).send()
        }
    })

}))

module.exports=router