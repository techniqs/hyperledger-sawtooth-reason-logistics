import protobuf from 'sawtooth-sdk/protobuf';
import { batchKeyPair, batchSigner, getSigner } from './keyHandler';
import { hash, getUserAddress, getWareAddress, FAMILY_NAME, FAMILY_VERSION, NAMESPACE } from '../utils/addressHandler';

export const createUserTransaction = (transactionKeyPair, username, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);

    console.log("adress", userAddress);

    let inputAddressList = [userAddress];
    let outputAddressList = [userAddress];

    const action = "create_user";
    const payload = {
        action,
        data: { username, timestamp }
    };
    console.log("payload data:", payload);
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

export const createWareTransaction = (transactionKeyPair, input, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);
    const wareAddress = getWareAddress(input.ean);


    let inputAddressList = [userAddress, wareAddress];
    let outputAddressList = [wareAddress];

    const action = "set_ware";

    const payload = {
        action,
        data: { ean: input.ean, name: input.name, longitude: input.longitude, latitude: input.latitude, timestamp }
    };

    console.log("payload: ", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

export const updateWareTransaction = (transactionKeyPair, input, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);
    const newUserAddress = getUserAddress(input.owner);

    const wareAddress = getWareAddress(input.ean);
    let inputAddressList;
    if (userAddress === newUserAddress) {
        inputAddressList = [userAddress, wareAddress];
    } else {
        inputAddressList = [userAddress, newUserAddress, wareAddress];
    }
    let outputAddressList = [wareAddress];

    const action = "set_ware";
    // ean has to be same, cant be updated!
    const payload = {
        action,
        data: { ean: input.ean, owner: input.owner, name: input.name, longitude: input.longitude, latitude: input.latitude, timestamp }
    };

    console.log("payload: ", payload);

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

// export const transferWareTransaction = (transactionKeyPair, input, timestamp) => {
//     const oldUserAddress = getUserAddress(transactionKeyPair.pubKey);
//     const newUserAddress = getUserAddress(input.newOwnerPubKey);
//     const wareAddress = getWareAddress(input.ean);

//     let inputAddressList = [oldUserAddress, newUserAddress, wareAddress];
//     let outputAddressList = [wareAddress];

//     const action = "transfer_ware";

//     const payload = {
//         action,
//         data: { ean: input.ean, newOwnerPubKey: input.newOwnerPubKey, timestamp }
//     };

//     console.log("payload: ", payload);

//     // encoding with node buffer
//     const payloadBytes = Buffer.from(JSON.stringify(payload));

//     return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
// }


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