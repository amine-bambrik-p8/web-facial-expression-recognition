
const sess = new onnx.InferenceSession();
const loadingModelPromise = sess.loadModel("./resnet_test_final_onnx_model.onnx");
const classes = ["angry","disgust","fear","happy","neutral","sad","surprise"];

async function updatePredictions(imgData) {
    // Get the predictions for the canvas data.
    const input = new onnx.Tensor(imgData, "float32");
  
    await loadingModelPromise;
    const outputMap = await sess.run([input]);
    const outputTensor = outputMap.values().next().value;
    const predictions = outputTensor.data;
    const maxPrediction = Math.max(...predictions);
    const index = predictions.findIndex((val)=>val===maxPrediction);
    return {
        max:index,
        predictions
    };
}
