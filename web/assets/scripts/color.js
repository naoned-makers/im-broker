let cpt = 0;
let upWay = true;

let NEXT_LEFT_ARM = "leftarm/next";
let NEXT_RIGHT_ARM = "rightarm/next";
let NEXT_LEFT_HAND = "lefthand/next";
let NEXT_RIGHT_HAND = "righthand/next";
let NEXT_HELMET = "helmet/next"
let COLOR_IM = "im/color";

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
    // Ajout du comportement
    attachMoveTopic(svgDoc.getElementById("left_arm"), NEXT_LEFT_ARM);
    attachMoveTopic(svgDoc.getElementById("right_arm"), NEXT_RIGHT_ARM);
    attachMoveTopic(svgDoc.getElementById("left_hand"), NEXT_LEFT_HAND);
    attachMoveTopic(svgDoc.getElementById("right_hand"), NEXT_RIGHT_HAND);
    attachMoveTopic(svgDoc.getElementById("head"), NEXT_HELMET);
    // attach color mode switch
    svgDoc.getElementById("energy").addEventListener("touchstart", switchColorMode, {capture: true,passive:false});
    svgDoc.getElementById("energy").addEventListener("mousedown", switchColorMode, {capture: true,passive:false});
    // attach color selection
    attachColorTopic(svgDoc.getElementById("blue"), "03a9f5");
    attachColorTopic(svgDoc.getElementById("greenblue"), "009788");
    attachColorTopic(svgDoc.getElementById("green"), "8bc24a");
    attachColorTopic(svgDoc.getElementById("yellow"), "ffeb3c");
    attachColorTopic(svgDoc.getElementById("orange"), "ff9700");
    attachColorTopic(svgDoc.getElementById("red"), "f44236");
    attachColorTopic(svgDoc.getElementById("purple"), "9c28b1");
    attachColorTopic(svgDoc.getElementById("darkpurple"), "3f51b5");


}, false);

function attachMoveTopic(elt,topic){
    elt.imtopic = topic;
    elt.addEventListener("touchstart", doMove, {capture: true,passive:false});
    elt.addEventListener("mousedown", doMove, {capture: true,passive:false});
}

function attachColorTopic(elt,color){
    elt.imcolor = color;
    elt.addEventListener("touchstart", doColor, {capture: true,passive:false});
    elt.addEventListener("mousedown", doColor, {capture: true,passive:false});
}

var globalColorMode = false;
function switchColorMode(event){
    event.preventDefault();
    globalColorMode = !globalColorMode;
    if(globalColorMode){
        legosvg.contentDocument.getElementById("colors").style.display="block";
    }else{
        legosvg.contentDocument.getElementById("colors").style.display= "none";
    }
}

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
    if(globalColorMode){
        console.log("colorMode so dont take in accout" + this.imtopic);
    }else{
        mqttPublish(this.imtopic,{'origin':'im-web'});
        console.log(this.imtopic,event.type,event.timeStamp);   
    }
}

function doColor(event) {
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
    if(globalColorMode){
        mqttPublish("im/color",{'origin':'im-web','rgb':this.imcolor});
        console.log(this.imcolor,event.type,event.timeStamp); 
    }else{
        console.log("moveMode so dont take in accout" + this.imtopic);  
    }
}