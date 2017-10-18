let cpt = 0;
let upWay = true;

let MOVE_LEFT_ARM = "leftarm/next";
let MOVE_RIGHT_ARM = "rightarm/next";
let MOVE_LEFT_HAND = "lefthand/next";
let MOVE_RIGHT_HAND = "righthand/next";
let MOVE_HEAD = "head/next";
let NEXT_HELMET ="helmet/next"
let LIGHT_EYES = "eyes/light";
let LIGHT_ENERGY = "energy/beat";

let move;

/**
    PARTIE TOUCH
*/
// Get a reference to our touch-sensitive element
var legosvg = document.getElementById("legosvg");

legosvg.addEventListener("load",function(){

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

    left_arm.addEventListener("touchstart", leftArmStartHandler, false);
    left_arm.addEventListener("mousedown", leftArmStartHandler, false);


    right_arm.addEventListener("touchstart", rightArmStartHandler, false);
    right_arm.addEventListener("mousedown", rightArmStartHandler, false);

    left_hand.addEventListener("touchstart", leftHandStartHandler, false);
    left_hand.addEventListener("mousedown", leftHandStartHandler, false);

    right_hand.addEventListener("touchstart", rightHandStartHandler, false);
    right_hand.addEventListener("mousedown", rightHandStartHandler, false);

    head.addEventListener("touchstart", headStartHandler, false);
    head.addEventListener("mousedown", headStartHandler, false);

    helmet.addEventListener("touchstart", helmetStartHandler, false);
    helmet.addEventListener("mousedown", helmetStartHandler, false);
}, false);


function leftArmStartHandler(event) {
    event.preventDefault();
    console.log('je suis dans leftArmStartHandler');
    doEmitSocket(MOVE_LEFT_ARM, 'iron man lève le bras gauche');
}

function rightArmStartHandler(event) {
    event.preventDefault();
    console.log('je suis dans rightArmStartHandler');
    doEmitSocket(MOVE_RIGHT_ARM, 'iron man lève le bras droit');
}

function leftHandStartHandler(event) {
    event.preventDefault();
    console.log('je suis dans leftHandStartHandler');
    doEmitSocket(MOVE_LEFT_HAND, 'iron man tourne la main gauche');
}

function rightHandStartHandler(event) {
    event.preventDefault();
    console.log('je suis dans rightHandStartHandler');
    doEmitSocket(MOVE_RIGHT_HAND, 'iron man tourne la main droite');
}

function headStartHandler(event) {
    event.preventDefault();
    console.log('je suis dans headStartHandler');
    doEmitSocket(MOVE_HEAD, 'iron man tourne la tête');
}

function helmetStartHandler(event) {
    event.preventDefault();
    console.log('je suis dans helmetStartHandler');
    doEmitSocket(NEXT_HELMET, 'iron man ta visière');
}