class type _hash =
  [@bs]
  {
    pub update: string => Js.t(_hash);
    pub digest: string => string;
  };

type hash = Js.t(_hash);
[@bs.module "crypto"] external createHash: string => hash = "createHash";

// 1byte -> 2 chars
// Address Schema -->
// Bytes 1-3 Hashed App name
// Byte 4 Resource Type
// User: 00
// Ware: 01
// Bytes 5-35
// User: First 62 chars of hash of public key
// Ware: First 62 chars of hash of identifier

type addressTypes =
  | User
  | Ware
  | OtherFamily;

let familyName = "sawtooth-reason-supply";
let familyVersion = "0.1";
let nameSpace =
  String.sub(
    createHash("sha512")##update(familyName)##digest("hex"),
    0,
    6,
  );
let userPrefix = "00";
let warePrefix = "01";


let getIdentifierHash = (x: string) => {
  String.lowercase_ascii(
    String.sub(createHash("sha512")##update(x)##digest("hex"), 0, 62),
  );
};

let getUserAddress = (pubKey: string) => {
  nameSpace ++ userPrefix ++ getIdentifierHash(pubKey);
};

let getWareAddress = (ean: string) => {
  nameSpace ++ warePrefix ++ getIdentifierHash(ean);
};

let getAddressType = (address: string) =>
  if (String.sub(address, 0, 6) !== nameSpace) {
    OtherFamily;
  } else {
    switch (String.sub(address, 6, 2)) {
    | "00" => User
    | "01" => Ware
    | _ => OtherFamily
    };
  };