var express = require('express');
var nunjucks = require('nunjucks');

var app = express();

nunjucks.configure(__dirname + "/vista",{
  express: app
});

app.use(express.static(__dirname + "/vista"));

app.get("/",function(req,res){
  res.render("index.html");
});

console.log("optopus server run localhost:8085")

app.listen(8085);
