function dispGSM(){
  var ethernet = document.getElementById("dispIP");
  var gsm = document.getElementById("dispGSM");
  ethernet.style.display = 'none';
  gsm.style.display = 'block';
}

function dispIP(){
  var ethernet = document.getElementById("dispIP");
  var gsm = document.getElementById("dispGSM");
  gsm.style.display = 'none';
  ethernet.style.display = 'block';

}
