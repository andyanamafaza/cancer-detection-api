const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        let result;
        let suggestion;
        if (confidenceScore > 50) {
            result = "Cancer";
            suggestion = "Segera periksa ke dokter!";
        } else {
            result = "Non-cancer";
            suggestion = "Tidak perlu khawatir!";
        }

        return { result, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan: ${error.message}`);
    }

    // const suggestion = "Segera periksa ke dokter!";
    // const createdAt = new Date().toISOString();

    // return {
    //     status: "success",
    //     message: "Model is predicted successfully",
    //     data: {
    //         id,
    //         result,
    //         suggestion,
    //         createdAt
    //     }
    // };
}

module.exports = predictClassification;
