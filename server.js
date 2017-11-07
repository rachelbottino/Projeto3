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
        password : 'adgjlra123',
        database : 'projeto3',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

// esse é o mapeamento mais basico
app.get('/',function(req,res){
    res.sendFile('views/index.html', {root: __dirname })
});

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);

});