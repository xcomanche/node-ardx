var j5      = require("johnny-five");
var zmq     = require('zmq'),
    server  = zmq.socket('push'),
    client  = zmq.socket('pull');
var myBoard,
    devices = [];

server.bindSync('tcp://127.0.0.1:3000');
console.log('Radiostation connected to port 3000');

client.connect('tcp://127.0.0.1:3001');
console.log('Listener connected to port 3001');

myBoard = new j5.Board();

myBoard.on("ready", function() {

    client.on('message', function(resp){
        var responseObj = JSON.parse(resp);

        if (responseObj['init']) {
            initObject(responseObj);
        }

        if (responseObj['command']) {
            commandObject(responseObj);
        }
    });

});

function initObject(responseObj) {
    printObjRecv(responseObj);
    if (responseObj['initObject'] in j5) {
        devices[responseObj['id']] = j5[responseObj['initObject']](responseObj['initParams']);
        initEventListiners(devices[responseObj['id']], responseObj);
        responseObj['status'] = 3;
        response(responseObj);
    } else {
        console.log('ERROR: Such Object DOES NOT EXISTS!');
        console.log('-----------------------');
        responseObj['status'] = 5;
        responseObj['error'] = 'Object does not exist';
        response(responseObj);
    }
}

function initEventListiners(device, responseObj) {
    var events = responseObj['initEvents'];

    if (events.length > 0) {
        events.forEach(function(event) {
            device.on(event, function () {
                console.log('For device: ' + responseObj['id'] + '. Fired event: ' + event + '!');
                responseObj['status'] = 6;
                responseObj['event'] = event;
                response(responseObj);
            });
            console.log('For device: ' + responseObj['id'] + '. Registered event: ' + event + '!');
        });
    }
}

function commandObject(responseObj) {
    responseObj['params'] = (responseObj['params']) ? responseObj['params'] : '';
    printDevRecv(responseObj);

    if (devices[responseObj['id']]) {

        if (devices[responseObj['id']][responseObj['command']]) {
            devices[responseObj['id']][responseObj['command']].apply(devices[responseObj['id']],
                parseDevParams(responseObj['params']));
            responseObj['status'] = 3;
            response(responseObj);
        } else {
            console.log('ERROR: DEVICE: ' + responseObj['id']
            + ' DOES NOT HAVE COMMAND: '  + responseObj['command']);
            console.log('-----------------------');
            responseObj['status'] = 5;
            responseObj['error'] = 'Command does not exist';
            response(responseObj);
        }
    } else {
        console.log('ERROR: Device: ' + responseObj['id'] + ' DOES NOT EXISTS!');
        console.log('-----------------------');
        responseObj['status'] = 5;
        responseObj['error'] = 'Device does not exist';
        response(responseObj);
    }
}

function printObjRecv(responseObj) {
    console.log('New Device Initialized!');
    console.log(' - ID: ' + responseObj['id']);
    console.log(' - Object: ' + responseObj['initObject']);
    console.log(' - Params: ' + responseObj['initParams']);
    console.log('-----------------------');
}

function printDevRecv(responseObj) {
    console.log('New Command Received!');
    console.log(' - ID: ' + responseObj['id']);
    console.log(' - Command: ' + responseObj['command']);
    console.log(' - Params: ' + responseObj['params']);
    console.log('-----------------------');
}

function parseDevParams(paramsString) {
    // Split params by '|' delimiter
    return (paramsString.indexOf('|') === -1) ? [paramsString] : paramsString.split('|');
}

function response(response) {
    server.send(JSON.stringify(response))
}

function responseCallBack(ev) {
    server.send(JSON.stringify(ev));
}