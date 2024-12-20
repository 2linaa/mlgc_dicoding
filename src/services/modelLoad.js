import tf from "@tensorflow/tfjs-node";
 
async function loadModel() {
    try {
        return await tf.loadGraphModel('https://storage.googleapis.com/submissionlina/model-in-prod/model.json');
      } catch (error) {
        console.error('Error loading model:', error);
      }}
 
      export default loadModel;
