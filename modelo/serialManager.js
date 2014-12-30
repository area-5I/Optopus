var serialport = require("serialport");
var SerialPort = require("serialport").SerialPort;
var socket = require("socket.io-client")("http://localhost:8081");
var connection;
var puertoActual;

var listarPuertos = function(){
  var puertos = new Array();
  serialport.list(function (err, ports) {
    if(err){
      console.log("error al listar los puertos");
    }else{
      ports.forEach(function(port){
        puertos.push(port.comName);
      });
    }
  });
  return puertos;
}

var resetAndInit = function(puerto,baudios,msg){
  puertoActual = puerto;
  connection = new SerialPort(puerto,{
    baudrate: baudios,
  },false);

  connection.open(function(error){
    if(error){
      console.log("no se pudo abrir el puerto");
      socket.emit('errorEnOperacion');
    }else{
        connection.on("close",function(){
          console.log(msg);
          socket.emit("llegaronDatos",msg);
        });

        connection.on("error",function(){
          console.log("error en la operacion");
          socket.emit('errorEnOperacion');
        });
    }
  });
}

var abrirPuerto = function(puerto,baudios){
  puertoActual = puerto;
  connection = new SerialPort(puerto,{
    baudrate: baudios,
    parser: serialport.parsers.readline('\n')
  },false);

  connection.open(function(error){
    if(error){
      console.log("no se pudo abrir el puerto");
      socket.emit("errorDeApertura");
    }else{
        console.log("puerto abierto");
        socket.emit("puertoAbierto");

        connection.on("data",function(data){
          var datos = "" + data;
          console.log(datos);
          socket.emit('llegaronDatos',datos);
        });

        connection.on("close",function(){
          console.log("puerto cerrado");
          socket.emit('cerradoCorrectamente');
        });

        connection.on("error",function(){
          console.log("error en la operacion");
          socket.emit('errorEnOperacion');
        });

    }
  });

}

function resetLeonardo(){
  resetAndInit(puertoActual,1200,"reseteando el dispositivo...");
  setTimeout(function(){
   cerrarPuerto();
  },100);
  setTimeout(function(){
    initialize();
  },11000);
}

function initialize(){
  resetAndInit(puertoActual,9600,"inicializando el dispositivo...");
  setTimeout(function(){
   cerrarPuerto();
   setTimeout(function(){
    socket.emit("llegaronDatos","OK"); 
   },100);
  },100);
}


var cerrarPuerto = function(){
  connection.close();
  connection = null;
}

var grabarDispIP = function(ip,puerto){
  var cmd1 = "2a "+ip+" 3";
  var cmd2 = "2b "+puerto+" 3";
  var msg1 = "enviando: " + cmd1;
  var msg2 = "enviando: " + cmd2
  if(connection){
    socket.emit('llegaronDatos',msg1);
    connection.write(cmd1 + '\n');
    setTimeout(function(){
      socket.emit('llegaronDatos',msg2);
      connection.write(cmd2 + '\n');
    },700);
    setTimeout(function(){
      cerrarPuerto();
      resetLeonardo();
    },1400);
  }else{
    socket.emit("abraElPuerto");
  }
}

module.exports.listarPuertos = listarPuertos;
module.exports.abrirPuerto = abrirPuerto;
module.exports.cerrarPuerto = cerrarPuerto;
module.exports.grabarDispIP = grabarDispIP;
