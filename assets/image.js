

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