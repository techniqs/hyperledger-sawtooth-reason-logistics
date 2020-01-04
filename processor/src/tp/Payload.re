module Convert = {
  type actions =
    | CreateUser
    | SetWare
    | NotDefined;

  type data;

  type userData = {
    username: string,
    timestamp: int,
  };

  type wareData = {
    ean: string,
    name: string,
    uvp: float,
    longitude: int,
    latitude: int,
    timestamp: int,
    owner: string,
  };

  module TypesForWareState = {
    type identifier = {
      ean: string,
      timestamp: string,
    };

    type attributes = {
      name: string,
      uvp: string,
      timestamp: string,
    };

    type owner = {
      pubKey: string,
      timestamp: string,
    };

    type location = {
      latitude: string,
      longitude: string,
      timestamp: string,
    };

    type savedWareData = {
      identifier: array(identifier),
      attributes: array(attributes),
      owners: array(owner),
      locations: array(location),
    };
  };

  type decodeActionType = {
    action: string,
    data,
  };

  type userPayload = {
    action: string,
    data: userData,
  };

  type warePayload = {
    action: string,
    data: wareData,
  };

  let toTypeAction = action => {
    switch (action) {
    | "create_user" => CreateUser
    | "set_ware" => SetWare
    | _ => NotDefined
    };
  };
  [@bs.scope "JSON"] [@bs.val]
  external convertAction: string => decodeActionType = "parse";

  [@bs.scope "JSON"] [@bs.val]
  external convertUserPayload: string => userPayload = "parse";

  [@bs.scope "JSON"] [@bs.val]
  external convertWarePayload: string => warePayload = "parse";

  [@bs.scope "JSON"] [@bs.val]
  external convertSavedWareData: string => TypesForWareState.savedWareData =
    "parse";
};

let decodeUserData = (buffer: Node.Buffer.t) => {
  Convert.convertUserPayload(Node.Buffer.toString(buffer)).data;
};

let decodeWareData = (buffer: Node.Buffer.t) => {
  Convert.convertWarePayload(Node.Buffer.toString(buffer)).data;
};

let decodeSavedWareData = (buffer: Node.Buffer.t) => {
  Convert.convertSavedWareData(Node.Buffer.toString(buffer));
};

let decodePayloadAction = (buffer: Node.Buffer.t) => {
  Convert.toTypeAction(
    Convert.convertAction(Node.Buffer.toString(buffer)).action,
  );
};