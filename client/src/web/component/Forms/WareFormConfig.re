type submissionError =
  | InvalidEan
  | InvalidUser
  | UnexpectedServerError;

type field =
  | Ean
  | Name
  | Longitude
  | Latitude
  | Uvp
  | Owner;

type state = {
  ean: string,
  name: string,
  longitude: float,
  latitude: float,
  uvp: float,
  owner: string,
};

let initialState: state = {
  ean: "",
  name: "",
  longitude: 0.0,
  latitude: 0.0,
  uvp: 0.0,
  owner: "",
};

type fieldConfig = ValidatedForm.fieldConfig(field, state);

let createField = (field, fromState, toState, validator): fieldConfig => {
  {
    field,
    getFromState: fromState,
    setToState: toState,
    validator: {
      field,
      strategy: Formality.Strategy.OnFirstSuccessOrFirstBlur,
      dependents: None,
      validate: state => fromState(state) |> validator,
    },
  };
};

let eanField: fieldConfig = {
  field: Ean,
  getFromState: state => state.ean,
  setToState: (state, ean) => {
    ...state, ean,
  },
  validator: {
    field: Ean,
    strategy: Formality.Strategy.OnFirstSuccessOrFirstBlur,
    dependents: None,
    validate: state =>
      Js.String.length(state.ean) >= 8 && Js.String.length(state.ean) <= 13
        ? ValidatedForm.Validator.required(
            state.ean
          )
        : Belt.Result.Error("EAN has to be atleast 8 and max 13 numbers!"),
  },
};

let nameField: fieldConfig = {
  createField(
    Name,
    state => state.name,
    (state, name) => {...state, name},
    ValidatedForm.Validator.required,
  );
};

let longitudeField: fieldConfig = {
  field: Longitude,
  getFromState: state => state.longitude |> Js.Float.toString,
  setToState: (state, longitude) => {
    ...state,
    longitude: longitude === "" ? 0.0 : longitude |> float_of_string,
  },
  validator: {
    field: Longitude,
    strategy: Formality.Strategy.OnFirstSuccessOrFirstBlur,
    dependents: None,
    validate: state =>
      state.longitude >= (-180.) && state.longitude <= 180.
        ? ValidatedForm.Validator.required(
            state.longitude |> Js.Float.toString,
          )
        : Belt.Result.Error("Longitude has to be in range of -180 and 180!"),
  },
};

let latitudeField: fieldConfig = {
  field: Latitude,
  getFromState: state => state.latitude |> Js.Float.toString,
  setToState: (state, latitude) => {
    ...state,
    latitude: latitude === "" ? 0.0 : latitude |> float_of_string
  },
  validator: {
    field: Latitude,
    strategy: Formality.Strategy.OnFirstSuccessOrFirstBlur,
    dependents: None,
    validate: state =>
      state.latitude >= (-90.) && state.latitude <= 90.
        ? ValidatedForm.Validator.required(
            state.latitude |> Js.Float.toString,
          )
        : Belt.Result.Error("Latitude has to be in range of -90 and 90!"),
  },
};

let uvpField: fieldConfig = {
  createField(
    Uvp,
    state => state.uvp |> Js.Float.toString,
    (state, uvp) => {...state, uvp: uvp === "" ? 0.0 : uvp |> float_of_string},
    ValidatedForm.Validator.required,
  );
};


let ownerField: fieldConfig = {
  createField(
    Owner,
    state => state.owner,
    (state, owner) => {...state, owner},
    ValidatedForm.Validator.notRequired,
  );
};

// let ownerField: fieldConfig = {
//   createField(
//     Owner,
//     state => switch(state.owner){
//       |Some(s) => s
//       | _ => ""
//     },
//     (state, owner) => {...state, owner: Some(owner)},
//     ValidatedForm.Validator.notRequired,
//   );
// };