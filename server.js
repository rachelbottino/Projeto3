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
    password : '123456',
    database : 'projeto3'
})

// esse é o mapeamento mais basico
app.get('/', function (req, res) {
    res.sendFile('views/index.html' , { root : __dirname});
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
    //low_carb: req.body.food,
    //vegano : req.body.food,
    //vegetariano : req.body.food,
    //sem_glutem : req.body.food,
    //sem_lactose : req.body.food,
    //cross_fit : req.body.activ,
    //esporte_coletivo : req.body.activ,
    //esporte_aventura : req.body.activ,
    //luta : req.body.activ,
    //yoga : req.body.activ
}; 

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