#include<SPI.h>
#include<Ethernet.h>
#include<EEPROM.h>

byte mac[] = {0xAA,0xBB,0xCC,0xDD,0xEE,0xFF};
boolean datosCompletos = false;
int ipin[4];
EthernetServer *server; //puntero que guardara la direccion de memoria del servidor
EthernetClient cliente;
String buffer;

void setup(){
  Serial.begin(9600);
  while(!Serial){}
  IPAddress ip(EEPROM.read(0),EEPROM.read(1),EEPROM.read(2),EEPROM.read(3));
  delay(2000);
  if(EEPROM.read(5) == 'x'){
    EthernetServer servidor(EEPROM.read(4));
    *server = servidor;
  }else{
    if(EEPROM.read(6) == 'z'){
      EthernetServer servidor(getPortZero());
      *server = servidor;
    }else{
      EthernetServer servidor(getPuerto());
      *server = servidor;
    }
  }
  Ethernet.begin(mac,ip);
}

void loop(){
  if(Serial.available() > 0 ){
    int cmdInicio = Serial.parseInt();
    if(cmdInicio == 2){
      char op = Serial.read();
      switch(op){
        case 'a':
                configIP();
                break;
        case 'b':
                configPort();
                break;        
      }
    }
  }
  
  if(datosCompletos){
    Serial.println("maestro: datos grabados satisfactoriamente");
    for(int i = 0; i<4; i++){
      if(i < 3){
        Serial.print(EEPROM.read(i));
        Serial.print('.');
      }else{
        Serial.print(EEPROM.read(i));
        Serial.println();
      }
    }
    delay(1000);
    datosCompletos = false;
  }
  
  procesarDatosEthernet();
    
}

void procesarDatosEthernet(){
  EthernetServer servidor = *server;
  cliente = servidor.available();
  if(cliente){
    Serial.println("cliente conectado");
    char c = cliente.read(); //leo cada uno de los caractares enviando por el cliente en el request
    buffer.concat(c);
    if(c == '\n'){
       Serial.println(buffer);
    }
  }else{

  }
  
}

void configIP(){
  for(int i=0; i<4; i++){
    EEPROM.write(i,Serial.parseInt());
  }
  int cmdFin = Serial.parseInt();
  if(cmdFin == 3){
    datosCompletos = true;
  }
}

void configPort(){
  int port = Serial.parseInt();
  if(port > 255){
    procesarPuerto(port);
  }else{
    EEPROM.write(4,port);
    EEPROM.write(5,'x');
    EEPROM.write(6,'n');
    Serial.println("maestro: correctamente configurado en el puerto:");
    Serial.println(port);
  }
}

void procesarPuerto(int p){
  String port = "";
  String cad1,cad2;
  int num1,num2;
  char number;
  port.concat(p);
  cad1 = port.substring(0,2);
  cad2 = port.substring(2,port.length());
  if(cad2.charAt(0) == '0' && cad2.length() > 1){
    num1 = cad1.toInt();
    number = cad2.charAt(1);
    EEPROM.write(4,num1);
    EEPROM.write(5,number);
    EEPROM.write(6,'z');
    Serial.println("maestro: correctamente configurado en el puerto: ");
    Serial.println(getPortZero());
  }else{
    num1 = cad1.toInt();
    num2 = cad2.toInt();
    EEPROM.write(4,num1);
    EEPROM.write(5,num2);
    EEPROM.write(6,'n');
    Serial.println("maestro: correctamente configurado en el puerto: ");
    Serial.println(getPuerto());
  }
}

int getPuerto(){
  String port = "";
  port.concat(EEPROM.read(4));
  port.concat(EEPROM.read(5));
  return port.toInt();
}

int getPortZero(){
  String cad = "";
  char number = EEPROM.read(5);
  cad.concat(EEPROM.read(4));
  cad.concat("0");
  cad.concat(number);
  return cad.toInt();
}



