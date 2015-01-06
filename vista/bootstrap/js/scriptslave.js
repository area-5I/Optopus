var sock = io.connect('http://localhost:8081');

sock.on('datoSerial', function(datos){
  writeBuffer(datos);
});

sock.on('portSuccess',function(){
  confirmarApertura();
});

sock.on('puertoCerrado',function(){
  confirmarCierre();
});

sock.on('errorOP',function(){
  writeBuffer("error: fatal");
});

sock.on('firstOpen',function(){
  writeBuffer("error: primero abra el puerto");
});

sock.on('errorOpen',function(){
  writeBuffer("error: no se pudo abrir el puerto seleccionado");
});

function abrirPuerto(){
  var puerto = document.getElementById("select").value;
  sock.emit("openPort",puerto);
};

function cerrarPuerto(){
  sock.emit("closePort");
}

function writeBuffer(data){
  var buffer = document.getElementById("buff");
  var datosAnt = buffer.placeholder;
  buffer.placeholder = datosAnt +"\n"+ data;
}

function confirmarApertura(){
  var puerto = document.getElementById("select").value;
  var button = document.getElementById("abrir");

  writeBuffer("Puerto: " + puerto + " abierto");
  button.className = "btn btn-danger";
  button.setAttribute("onclick","cerrarPuerto()");
  button.innerHTML = button.innerHTML.replace('Abrir Puerto','Cerrar Puerto');
}

function confirmarCierre(){
  var puerto = document.getElementById("select").value;
  var button = document.getElementById("abrir");

  writeBuffer("Puerto: " + puerto + " cerrado");
  button.className = "btn btn-success";
  button.setAttribute("onclick","abrirPuerto()");
  button.innerHTML = button.innerHTML.replace('Cerrar Puerto','Abrir Puerto');
}

function limpiarBuffer(){
  var buffer = document.getElementById("buff");
  buffer.placeholder = "Datos Seriales:";

}

function grabarIDSlave(){
  var id = document.getElementById("idSlave").value;
  sock.emit("grabarIDSlave",id);
}
