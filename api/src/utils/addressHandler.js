const crypto = require('crypto');

export const FAMILY_NAME = "sawtooth-reason-supply";
export const FAMILY_VERSION = "0.1";
export const NAMESPACE = (crypto.createHash("sha512").update(FAMILY_NAME).digest("hex")).substring(0, 6);
const USER_PREFIX = "00";
const WARE_PREFIX = "01";

export const getUserAddress = (pubKey) => {
    return NAMESPACE + USER_PREFIX +
        (crypto.createHash("sha512").update(pubKey).digest("hex")).substring(0, 62);
}

export const getWareAddress = (wareId) => {
    return NAMESPACE + WARE_PREFIX +
        (crypto.createHash("sha512").update(wareId).digest("hex")).substring(0, 62);
}

export const hash = (x) => {
    return crypto.createHash("sha512").update(x).digest("hex");
} 