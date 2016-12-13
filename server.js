var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var request = require('request');
var db = require('mssql');

var parser = bodyParser.urlencoded({
    extended: true
});

var config = {
    user : 'Roman',
    password : 'Amor2303',
    server : "emojoserver.database.windows.net",
    database : 'EmojoDB',    
    
    options : {
        encrypt : true
    }
}

db.connect(config).then(function(){
    console.log('Connected EmojoDB');
})

app.listen(process.env.PORT || 8080, function () {
    console.log('Express server is listening on port 80');
});

app.get('/', function(req, res){
    res.send("emojo server is running")
})

app.get('/db/query', parser, function(req,res){
    var app_id = req.query.appId;
    var sql = req.query.sql;
    
    if (app_id != "qwertyuiop"){
        res.json({error : "access denied"})
    } else {
        console.log(sql);
        new db.Request().query(sql).then(function(recordset){
            res.json(recordset);    
        }).catch(function(err){
            console.log(err);
            res.json({error : "incorrect query"});
        });
    }
});

Array<string> authenticatedList = {};

app.get('/auth', parser, function(req, res){    
    
    console.log('/auth started');
    var CODE = req.query.code;
    var clientId = req.query.client;
    var clientSecret = req.query.secret;
    console.log(req);
    
    request.post("https://api.instagram.com/oauth/access_token",
        { form : {
            client_id : clientId,
            client_secret : clientSecret,
            grant_type : 'authorization_code',
            redirect_uri : 'https://emojo.azurewebsites.new/auth',
            code : CODE}},
        function(err,response,body){
            console.log(body);
            if (!err && response.statusCode==200){
                authenticated = true;                
                res.send(body.access_token);
            } else {
                res.send(body.error_message);
            }
        });
});