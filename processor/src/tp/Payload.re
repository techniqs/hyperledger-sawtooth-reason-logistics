module Convert = {
  type actions =
    | CreateUser
    | CreateWare
    | TransferWare
    | UpdateWare
    | NotDefined;

  type data;

  type userData = {
    username: string,
    timestamp: int,
  };

  type wareData = {
    ean: string,
    name: string,
    longitude: int,
    latitude: int,
    timestamp: int,
  };

  type transferWareData = {
    ean: string,
    newOwner: string,
    timestamp: int,
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

  type transferWarePayload = {
    action: string,
    data: transferWareData,
  };
  let toTypeAction = action => {
    switch (action) {
    | "create_user" => CreateUser
    | "create_ware" => CreateWare
    | "transfer_ware" => TransferWare
    | "update_ware" => UpdateWare
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
  external convertTransferWarePayload: string => transferWarePayload = "parse";
};

let decodeUserData = (buffer: Node.Buffer.t) => {
  Convert.convertUserPayload(Node.Buffer.toString(buffer)).data;
};

let decodeWareData = (buffer: Node.Buffer.t) => {
  Convert.convertWarePayload(Node.Buffer.toString(buffer)).data;
};

let decodeTransferWareData = (buffer: Node.Buffer.t) => {
  Convert.convertTransferWarePayload(Node.Buffer.toString(buffer)).data;
};

let decodePayloadAction = (buffer: Node.Buffer.t) => {
  Convert.toTypeAction(
    Convert.convertAction(Node.Buffer.toString(buffer)).action,
  );
};