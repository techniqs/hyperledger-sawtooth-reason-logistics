import protobuf from 'sawtooth-sdk/protobuf';
import { createKeyPair } from './keyHandler';
import { hash, getAgentAddress, getWareAddress, FAMILY_NAME, FAMILY_VERSION, NAMESPACE } from '../utils/addressHandler';

const batchSigner = createKeyPair();

    // probably needed for ware update from own owner to other
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

export const createAgentTransaction = (transactionSigner, username, timestamp) => {
    const agentAddress = getAgentAddress(transactionSigner.pubKey);

    console.log("adress", agentAddress);

    let inputAddressList = [agentAddress];
    let outputAddressList = [agentAddress];

    const action = "create_agent";


    // payload consists of action, agentName, and agentCreateDate
    const payload = action + "," + username + "," + timestamp;

    console.log("payload data:", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(payload);
     
    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionSigner)
}


const createBatch = (payloadBytes, inputs, outputs, transactionSigner) => {

    //transactionHeader
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        inputs: inputs,
        outputs: outputs,
        signerPublicKey: transactionSigner.pubKey,
        batcherPublicKey: batchSigner.pubKey,
        // nonce ensures if two transactions have same fields, the nonce ensures
        // they will generate different header signatures
        nonce: "" + Math.random(),
        dependencies: [],
        payloadSha512: hash(payloadBytes),
    }).finish();

    //create transaction
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: transactionSigner.signer.sign(transactionHeaderBytes),
        payload: payloadBytes
    });

    //batch takes array of transactions
    const transactions = [transaction];

    //batchHeader
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: batchSigner.pubKey,
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();

    //create batch
    return protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: batchSigner.signer.sign(batchHeaderBytes),
        transactions: transactions,
    });


    

} 