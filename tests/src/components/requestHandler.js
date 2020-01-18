import rp from 'request-promise';
import protobuf from 'sawtooth-sdk/protobuf';

// sends a ready batch to the validator
export const sendBatch = async (batch) => {

    // batches must be in a batchlist 
    const batchList = protobuf.BatchList.encode({
        batches: [batch]
    }).finish();


    const batchOptions = {
        method: 'POST',
        uri: 'http://172.17.0.1:8008/batches',
        body: batchList,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    }

    const uri = 'http://172.17.0.1:8008/batch_statuses?wait=1&id=' + batch.headerSignature;

    const statusOptions = {
        method: 'GET',
        uri: uri,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    };

    await rp(batchOptions).catch(function (err) {
        throw new Error("Error while submitting batch:", err);
    });

    return await rp(statusOptions);
}


