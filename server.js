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
    password : 'adgjlra1',
    database : 'projeto3'
})

// esse é o mapeamento mais basico
app.get('/', function (req, res) {
    res.sendFile('views/home.html' , { root : __dirname});
 });

app.get('/login', function (req, res) {
    res.sendFile('views/login.html' , { root : __dirname});
 });

app.get('/signup', function(req, res) {
  res.sendFile('views/cadastro.html' , { root : __dirname});
 });

app.post('/signup', function(req, res) {
    var new_user = {
    foto: req.body.photo,
    nome : req.body.name,
    email : req.body.email,
    senha : req.body.password,
    nascimento: req.body.birthdate,
    endereco: req.body.address,
    telefone: req.body.phone,
    pref_contato: req.body.contact,
    low_carb: req.body.low_carb,
    vegano : req.body.vegano,
    vegetariano : req.body.vegetariano,
    sem_glutem : req.body.sem_glutem,
    sem_lactose : req.body.sem_lactose,
    cross_fit : req.body.cross_fit,
    esporte_coletivo : req.body.esporte_coletivo,
    esporte_aventura : req.body.esporte_aventura,
    luta : req.body.luta,
    yoga : req.body.yoga
}; 
console.log(new_user);
 connection.query("INSERT INTO usuario SET ?", new_user, function (error, results, fields) {	
    		if (error) throw error;
    		res.redirect('/');
  });
});


//start Server
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!')
})
;