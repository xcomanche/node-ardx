var j5 = require("johnny-five");
var myBoard, pir, led;

myBoard = new j5.Board();

myBoard.on("ready", function() {

    pir = new j5.Pir({pin: 4});
    led = new j5.Led(9);
    sled = new j5.Led(13);
    pir.on('motionstart', function() {
      led.on();
    });
    pir.on('motionend', function() {
      led.off();
    });
    pir.on('calibrated', function() {
        sled.on();
    });

  this.repl.inject({
  	pir: pir,
    led: led
  });

});
