const zoom =  document.getElementById("zoom-canvas");
zoom.width=48;
zoom.height=48;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const zoomContext = zoom.getContext('2d');
const sess = new onnx.InferenceSession();
const loadingModelPromise = sess.loadModel("./vgg_onnx_model.onnx");
const classes = ["angry","disgust","fear","happy","neutral","sad","surprise"];


const tracker = new tracking.ObjectTracker('face');
tracker.setInitialScale(2);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);
tracking.track(video, tracker, {
    camera: true
});


function getFaceImage(face){
    zoomContext.drawImage(canvas,face.x, face.y, face.width,face.height,0,0,zoom.width,zoom.height);
    return zoomContext.getImageData(0,0,zoom.width,zoom.height);
}

function processData({data:faces}) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    faces.forEach( async face => {
        context.drawImage(video,0,0,canvas.width,canvas.height);
        context.strokeStyle = '#a64ceb';
        context.strokeRect(face.x, face.y, face.width, face.height);
        const image = getFaceImage(face)
        const gray = getGrayImage(image);
        const pred = await updatePredictions(gray);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        context.fillText(classes[pred], face.x + face.width + 5, face.y + 11);
    });
}

function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}

function getGrayPixelForCoord(x,y,image){
    const colorIndices=getColorIndicesForCoord(x,y,image.width);
    const [redIndex, greenIndex, blueIndex] = colorIndices;
    return (image.data[redIndex]+image.data[greenIndex]+image.data[blueIndex])/3;
}
function getGrayImage(image){
    const newImage = [];
    for(let y=0;y<image.height;y++){
        for(let x=0;x<image.width;x++){
            newImage.push(getGrayPixelForCoord(x,y,image));
        }
    }
    
    return new Float32Array(newImage);
}

async function updatePredictions(imgData) {
    // Get the predictions for the canvas data.
    const input = new onnx.Tensor(imgData, "float32");
  
    await loadingModelPromise;
    const outputMap = await sess.run([input]);
    const outputTensor = outputMap.values().next().value;
    const predictions = outputTensor.data;
    
    const maxPrediction = Math.max(...predictions);
    const index = predictions.findIndex((val)=>val===maxPrediction);
    return index;
}  

tracker.on('track', processData);