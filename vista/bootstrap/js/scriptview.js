var socket = io.connect('http://localhost:8081');
var ipstr;

socket.on('datoSerial', function(datos){
  writeBuffer(datos);
});

socket.on('portSuccess',function(){
  confirmarApertura();
});

socket.on('puertoCerrado',function(){
  confirmarCierre();
});

socket.on('errorOP',function(){
  writeBuffer("error: fatal");
});

socket.on('firstOpen',function(){
  writeBuffer("error: primero abra el puerto");
});


socket.on('errorOpen',function(){
  writeBuffer("error: no se pudo abrir el puerto seleccionado");
});

function dispGSM(){
  var ethernet = document.getElementById("dispIP");
  var gsm = document.getElementById("dispGSM");
  var buttonEthernet = document.getElementById("grabarDispIP");
  var buttonGSM = document.getElementById("grabarDispGSM");
  ethernet.style.display = 'none';
  buttonEthernet.style.display = 'none';
  gsm.style.display = 'block';
  buttonGSM.style.display = 'block';
}

function dispIP(){
  var ethernet = document.getElementById("dispIP");
  var gsm = document.getElementById("dispGSM");
  var buttonEthernet = document.getElementById("grabarDispIP");
  var buttonGSM = document.getElementById("grabarDispGSM");
  gsm.style.display = 'none';
  buttonGSM.style.display = 'none';
  ethernet.style.display = 'block';
  buttonEthernet.style.display = 'block';

}

function abrirPuerto(){
  var puerto = document.getElementById("selector").value;
  socket.emit("openPort",puerto);
};

function cerrarPuerto(){
  socket.emit("closePort");
}

function writeBuffer(data){
  var buffer = document.getElementById("buffer");
  var datosAnt = buffer.placeholder;
  buffer.placeholder = datosAnt +"\n"+ data;
}

function grabarDispIP(){
  var ip = document.getElementById("ip").value;
  var puerto = document.getElementById("port").value;
  if(puerto > 9999 || puerto < 2 ){
    alert("Ingrese un puerto valido menor a 9999 y mayor a 1,tenga en cuenta que algunos puertos aunque sean validados no funcionan como es el caso de los puertos 666, 9999 y muchos otros mas.");
  }else{
    procesarIP(ip);
    setTimeout(function(){
      socket.emit("grabarDispIP", ipstr, puerto);
    },10);
  }
}

function confirmarApertura(){
  var puerto = document.getElementById("selector").value;
  var button = document.getElementById("open");

  writeBuffer("Puerto: " + puerto + " abierto");
  button.className = "btn btn-danger";
  button.setAttribute("onclick","cerrarPuerto()");
  button.innerHTML = button.innerHTML.replace('Abrir Puerto','Cerrar Puerto');
}

function confirmarCierre(){
  var puerto = document.getElementById("selector").value;
  var button = document.getElementById("open");

  writeBuffer("Puerto: " + puerto + " cerrado");
  button.className = "btn btn-success";
  button.setAttribute("onclick","abrirPuerto()");
  button.innerHTML = button.innerHTML.replace('Cerrar Puerto','Abrir Puerto');
}

function limpiarBuffer(){
  var buffer = document.getElementById("buffer");
  buffer.placeholder = "Datos Seriales:";

}

function procesarIP(ip){
  var res = "";
  for(var i = 0;i<ip.length;i++){
    var char = ip.charAt(i);
    if(char != '.'){
      res = res + char;
    }else{
      res = res + " ";
    }
  }
  setTimeout(function(){
    ipstr = res;
  },10);
}
