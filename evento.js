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
    password : 'rangobom971025',
    database : 'projeto3'
});


// esse é o mapeamento mais basico
app.get('/',function(req,res){
    res.send('HELPPPPPP');
});


// esse é o mapeamento mais basico
// app.get('/eventos', function (req, res) {
//     res.sendFile('views/eventos.html' , { root : __dirname});
//  });

app.get('/criar', function (req, res) {
    res.sendFile('views/criar.html' , { root : __dirname});
 });

app.post('/criar', function(req, res) {
    var new_evento = {
    	nome:req.body.nome,
        descricao:req.body.descricao,
        data:req.body.data,
        local:req.body.local,
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

console.log(new_evento);
 connection.query("INSERT INTO evento SET ?", new_evento, function (error, results, fields) {	
    		if (error) throw error;
    		res.redirect('/');
  });
});




app.get('/modificar', function (req, res) {
    res.sendFile('views/modevento.html' , { root : __dirname});
 });

app.post('/modificar', function(req, res) {
    var new_evento = {
    	nome:req.body.nome,
        descricao:req.body.descricao,
        data:req.body.data,
        local:req.body.local,
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

console.log(new_evento);
 connection.query("INSERT INTO evento SET ?", new_evento, function (error, results, fields) {	
    		if (error) throw error;
    		res.redirect('/');
  });
});



app.post('/modificar', function(req, res) {
    var new_evento = {
    	nome:req.body.nome,
        descricao:req.body.descricao,
        data:req.body.data,
        local:req.body.local,
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

console.log(new_evento);
 connection.query("INSERT INTO evento SET ?", new_evento, function (error, results, fields) {	
    		if (error) throw error;
    		res.redirect('/');
  });
});


//start Server
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!')
})
;

