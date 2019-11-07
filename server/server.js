const express = require('express');
const cors= require('cors');
serverLogin=require('./serverlogin');
const cookieParser = require('cookie-parser')

serverSecret=require('./serverSecret');

authRoute=require('./routes/authRoute')
apiRoute=require("./routes/apiRoute")




var app = express();
app.use(cors({origin:"http://localhost:3000",credentials:true}));
app.use(express.json());
app.use(cookieParser())



app.use("/api",apiRoute)
app.use("/auth",authRoute)


/*
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
                var sessionToken=jwt.sign(payLoad, serverSecret.serverSecret.sessionSecret,{expiresIn:"10s"});
                var refeshToken=jwt.sign(payLoad,serverSecret.serverSecret.refreshSecret)
                res.status(200).json({sessionToken:token})
            }else{
                res.status(401).send("Not valid")
            }
}))
    })});

 */

app.listen(5000,()=> {
    console.log("listening")

});