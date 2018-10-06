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
    attachColorTopic(svgDoc.getElementById("blue")      , "1550ff","001040", "1550ff","000102");
    attachColorTopic(svgDoc.getElementById("greenblue") , "15ffc5","004030", "15ffc5","000302");
    attachColorTopic(svgDoc.getElementById("green")     , "15ff15","004000", "15ff15","000200");
    attachColorTopic(svgDoc.getElementById("yellow")    , "ffe215","403800", "ffe215","020200");
    attachColorTopic(svgDoc.getElementById("orange")    , "ffa815","402800", "ffa815","020100");
    attachColorTopic(svgDoc.getElementById("red")       , "d50000","400000", "d50000","020000");
    attachColorTopic(svgDoc.getElementById("purple")    , "ff15c5","400030", "ff15c5","020002");
    attachColorTopic(svgDoc.getElementById("darkpurple"), "2b0055","0b0015", "2b0055","010002");


}, false);

function attachMoveTopic(elt,topic){
    elt.imtopic = topic;
    elt.addEventListener("touchstart", doMove, {capture: true,passive:false});
    elt.addEventListener("mousedown", doMove, {capture: true,passive:false});
}

function attachColorTopic(elt,eyesimcolor,eyesimcolor2,energyimcolor,energyimcolor2){
    elt.eyesimcolor = eyesimcolor;
    elt.eyesimcolor2 = eyesimcolor2;
    elt.energyimcolor = energyimcolor;
    elt.energyimcolor2 = energyimcolor2;
    elt.addEventListener("touchstart", doColor, {capture: true,passive:false});
    elt.addEventListener("mousedown", doColor, {capture: true,passive:false});
}

var globalColorMode = false;
function switchColorMode(event){
    event.preventDefault();
    globalColorMode = !globalColorMode;
    if(globalColorMode){
        legosvg.contentDocument.getElementById("colors").style.display="block";
        mqttPublish("eyes/fade",{'origin':'im-web','rgb':'aaffea','rgb2':'004030','interval':100,'totalSteps':80});
        mqttPublish("energy/chase",{'origin':'im-web','rgb':'aaffea','rgb2':'000202','interval':40});
    }else{
        legosvg.contentDocument.getElementById("colors").style.display= "none";
        mqttPublish("eyes/fade",{'origin':'im-web','rgb':'aaffea','rgb2':'004030','interval':100,'totalSteps':80});
        mqttPublish("energy/chase",{'origin':'im-web','rgb':'aaffea','rgb2':'000202','interval':40});
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
        mqttPublish("eyes/colorize",{'origin':'im-web','rgb':this.eyesimcolor,'rgb2':this.eyesimcolor2});
        mqttPublish("energy/colorize",{'origin':'im-web','rgb':this.energyimcolor,'rgb2':this.energyimcolor2});
        //document.getElementById("legosvg").contentDocument.getElementById("energy").querySelector("circle").setAttribute("fill", "#"+this.imcolor); 
        console.log(event.type, this.imcolor); 
    }else{
        console.log("moveMode so dont take in accout" + this.imtopic);  
    }
}