var five = require("johnny-five");

five.Board().on("ready", function(){
  var sensor = new five.Sensor({pin:2});
  var period = 200;
  sensor.on("data", function(err, rawValue){

    console.log(rawValue);
    sleep(period);
  });
});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}