//Binding to class Hash from crypto module
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
// Agent: 00
// Record: 01
// Bytes 5-35
// Agent: First 62 chars of hash of public key
// Record: First 62 chars of hash of identifier

type addressTypes =
  | Agent
  | Record
  | OtherFamily;

let familyName = "sawtooth-reason-supply";
let familyVersion = "0.1";
// first 3 bytes of address from 35
let nameSpace =
  String.sub(
    createHash("sha512")##update(familyName)##digest("hex"),
    0,
    6,
  );
let agentPrefix = "00";
let recordPrefix = "01";

//Delete
let getXoHash = (x: string) => {
  String.lowercase(
    String.sub(createHash("sha512")##update(x)##digest("hex"), 0, 64),
  );
};

let getIdentifierHash = (x: string) => {
  String.lowercase(
    String.sub(createHash("sha512")##update(x)##digest("hex"), 0, 62),
  );
};

//Delete
let xoNameSpace =
  String.sub(createHash("sha512")##update("xo")##digest("hex"), 0, 6);

//Delete
let xoAdress = (x: string) => {
  xoNameSpace ++ getXoHash(x);
};

let getAgentAddress = (pubKey: string) => {
  nameSpace ++ agentPrefix ++ getIdentifierHash(pubKey);
};

// either string or int idk what id is lets see
let getRecordAddress = (identifier: int) => {
  nameSpace ++ recordPrefix ++ getIdentifierHash(string_of_int(identifier));
};

let getAddressType = (address: string) =>
  if (String.sub(address, 0, 6) !== nameSpace) {
    OtherFamily;
  } else {
    switch (String.sub(address, 6, 2)) {
    | "00" => Agent
    | "01" => Record
    | _ => OtherFamily
    };
  };