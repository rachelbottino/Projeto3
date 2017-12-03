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
var interesses = [];
var interesses_evento = [];
var interesses_usuario = [];
var usuarios = [];
var user_id;
var filtro;
/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());
app.use(fileUpload());

/*MySql connection*/
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'adgjlra1',
    database : 'projeto3'
})

// esse é o mapeamento mais basico
app.get('/', function (req, res) {
    res.sendFile('views/login.html' , { root : __dirname});
 });

app.get('/login', function (req, res) {
    res.sendFile('views/login.html' , { root : __dirname});
 });

app.get('/signup', function(req, res) {
    res.sendFile('views/cadastra.html' , { root : __dirname});
 });

app.get('/perfil', function(req, res) {
    console.log(user_id);
    console.log(alimentar);
    console.log(atividades);
    connection.query('SELECT * FROM usuario WHERE usuario_id = ?',[user_id], function (error, results, fields) {
        if (error) throw error;
        console.log('usuario: ', results);
        //faz lista de habitos alimentares
        if(results[0].low_carb == 's'){
            alimentar.push("Low Carb");
            interesses.push("low_carb");
        }
        if(results[0].vegano == 's'){
            alimentar.push("Vegana");
            interesses.push("vegano");
        }
        if(results[0].vegetariano == 's'){
            alimentar.push("Vegetariana");
            interesses.push("vegetariano");
        }
        if(results[0].sem_glutem == 's'){
            alimentar.push("Sem Glúten");
            interesses.push("sem_glutem");
        }
        if(results[0].sem_lactose == 's'){
            alimentar.push("Sem Lactose");
            interesses.push("sem_lactose");
        }

        //faz lista de atividades físicas
        if(results[0].cross_fit == 's'){
            atividades.push("Cross Fit");
            interesses.push("cross_fit");
        }
        if(results[0].esporte_coletivo == 's'){
            atividades.push("Esportes Coletivos");
            interesses.push("esporte_coletivo");
        }
        if(results[0].esporte_aventura == 's'){
            atividades.push("Esportes de Aventura");
            interesses.push("esporte_aventura");
        }
        if(results[0].luta == 's'){
            atividades.push("Luta");
            interesses.push("luta");
        }
        if(results[0].yoga == 's'){
            atividades.push("Yoga");
            interesses.push("yoga");
        }
        res.render('home', {data:results, lista_alimentar:alimentar, lista_atividade:atividades});
        alimentar = [];
        atividades = [];
    });
    
});

app.get('/novo_evento', function (req, res) {
    res.sendFile('views/cria_evento.html' , { root : __dirname});
 });

app.get('/seus_eventos', function (req, res){
    console.log("Na pagina seus eventos...");
    console.log("Id do usuario:");
    console.log(user_id);
    console.log(interesses);
    connection.query('SELECT * FROM evento WHERE usuario_id = ?',[user_id], function (error, events, fields) {
        if (error) throw error;
        console.log('Eventos pelo id do usuario: ', events);            
        console.log("Quantidade de eventos do usuario:");
        console.log(events.length);
        res.render('events', {events:events});
    });

});

app.get('/usuarios', function (req, res){
    console.log("Na pagina lista usuarios...");
    filtro = req.body.filtro;
    console.log(filtro);
    connection.query('SELECT * FROM usuario WHERE usuario_id != ?',[user_id], function (error, users, fields) {
        if (error) throw error;            
        console.log("Quantidade de usuario:");
        console.log(users.length);
        console.log(users);
        res.render('list_users', {users:users});
    });
});


app.get('/eventos', function (req, res){
    console.log("Na pagina lista eventos...");
    connection.query('SELECT * FROM evento WHERE usuario_id != ?',[user_id], function (error, events, fields) {
        if (error) throw error;            
        console.log("Quantidade de eventos de outros usuarios:");
        console.log(events.length);
        console.log(events);
        res.render('list_events', {events:events});
    });
});

app.post('/signup', function(req, res) {

    message = '';
   if(req.method == "POST"){


        var file = req.files.foto;
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
    var email = req.body.email;
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
                    //guarda id do usuario logado
                    user_id = results[0].usuario_id;
                    res.redirect('/perfil');
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
    console.log(alimentar);
});


app.post('/eventos', function(req, res){
    console.log(interesses);

});

app.post('/novo_evento', function(req, res) {
    console.log("novo evento usuario id:");
    console.log(user_id);

    var file = req.files.foto;
    var img_name=file.name;

    var new_evento = {
        foto: img_name,
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
        yoga : req.body.yoga,
        usuario_id : user_id


};

 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ||file.mimetype == "image/jpg"){
                                 
              file.mv('public/'+file.name, function(error) {
                             
                  if (error)

                    return res.status(500).send(error);

                connection.query("INSERT INTO evento SET ?", new_evento, function (error, results, fields) {   
                    if (error) throw error;
                    res.redirect('/seus_eventos');
                });
                       });
          } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.sendFile('views/signup.html' , { root : __dirname}, {message: message});
          }


console.log(new_evento);

});

//start Server
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000!')
})
;