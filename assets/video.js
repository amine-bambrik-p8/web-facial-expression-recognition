const display = document.querySelector('.display');
const source = display.querySelector('.display__source');
const overlay = display.querySelector('.display__overlay');
const handler = display.querySelector('input');
const histogram = document.querySelectorAll(".histogram__row");


const tracker = new tracking.ObjectTracker('face');
tracker.setInitialScale(2);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);


function getProcessFunctionFor(src,target){
    const context = target.getContext("2d");
    const zoom = document.createElement("canvas");
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

 function readURL(input) {
    if (input.files && input.files[0]) {
        const videoSource = source.querySelector('source');
        videoSource.src = URL.createObjectURL(input.files[0]);
        source.load();
        source.play();
        display.classList.remove("display--empty");
        tracking.track(source, tracker);
        tracker.on('track', getProcessFunctionFor(source,overlay));
    }
}
function chooseFile(){
    handler.click();
}
