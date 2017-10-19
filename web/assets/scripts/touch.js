let cpt = 0;
let upWay = true;

let MOVE_LEFT_ARM = "leftarm/next";
let MOVE_RIGHT_ARM = "rightarm/next";
let MOVE_LEFT_HAND = "lefthand/next";
let MOVE_RIGHT_HAND = "righthand/next";
let MOVE_HEAD = "head/next";
let NEXT_HELMET = "helmet/next"
let LIGHT_EYES = "eyes/light";
let LIGHT_ENERGY = "energy/beat";

let move;

/**
    PARTIE TOUCH
    https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
*/
// Get a reference to our touch-sensitive element
var legosvg = document.getElementById("legosvg");

legosvg.addEventListener("load", function () {
    console.log("legosvg load");
    // Récupération des éléments du SVG
    var svgDoc = legosvg.contentDocument;
    // Récupération des items du lego
    var left_arm = svgDoc.getElementById("left_arm");
    var right_arm = svgDoc.getElementById("right_arm");
    var left_hand = svgDoc.getElementById("left_hand");
    var right_hand = svgDoc.getElementById("right_hand");
    var head = svgDoc.getElementById("head");
    var helmet = svgDoc.getElementById("helmet");


    // Ajout du comportement
    left_arm.imtopic = MOVE_LEFT_ARM;
    left_arm.addEventListener("mousedown", doMove, {capture: true,passive:false});
    left_arm.addEventListener("touchstart", doMove, {capture: true,passive:false});


    right_arm.imtopic = MOVE_RIGHT_ARM;
    right_arm.addEventListener("touchstart", doMove, {capture: true,passive:false});
    right_arm.addEventListener("mousedown", doMove, {capture: true,passive:false});

    left_hand.imtopic = MOVE_LEFT_HAND;
    left_hand.addEventListener("touchstart", doMove, {capture: true,passive:false});
    left_hand.addEventListener("mousedown", doMove, {capture: true,passive:false});

    right_hand.imtopic = MOVE_RIGHT_HAND;
    right_hand.addEventListener("touchstart", doMove, {capture: true,passive:false});
    right_hand.addEventListener("mousedown", doMove, {capture: true,passive:false});

    head.imtopic = MOVE_HEAD;
    head.addEventListener("touchstart", doMove, {capture: true,passive:false});
    head.addEventListener("mousedown", doMove, {capture: true,passive:false});

    helmet.imtopic = NEXT_HELMET;
    helmet.addEventListener("touchstart", doMove, {capture: true,passive:false});
    helmet.addEventListener("mousedown", doMove, {capture: true,passive:false});
}, false);

var lastEvent = 0;

function doMove(event) {
    event.preventDefault();
    /*
    let highlight = this.querySelector("#glow");
    console.log(highlight);
    highlight.fill="#FF0000";
    highlight.filter(function(add) {
        add.gaussianBlur('15')
      })
    //highlight.filter=url('#blur-filter');
    this.querySelector("#border").fill="#FF0000";
    */
    mqttPublish(this.imtopic,{'origin':'im-web'});
    console.log(this.imtopic,event.type,event.timeStamp);
}
