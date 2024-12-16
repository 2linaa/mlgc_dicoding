import predictClassification from "../services/inferenceService.js";
import crypto from "crypto";
import { storeData, getData } from "../services/dataStore.js";

 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 

  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  
  const data = {
    id,
    result: label,
    suggestion,
    confidenceScore,
    createdAt
  }

  await storeData(id, data);
 
  const response = h.response({
    status: 'success',
    message: confidenceScore > 0 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  })
  response.code(201);
  return response;
}

async function getPredictHandler(request, h) {
  const { id } = request.params;

  const data = await getData(id);

  if (!data) {
    const response = h.response({
      status: "fail",
      message: "Prediction not found",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data,
  });
  response.code(200);
  return response;
}
 
export { postPredictHandler, getPredictHandler };