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
    password : 'rangobom971025',
    database : 'projeto3'
})

// var redis = require('redis');
// var client = redis.createClient(6379, 'localhost');
 
// app.use(express.session({
//     secret: 'a4f8071f-c873-4447-8ee2',
//     cookie: { maxAge: 2628000000 },
//     store: new (require('express-sessions'))({
//         storage: 'redis',
//         instance: client, // optional 
//         host: 'localhost', // optional 
//         port: 6379, // optional 
//         collection: 'sessions', // optional 
//         expire: 86400 // optional 
//     })
// }));

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

// Listar eventos do usuario
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

app.get('/user/:usuario_id', function(req,res,next){

    var usuario_id = req.params.usuario_id;
    console.log(usuario_id);

     connection.query('SELECT * FROM usuario WHERE usuario_id = ?',[usuario_id], function (error, results, fields)  {

            if(error) throw error;

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

            res.render('list_users',{users:results,lista_alimentar:alimentar, lista_atividade:atividades});
            atividades = [];
            interesses = [];
    }); 

});

app.get('/usuarios', function (req, res){
    connection.query('SELECT * FROM usuario WHERE usuario_id != ?',[user_id], function (error, users, fields)  {
        if (error) throw error;            
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

// Criar usuário
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
        pais : req.body.pais,
        estado : req.body.estado,
        cidade : req.body.cidade,
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

// Login
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

// Criar evento
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
        pais : req.body.pais,
        estado : req.body.estado,
        cidade : req.body.cidade,
        endereco : req.body.endereco,
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

// Update eventos
app.get('/editar_evento/:evento_id', function(req,res,next){

    var evento_id = req.params.evento_id;
    //var evento_id = req.params.evento_id;

    console.log("Editar evento:");
    console.log(evento_id);
    connection.query("SELECT * FROM evento WHERE evento_id = ? ",[evento_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("Evento não encontrado");

            res.render('editar_evento',{title:"Editar evento",data:rows});
            console.log("Termina GET")
    });
});

//U do CRUD -> agora é a mesma coisa do create | PUT
app.post('/editar_evento/:evento_id', function(req,res,next){
    console.log("Inicia PUT");
    var evento_id = req.params.evento_id;
    console.log("Pega ID");
    console.log("ID:");
    console.log(evento_id);

    var file = req.files.foto;
    var img_name=file.name;

    //dados
    var data = {
        foto: img_name,
        nome:req.body.nome,
        descricao:req.body.descricao,
        data:req.body.data,
        pais : req.body.pais,
        estado : req.body.estado,
        cidade : req.body.cidade,
        endereco : req.body.endereco,
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
    
    console.log("Edição:");
    console.log(data);
    //coloca no mysql
    connection.query("UPDATE evento set ? WHERE evento_id = ? ",[data,evento_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
        res.redirect('/seus_eventos');
        //res.sendStatus(200);
        console.log("PUT finalizado");
    });
});

app.delete('/delete_evento/:evento_id', function(req,res,next){

    var evento_id = req.params.evento_id;

    console.log("Deletar evento:");
    console.log(evento_id);
    connection.query("DELETE FROM evento  WHERE evento_id = ? ",[evento_id], function(err, rows){

        if(err){
           console.log(err);
           return next("Mysql error, check your query");
        }

        res.sendStatus(200);
        console.log("Deletado")

    });
        //console.log(query.sql);
});

// Update usuário
app.get('/editar_perfil/:usuario_id', function(req,res,next){
    console.log("Inicia GET")

    var user_id = req.params.usuario_id;
    console.log("Editar perfil:");
    console.log(user_id);

    connection.query("SELECT * FROM usuario WHERE usuario_id = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('editar_perfil',{title:"Editar Perfil",data:rows});
            console.log("Termina GET")
        });

    });

//U do CRUD -> agora é a mesma coisa do create | PUT
app.post('/editar_perfil/:usuario_id', function(req,res,next){
    console.log("Inicia POST")
    var user_id = req.params.usuario_id;
    var file = req.files.foto;
    var img_name= file.name;

    console.log("Editando:")
    console.log(user_id)
    
    var file = req.files.foto;
    var img_name=file.name;

    var edit_user = {

        foto : img_name,
        nome : req.body.name,
        email : req.body.email,
        senha : req.body.password,
        pais : req.body.pais,
        estado : req.body.estado,
        cidade : req.body.cidade,
        endereco : req.body.endereco,
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
    
    console.log("Edição:")

    console.log(edit_user)

    connection.query("UPDATE usuario SET ? WHERE usuario_id = ? ",[edit_user,user_id], function(err, rows){
        
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
            res.redirect('/perfil');
            console.log("Done!")
            });
    });


//start Server
var server = app.listen(3000,function(){
    console.log("Servidor rodando na porta %s",server.address().port);

});
