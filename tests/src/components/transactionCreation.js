import protobuf from 'sawtooth-sdk/protobuf';
import { batchKeyPair, batchSigner, getSigner } from './keyHandler';
import { hash, getUserAddress, getWareAddress, FAMILY_NAME, FAMILY_VERSION } from './addressHandler';

// creates a user transaction for the processor with given input
export const createUserTransaction = (transactionKeyPair, username, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);

    let inputAddressList = [userAddress];
    let outputAddressList = [userAddress];

    const action = "create_user";
    const payload = {
        action,
        data: { username, timestamp }
    };
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

// creates a ware transaction for the processor with given input

export const createWareTransaction = (transactionKeyPair, input, timestamp) => {
    const userAddress = getUserAddress(transactionKeyPair.pubKey);
    const wareAddress = getWareAddress(input.ean);

    let inputAddressList = [userAddress, wareAddress];
    let outputAddressList = [wareAddress];

    const action = "set_ware";

    const payload = {
        action,
        data: { ean: input.ean, owner: input.owner, name: input.name, uvp: input.uvp, longitude: input.longitude, latitude: input.latitude, timestamp }
    };

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

// updates ware attributes or owner for the processor with given input

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
        data: { ean: input.ean, owner: input.owner, name: input.name, uvp: input.uvp, longitude: input.longitude, latitude: input.latitude, timestamp }
    };

    // encoding with node buffer
    const payloadBytes = Buffer.from(JSON.stringify(payload));

    return createBatch(payloadBytes, inputAddressList, outputAddressList, transactionKeyPair)
}

// creates the batch with given payload, addresses to read and write from and the transaction key pair

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