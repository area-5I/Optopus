var express = require('express');
var nunjucks = require('nunjucks');
var serialManager = require('./modelo/serialManager.js')
var socketio = require('socket.io').listen(8081);

var app = express();

socketio.sockets.on("connection", function(socket){

  socket.on("openPort", function(puerto){
    serialManager.abrirPuerto(puerto,9600);
  });

  socket.on("closePort", function(){
    serialManager.cerrarPuerto();
  });

  socket.on("puertoAbierto", function(){
    socketio.sockets.emit("portSuccess");
  });

  socket.on("errorDeApertura", function(){
    socketio.sockets.emit("errorOpen");
  });

  socket.on("errorEnOperacion", function(){
    socketio.sockets.emit("errorOP");
  });

  socket.on("cerradoCorrectamente",function(){
    socketio.sockets.emit("puertoCerrado");
  });

  socket.on("llegaronDatos", function(datos){
    socketio.sockets.emit('datoSerial', datos);
  });

  socket.on("grabarDispIP", function(ip,puerto){
    serialManager.grabarDispIP(ip,puerto);
  });

  socket.on("abraElPuerto",function(){
    socketio.sockets.emit("firstOpen");
  });


});

nunjucks.configure(__dirname + "/vista",{
  express: app
});

app.use(express.static(__dirname + "/vista"));

app.get("/",function(req,res){
  res.render("index.html");
});

app.get("/master",function(req,res){
  var puertos = serialManager.listarPuertos();
  setTimeout(function(){
    console.log(puertos);
    res.render("master.html",{
      ports: puertos
    });
  },1000);
});

app.get("/slave",function(req,res){
  var puertos = serialManager.listarPuertos();
  setTimeout(function(){
    console.log(puertos);
    res.render("slave.html",{
      ports: puertos
    });
  },1000);
});

console.log("optopus server run localhost:8085")

app.listen(8085);
