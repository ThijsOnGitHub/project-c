const express = require('express')
var mysql = require('mysql')
const cors= require('cors')
serverLogin=require('./serverlogin')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

var connection=mysql.createConnection(serverLogin.serverLogin)
connection.connect();
var app = express()


app.use(cors())
app.use(express.json())

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)

)

const users = []



app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



app.get("/api/bedrijf",async (req,res)=>{
    console.log("Get bedrijven")
    connection.query('SELECT * FROM bedrijf', (error, results, fields) =>{
        res.json(results)
    });
})


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

app.post("/api/gebruiker",async (req,res)=>{
    console.log("gebruiker")
    connection.query('SELECT email, pass FROM gebruiker ', (error, results, fields) =>{

        res.json(results)
    });
})

app.get('/', checkAuthenticated, (req, res) => {

    res.render('index.ejs', { name: req.email })

})



app.get('/Home.jsx', checkNotAuthenticated, (req, res) => {



    res.render('home.jsx')

})



app.post('/Home.jsx', checkNotAuthenticated, passport.authenticate('local', {

    successRedirect: '/',

    failureRedirect: '/login',

    failureFlash: true

}))

app.delete('/logout', (req, res) => {

    req.logOut()

    res.redirect('/login')

})



function checkAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {

        return next()

    }

    res.redirect('/Home')

}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(5000,()=> {
    console.log("listening")
})