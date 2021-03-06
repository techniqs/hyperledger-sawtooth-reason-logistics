import rp from 'request-promise';
import protobuf from 'sawtooth-sdk/protobuf';

// sends a ready batch to the validator
export const sendBatch = async (batch) => {

    // IMPORTANT REST API LINKS
    // https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/rest_api.html#http-status-codes
    // https://sawtooth.hyperledger.org/docs/core/releases/latest/rest_api/endpoint_specs.html
    // https://sawtooth.hyperledger.org/faq/rest/#is-the-rest-api-at-tcp-port-8080-or-8008

    // batches must be in a batchlist 
    const batchList = protobuf.BatchList.encode({
        batches: [batch]
    }).finish();


    const batchOptions = {
        method: 'POST',
        uri: 'http://172.17.0.1:8008/batches',
        // for localhost
        // uri: 'http://localhost:8008/batches',
        body: batchList,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    }

    const uri = 'http://172.17.0.1:8008/batch_statuses?wait=1&id=' + batch.headerSignature;
    // for localhost 
    // const uri = 'http://localhost:8008/batch_statuses?wait=1&id=' + batch.headerSignature;

    const statusOptions = {
        method: 'GET',
        uri: uri,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    };

    console.log("submitting")
    await rp(batchOptions).catch(function (err) {
        throw new Error("Error while submitting batch:", err);
    });

    await rp(statusOptions).then(function (parsedBody) {

        const body = JSON.parse(parsedBody);
        console.log(body.data)
        const status = body.data[0].status;

        if (status === "INVALID") {
            throw new Error(body.data[0].invalid_transactions[0].message);
        } else if (status === "PENDING") {
            throw new Error("Batch Status Request timed out.");
        } else if (status === "UNKNOWN") {
            throw new Error("Internal Server error, something went while requesting batch status");
        }

    }).catch(function (err) {
        throw err
    })

}