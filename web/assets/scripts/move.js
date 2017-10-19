/**
    PARTIE TOUCH
    https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
*/
window.onload = function(){

    let svg = document.getElementById('legosvg');
    if(window.innerWidth< 650){
        svg.width=window.innerWidth;
    }else{
        svg.height=window.innerHeight;
    }
    svg.style.visibility='visible';


    // Get a reference to our touch-sensitive element
    var legosvdoc = document.getElementById("legosvg").contentDocument;
    var ztBody = new ZingTouch.Region(document.body);
    // Récupération des items du lego
    var move_head = legosvdoc.getElementById("move_head");
    var move_right = legosvdoc.getElementById("move_right");
    var move_left = legosvdoc.getElementById("move_left");


    console.log(move_head,move_right,move_left);
    ztBody.bind(move_head, 'tap', function(e){
        console.log('tap');
    }, false);
    ztBody.bind(move_right, 'tap', function(e){
        console.log('tap');
    }, false);

    var customPan = new ZingTouch.Pan({
        //threshold: 5
    });
    var startPan = customPan.start;
    customPan.start = function (inputs) {
        console.log("pan start");
        return startPan.call(this, inputs);
    }
    var endPan = customPan.end;
    customPan.end = function (inputs) {
        console.log("pan end");
        return endPan.call(this, inputs);
    }
    ztBody.bind(move_left, 'pan', function (event) {
        let distance = event.detail.data[0].distanceFromOrigin;
        let direction = event.detail.data[0].directionFromOrigin;
        //mqttPublish(this.imtopic,{'origin':'im-web'});
        console.log(distance, direction);
    }, false);

}
/*
function doMove(event) {
    event.preventDefault();
    mqttPublish(this.imtopic, {
        'origin': 'im-web'
    });
    console.log(this.imtopic, event.type, event.timeStamp);
}
*/