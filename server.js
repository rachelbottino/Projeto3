var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');

/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'adgjlra123',
    database : 'projeto3'
})

// esse é o mapeamento mais basico
app.get('/home', function (req, res) {
    res.sendFile('views/home.html' , { root : __dirname});
 });

app.get('/login', function (req, res) {
    res.sendFile('views/login.html' , { root : __dirname});
 });

//start Server
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!')
})
;