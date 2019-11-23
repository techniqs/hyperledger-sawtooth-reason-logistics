const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { hash, getAgentAddress, getRecordAddress, FAMILY_NAME, FAMILY_VERSION, NAMESPACE } = require('./addressHandler')
const protobuf = require('sawtooth-sdk/protobuf')
const request = require('request')

export const createKeyPair = () => {

    const context = createContext('secp256k1')
    const privateKey = context.newRandomPrivateKey()
    const signer = new CryptoFactory(context).newSigner(privateKey)
    // console.log(signer.getPublicKey().asHex())
    // console.log(privateKey.asHex())
    return { signer: signer, pubKey: signer.getPublicKey(), privKey: privateKey };
}

//create new Agent
export const wrapAndSendNewAgent = (agentName) => {
    let payload = ''
    let signObject = createKeyPair();
    const agentAddress = getAgentAddress(signObject.pubKey.asHex());

    let inputAddressList = [agentAddress];
    let outputAddressList = [agentAddress];

    // probably needed for record update from own owner to other
    // if (action === "transfer") {
    //   const pubKeyStrBuf = this.getUserPubKey(values[1]);
    //   const pubKeyStr = pubKeyStrBuf.toString().trim();
    //   var toAddress = hash("simplewallet").substr(0, 6) + hash(pubKeyStr).substr(0, 64);
    //   inputAddressList.push(toAddress);
    //   outputAddressList.push(toAddress);
    //   payload = action + "," + values[0] + "," + pubKeyStr;
    // }
    // else {
    //   payload = action + "," + values[0];
    // }

    const action = "create_agent";
    const agentCreatedAt = (new Date()).toLocaleDateString("de-DE");
    console.log("DATE ()", new Date());
    console.log("DATE ??", agentCreatedAt);

    // payload consists of action, agentName, and agentCreateDate
    payload = action + "," + agentName + "," + agentCreatedAt;

    console.log(payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(payload);

    // console.log("PAYLOADBYTES BUFFEr", payloadBytes);

    //transactionHeader
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        inputs: inputAddressList,
        outputs: outputAddressList,
        signerPublicKey: signObject.pubKey.asHex(),
        // nonce ensures if two transactions have same fields, the nonce ensures
        // they will generate different header signatures
        nonce: "" + Math.random(),
        batcherPublicKey: signObject.pubKey.asHex(),
        dependencies: [],
        payloadSha512: hash(payloadBytes),
    }).finish();

    //create transaction
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signObject.signer.sign(transactionHeaderBytes),
        payload: payloadBytes
    });

    //batch takes array of transactions
    const transactions = [transaction];

    //batchHeader
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signObject.pubKey.asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();

    const batchSignature = signObject.signer.sign(batchHeaderBytes);

    //create batch
    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: batchSignature,
        transactions: transactions,
    });
    // batches must be in a batchlist 
    const batchListBytes = protobuf.BatchList.encode({
        batches: [batch]
    }).finish();

    // then i submit to my validator :)
    sendToRest(batchListBytes);
}


const sendToRest = (batchListBytes) => {

    // HTTP CODES OF TP 
    // https://sawtooth.hyperledger.org/docs/core/releases/1.0/architecture/rest_api.html#http-status-codes

    request.post({
        //change this for Docker to rest api instead of localhost  
        url: 'http://localhost:8008/batches',
        body: batchListBytes,
        headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
        if (err) return console.log(err)

        let json = JSON.parse(response.body);
        console.log("response body:", json);
        console.log("response status:", response.statusCode);

        setTimeout(function(something) {
            request.get({
                url: json.link,
                headers: { 'Content-Type': 'application/octet-stream' }
            }, (err, response) => {
                if (err) return console.log(err)
        
                console.log("body of curl:", response.body);
        
            })
        },1000);
    })
}