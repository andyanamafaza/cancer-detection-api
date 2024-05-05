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

module.exports = postPredictHandler;