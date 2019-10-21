//Binding to class Hash from crypto module
class type _hash =
  [@bs]
  {
    pub update: string => Js.t(_hash);
    pub digest: string => string;
  };

type hash = Js.t(_hash);
[@bs.module "globals"] external createHash: string => hash = "createHash";
