var j5 = require("johnny-five");
var myBoard, pir, led;

myBoard = new j5.Board();

myBoard.on("ready", function() {

    pir = new j5.Pir({pin: 9});
    led = new j5.Led(13);
    pir.on('motionstart', function() {
      led.on();
    });
    pir.on('motionend', function() {
      led.off();
    });

  this.repl.inject({
  	pir: pir,
    led: led
  });
  console.log("You can interact with the RGB LED via the variable 'led' e.g. led.on();\n Hit control-D to exit.\n >> ");
});
