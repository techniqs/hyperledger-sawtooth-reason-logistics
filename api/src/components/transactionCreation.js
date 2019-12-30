import protobuf from 'sawtooth-sdk/protobuf';
import { batchKeyPair, batchSigner, getSigner } from './keyHandler';
import { hash, getUserAddress, getWareAddress, FAMILY_NAME, FAMILY_VERSION, NAMESPACE } from '../utils/addressHandler';



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



export const createUserTransaction = (transactionKeyPair, username, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);

    console.log("adress", userAddress);

    let inputAddressList = [userAddress];
    let outputAddressList = [userAddress];

    const action = "create_user";


    // payload consists of action, userName, and userCreateDate
    const payload = {action, username, timestamp};

    console.log("payload data:", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

export const createWareTransaction = (transactionKeyPair, input, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);
    const wareAddress = getWareAddress(input.ean);


    let inputAddressList = [userAddress, wareAddress];
    let outputAddressList = [wareAddress];

    const action = "create_ware";

    const payload = { action, ean: input.ean, name: input.name, longitude: input.longitude, latitude: input.latitude, timestamp };

    console.log("payload: ", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

export const updateWareTransaction = (transactionKeyPair, input, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);
    const wareAddress = getWareAddress(input.ean);

    let inputAddressList = [userAddress, wareAddress];
    let outputAddressList = [wareAddress];

    const action = "update_ware";

    const payload = { action, ean: input.ean, name: input.name, longitude: input.longitude, latitude: input.latitude, timestamp };

    console.log("payload: ", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

export const transferWareTransaction = (transactionKeyPair, newUser, input, timestamp) => {
    const oldUserAddress = getUserAddress(transactionKeyPair.pubKey);
    const newUserAddress = getUserAddress(newUser.public_key);
    const wareAddress = getWareAddress(input.ean);

    let inputAddressList = [oldUserAddress,newUserAddress, wareAddress];
    let outputAddressList = [wareAddress];

    const action = "transfer_ware";

    const payload = { action, ean: input.ean, newOwner: newUser.username, timestamp};

    console.log("payload: ", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}


const createBatch = (payloadBytes, inputs, outputs, transactionKeyPair) => {

    //transactionHeader
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        //inputAddresslist = list of addresses the tp is allowed to read from
        inputs: inputs,
        //outputAddresslist = list of addresses the tp is allowed to write to
        outputs: outputs,
        signerPublicKey: transactionKeyPair.pubKey,
        batcherPublicKey: batchKeyPair.pubKey,
        // nonce ensures if two transactions have same fields, the nonce ensures
        // they will generate different header signatures
        nonce: "" + Math.random(),
        dependencies: [],
        payloadSha512: hash(payloadBytes),
    }).finish();

    //create transaction
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: getSigner(transactionKeyPair.privKey).sign(transactionHeaderBytes),
        payload: payloadBytes
    });

    //batch takes array of transactions
    const transactions = [transaction];

    //batchHeader
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: batchKeyPair.pubKey,
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();

    //create batch
    return protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: batchSigner.sign(batchHeaderBytes),
        transactions: transactions,
    });




} 