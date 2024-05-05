const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    // const { result, suggestion } = await predictClassification(model, image._data);
    const { result, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": result,
        "suggestion": suggestion,
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diprediksi',
        data: data
    })
    response.code(201);
    return response;
/*
* Akan diisi setelah membuat logika inferensi machine learning.
*/
}

const getPredictHistoriesHandler = async (request, h) => {
    const db = new Firestore();
    const predictCollection = db.collection('prediction');
    const snapshot = await predictCollection.get();

    const histories = [];
    snapshot.forEach((doc) => {
        histories.push(doc.data());
    });

    const response = h.response({
        status: 'success',
        data: {
            histories
        }
    });
    response.code(200);
    return response;
}

module.exports = { postPredictHandler, getPredictHistoriesHandler };