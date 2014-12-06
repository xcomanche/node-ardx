var five = require("johnny-five"),
    board, strip;

board = new five.Board();

board.on("ready", function() {

    var strip = new five.Led.Strip({
        pixels: 5, // Number of leds in the strip
        clock: 3, // Clock pin
        data: 2 // Data pin
    });

// Get the pixel at address 10
    var p = strip.pixel(1);

// set pixel 10 to red
    p.color("#FF0000");

// ...OR...

// Get pixel 10, set it to the color blue!
    strip.pixel(0).color("#00FF00");

// What color is pixel 10?
    strip.pixel(2).color(); // outputs the current color...

    this.repl.inject({
        strip: strip
    });

});

