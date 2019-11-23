const crypto = require('crypto');


export const FAMILY_NAME = "sawtooth-reason-supply";
export const FAMILY_VERSION = "0.1";
export const NAMESPACE = (crypto.createHash("sha512").update(FAMILY_NAME).digest("hex")).substring(0, 6);
const AGENT_PREFIX = "00";
const RECORD_PREFIX = "01";


export const getAgentAddress = (pubKey) => {
    return NAMESPACE + AGENT_PREFIX +
        (crypto.createHash("sha512").update(pubKey).digest("hex")).substring(0, 62);
}

export const getRecordAddress = (recordId) => {
    return NAMESPACE + RECORD_PREFIX +
        (crypto.createHash("sha512").update(recordId).digest("hex")).substring(0, 62);
}

export const hash = (x) => {
    return crypto.createHash("sha512").update(x).digest("hex");
} 