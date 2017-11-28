var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');
var fs = require('fs');
var busboy = require("then-busboy");
var fileUpload = require('express-fileupload');
var alimentar = [];
var atividades = [];
var email;
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

app.get('/criar', function (req, res) {
    res.sendFile('views/criar.html' , { root : __dirname});
 });

app.post('/signup', function(req, res) {

    message = '';
   if(req.method == "POST"){

      if (!req.files)
                return res.status(400).send('No files were uploaded.');

        var file = req.files.uploaded_image;
        var img_name=file.name;

    var new_user = {
        foto : img_name,
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

         if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ||file.mimetype == "image/jpg"){
                                 
              file.mv('public/'+file.name, function(error) {
                             
                  if (error)

                    return res.status(500).send(error);

                        connection.query("INSERT INTO usuario SET ?", new_user, function(error, results, fields) {
                            if (error) throw error;
                            res.redirect('/');
                            });
                       });
          } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.sendFile('views/signup.html' , { root : __dirname}, {message: message});
          }
   } else {
      res.redirect('/');
   }
 
});

app.post('/login', function(req, res) {
    email = req.body.email;
    var senha = req.body.senha;

    console.log(email);
    console.log(senha);
    connection.query('SELECT * FROM usuario WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
        console.log("error ocurred",error);
        res.send({
        "code":400,
        "failed":"error ocurred"
        })
        }
        else{
        console.log('The solution is: ', results);
            if(results.length >0){
                if(results[0].senha == senha){
                    console.log({
                    "code":200,
                    "success":"login sucessfull"
                    });
                    //faz lista de habitos alimentares
                    if(results[0].low_carb == 's'){
                        alimentar.push("Low Carb");
                    }
                    else if(results[0].vegano == 's'){
                        alimentar.push("Vegana");
                    }
                    else if(results[0].vegetariano == 's'){
                        alimentar.push("Vegetariana");
                    }
                    else if(results[0].sem_glutem == 's'){
                        alimentar.push("Sem Glúten");
                    }
                    else if(results[0].sem_lactose == 's'){
                        alimentar.push("Sem Lactose");
                    }

                    //faz lista de atividades físicas
                    if(results[0].cross_fit == 's'){
                        atividades.push("Cross Fit");
                    }
                    else if(results[0].esporte_coletivo == 's'){
                        atividades.push("Esportes Coletivos");
                    }
                    else if(results[0].esporte_aventura == 's'){
                        atividades.push("Esportes de Aventura");
                    }
                    else if(results[0].luta == 's'){
                        atividades.push("Luta");
                    }
                    else if(results[0].yoga == 's'){
                        atividades.push("Yoga");
                    }
                    res.render('home', {title:"Habit Matcher",data:results, lista_alimentar:alimentar, lista_atividade:atividades});
                }   
                else{
                    res.send({
                    "code":204,
                    "success":"Email ou senha incorretos"
                    });
                }
            }
            else{
                res.send({
                "code":204,
                "success":"Email não cadastrado"
            });
            }
        }
    });
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

//start Server
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!')
})
;