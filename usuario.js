var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

// tem que mudar para os seus dados
app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'rangobom971025',
        database : 'handout_node_express',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

// esse é o mapeamento mais basico
app.get('/',function(req,res){
    res.send('Oi! Use a url api/user para conseguir ver nossa aplicação : ) ');
});


//RESTful route - lê-se salvador da pátria
var router = express.Router();

// Ajuda a monitorar o que está rolando
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

//criamos a rota
var curut = router.route('/user');

//C do CRUD | POST
curut.post(function(req,res,next){

    //validação
    req.assert('nome','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('senha','Enter a password 6 - 20').len(6,20);
    req.assert('foto','Enter a profile photo 6 - 20').isEmpty();
    req.assert('nascimento','Sua data de nascimento').isDate();
    req.assert('endereco','Seu endereço').len(6,40);
    req.assert('telefone','Seu telefone').len(6,20);
    req.assert('contato','Seu contato').len(6,20);
    req.assert('lowcarb','Selecione se o habito alimentar Low Carb for interessante para voce').len(0,1);
    req.assert('vegano','Selecione se o habito alimentar Vegano for interessante para você').len(0,1);
    req.assert('vegetariano','Selecione se o habito alimentar Vegetariano for interessante para você').len(0,1);
    req.assert('semglutem','Selecione se o habito alimentar sem glútem for interessante para você').len(0,1);
    req.assert('semlactose','Selecione se o habito alimentar sem lactose for interessante para você').len(0,1);
    req.assert('crossfit','Selecione se a pratica de Crossfit for interessante para você').len(0,1);
    req.assert('coletivo','Selecione se a pratica de esportes coletivos for interessante para você').len(0,1);
    req.assert('aventura','Selecione se a pratica de esportes de aventura for interessante para você').len(0,1);
    req.assert('luta','Selecione se a pratica de lutas for interessante para você').len(0,1);
    req.assert('yoga','Selecione se a pratica de yoga for interessante para você').len(0,1);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //pega os dados
    var data = {
        nome:req.body.nome,
        email:req.body.email,
        senha:req.body.senha, 
        foto:req.body.foto,
        nascimento:req.body.nascimento,
        endereco:req.body.endereco,
        telefone:req.body.telefone,
        contato:req.body.contato,
        lowcarb:req.body.lowcarb,
        vegano:req.body.vegano,
        vegetariano:req.body.vegetariano,
        semglutem:req.body.semglutem,
        semlactose:req.body.semlactose,
        crossfit:req.body.crossfit,
        coletivo:req.body.coletivo,
        aventura:req.body.aventura,
        luta:req.body.luta,
        yoga:req.body.yoga
     };

    //insere no mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO usuario set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});


//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3033,function(){

   console.log("Listening to port %s",server.address().port);

});


