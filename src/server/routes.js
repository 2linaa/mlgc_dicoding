import { postPredictHandler, getPredictHandler } from "./handler.js";

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getPredictHandler,
    options: {},
  }
]
 
export default routes;