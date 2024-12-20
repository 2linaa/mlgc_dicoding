import tf from "@tensorflow/tfjs-node";
import InputError from "../exceptions/InputError.js";

async function predictClassification(model, image) {
   try {
    // Validasi ukuran gambar
    console.log('Image length:', image.length); // Log the image length
    if (image.length > 1000000) {
        return {
            statusCode: 413,
            body: JSON.stringify({
                status: "fail",
                message: "Payload content length greater than maximum allowed: 1000000"
            }),
        };
    }
} catch (error) {
    console.error('Error:', error);
    return {
        statusCode: 500,
        body: JSON.stringify({
            status: "error",
            message: "Internal Server Error"
        }),
    };
}


        // Decode dan preprocess gambar
        const tensor = tf.node
            .decodeJpeg(image) // Decode gambar dengan format RGB
            .resizeNearestNeighbor([224, 224]) // Ubah ukuran sesuai input model
            .expandDims() // Tambahkan dimensi batch
            .toFloat();

        // Prediksi dengan model
        const prediction = model.predict(tensor); // Lakukan prediksi
        const score = await prediction.data(); // Ambil hasil prediksi
        const confidenceScore = Math.max(...score) * 100;

    let result = {
      confidenceScore,
      label: "Cancer",
      suggestion: "Segera periksa ke dokter!",
    };
    if (confidenceScore < 1) {
      result.label = "Non-cancer";
      result.suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return result;
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}


export default predictClassification;
