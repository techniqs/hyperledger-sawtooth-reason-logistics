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

module Hash = {
  let fam_name = "sawtooth-reason-supply";
  let fam_version = "0.1";
  // first 3 bytes of address from 35
  let nameSpace =
    String.sub(
      createHash("sha512")##update("sawtooth-reason-supply")##digest("hex"),
      0,
      6,
    );
  let agent_prefix = "00";
  let record_prefix = "01";
};