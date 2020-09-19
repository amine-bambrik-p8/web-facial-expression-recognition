
const bars = document.querySelectorAll(".histogram__row");

function getFaceImage(face,canvas,zoom){
    const zoomContext = zoom.getContext("2d");
    zoomContext.drawImage(canvas,face.x, face.y, face.width,face.height,0,0,zoom.width,zoom.height);
    return zoomContext.getImageData(0,0,zoom.width,zoom.height);
}
function drawFace(context,face,pred){
    context.strokeStyle = '#a64ceb';
    context.strokeRect(face.x, face.y, face.width, face.height);
    context.font = '11px Helvetica';
    context.fillStyle = "#fff";
    context.fillText(classes[pred], face.x + face.width + 5, face.y + 11);
}
function updateHistogram(predictions,histogram){
    histogram.forEach((e,index)=>{
        const bar = e.querySelector(".histogram__row__bar");
        const info = e.querySelector(".histogram__row__info");
        const percentage = (predictions[index]*100+"").substring(0,4);
        info.setAttribute("data-value",percentage);
        bar.style.width=percentage+"%";
    });
}