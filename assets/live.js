const display = document.querySelector('.display');
const source = display.querySelector('.display__source');
const overlay = display.querySelector('.display__overlay');
const histogram = document.querySelectorAll(".histogram__row");
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

const tracker = new tracking.ObjectTracker('face');
tracker.setInitialScale(2);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);
tracking.track(source, tracker, {
    camera: true
});
function togglePlay(){
    if(source.paused){
        source.play();
        display.classList.remove("display--paused");
    }else{
        source.pause();
        display.classList.add("display--paused");
    }
}

function getProcessFunctionFor(src,target){
    const context = target.getContext("2d");
    const zoom = document.createElement("canvas");
    zoom.classList.add("display__canvas--hidden");
    zoom.width=48;
    zoom.height=48;
    return function processData({data:faces}) {
        context.drawImage(src,0,0,target.width,target.height);
        faces.forEach(async face => {
            const image = getFaceImage(face,target,zoom);
            const gray = getGrayImage(image);
            const predictionInfo = await updatePredictions(gray);
            drawFace(context,face,predictionInfo.max);
            updateHistogram(predictionInfo.predictions,histogram);
        });
    };
}




tracker.on('track', getProcessFunctionFor(source,overlay));
