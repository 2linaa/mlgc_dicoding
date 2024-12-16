import dotenv from "dotenv";
 
import Hapi from "@hapi/hapi";
import routes from "../server/routes.js";
import loadModel from "../services/modelLoad.js";
import InputError from "../exceptions/InputError.js";
 
dotenv.config();


(async () => {
    const server = Hapi.server({
        port: 8080,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
            payload: {
                maxBytes: 1 * 1024 * 1024,
            },
        },
    });
 
    const model = await loadModel();
    server.app.model = model;
 
    server.route(routes);
 
    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `Terjadi kesalahan dalam melakukan prediksi`
            })
            newResponse.code(400);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }

        return h.continue;
    });
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();
