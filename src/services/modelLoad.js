import tf from "@tensorflow/tfjs-node";
 
async function loadModel() {
    try {
        return await tf.loadGraphModel(process.env.MODEL_URL);
      } catch (error) {
        console.error('Error loading model:', error);
      }}
 
      export default loadModel;