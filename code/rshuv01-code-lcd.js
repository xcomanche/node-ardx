var j5 = require("johnny-five");
var myBoard, lcd;

myBoard = new j5.Board();

myBoard.on("ready", function() {

    lcd = new j5.LCD({pins: [8, 9, 4, 5, 6, 7]});

    myBoard.digitalWrite(10, 1);
    setTimeout(function() {
        lcd.clear().cursor(0, 0);
        lcd.clear().print("Authorise");
        lcd.cursor(1, 0);
        lcd.print("your self");
        //printSeconds.call(this);
        //printString('This is very long text to display on the our small screen!', 400);
    }, 50);

  this.repl.inject({
  	lcd: lcd,
    board: myBoard
  });
  console.log("You can interact with the RGB LED via the variable 'led' e.g. led.on();\n Hit control-D to exit.\n >> ");
});

function printSeconds() {
    var i = 0;
    setInterval(function () {

        i += 1;
        lcd.cursor(1, 9);
        lcd.print(i);

    }, 100);
}

function printString(string, speed) {

    var position = 0;
    var screenWidth = 16;
    var diff = 0;
    var emptyDiff = 0;

    if (!speed) {
        speed = 300;
    }

    var interval = setInterval(function() {
        lcd.cursor(0, 0);

        for (var i = position; i < string.length; i ++) {
            if (position + screenWidth <= i) {
                break;
            }
            lcd.print(string[i]);

        }

        diff = string.length - position - screenWidth;

        if (diff < 0) {

            for (var c = 1; c <= Math.abs(diff); c ++) {
                lcd.cursor(0, screenWidth - c);
                lcd.print(' ');
            }
            lcd.cursor(0, 0);
            lcd.print(' ');
        }

        position ++;
        if (position == string.length) {
            clearInterval(interval);
        }
    }, speed);
}
