let UP = "up";
let RIGHT = "right";
let LEFT = "left";

/**
    PARTIE TOUCH
    https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
*/
window.onload = function () {
    // Get a reference to our touch-sensitive element
    var legosvdoc = document.getElementById("legosvg");
    var ztBody = new ZingTouch.Region(document.body);
    // Récupération des items du lego
    var move_head = legosvdoc.getElementById("move_head");
    move_head.panzone = UP;
    var move_right = legosvdoc.getElementById("move_right");
    move_right.panzone = RIGHT;
    var move_left = legosvdoc.getElementById("move_left");
    move_left.panzone = LEFT;
    var customPan = new ZingTouch.Pan({
        threshold: 2
    });
    var startPan = customPan.start;
    customPan.start = function (inputs) {
        console.log("pan start", inputs[0]); //.initial.originalEvent
        return startPan.call(this, inputs);
    }
    var endPan = customPan.end;
    customPan.end = function (inputs) {
        console.log("pan end", inputs[0].initial.originalEvent.path[1]);
        return endPan.call(this, inputs);
    }
    ztBody.bind(move_left, customPan, function (event) {
        doMove(event);
    }, false);
    ztBody.bind(move_right, customPan, function (event) {
        doMove(event);
    }, false);
    ztBody.bind(move_head, customPan, function (event) {
        doMove(event);
    }, false);

}

function doMove(event) {
    let distance = event.detail.data[0].distanceFromOrigin;
    let direction = event.detail.data[0].directionFromOrigin;

    //mqttPublish(this.imtopic,{'origin':'im-web'});

    //straight down is 270deg while straight left is 180deg).
    let x = Math.cos(direction * Math.PI / 180) * distance;
    let y = Math.sin(direction * Math.PI / 180) * distance;
    // -range to range -> -1 to 1 -> 0 to 2 -> 0 to 100 %
    let range = 150;
    let xpos = Math.round((Math.min(Math.max(x, -range), range) / range + 1) * 50);
    let ypos = Math.round((Math.min(Math.max(y, -range), range) / range + 1) * 50);

    console.log(event.srcElement.panzone, xpos, ypos);
    let topicX="lefthand/set";
    let topicY="leftarm/set";
    if (event.srcElement.panzone == 'left') {
        topicX="lefthand/set";
        topicY="leftarm/set";
    } else if (event.srcElement.panzone == 'right') {
        topicX="righthand/set";
        topicY="rightarm/set";
    } else if (event.srcElement.panzone == 'up') {
        topicX="head/set";
        topicY="helmet/set";
    }
    //event.preventDefault();
    mqttPublish(topicX, {'origin': 'im-web','absPosition':xpos});
    mqttPublish(topicY, {'origin': 'im-web','absPosition':ypos});
    // console.log(this.imtopic, event.type, event.timeStamp);
}