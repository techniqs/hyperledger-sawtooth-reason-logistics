type submissionError =
  | BadLogin
  | UsernameAlreadyExists
  | UnexpectedServerError;

type field =
  | Username
  | Password
  | PasswordAgain;

type state = {
  username: string,
  password: string,
  passwordAgain: string,
};

let initialState: state = {
  username: "",
  password: "",
  passwordAgain: "",
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

let usernameField: fieldConfig = {
  createField(
    Username,
    state => state.username,
    (state, username) => {...state, username},
    ValidatedForm.Validator.required,
  );
};

// used for login
let loginPasswordField: fieldConfig = {
  createField(
    Password,
    state => state.password,
    (state, password) => {...state, password},
    ValidatedForm.Validator.required,
  );
};

// used for register
// extra validator inside which checks passwordAgainField
let registerPasswordField: fieldConfig = {
  createField(
    Password,
    state => state.password,
    (state, password) => {...state, password},
    ValidatedForm.Validator.required,
  );
};

let registerPasswordAgainField: fieldConfig = {
  field: PasswordAgain,
  getFromState: state => state.passwordAgain,
  setToState: (state, passwordAgain) => {...state, passwordAgain},
  validator: {
    field: PasswordAgain,
    strategy: Formality.Strategy.OnFirstSuccessOrFirstBlur,
    dependents: Some([Username]),
    validate: state =>
      switch (state.password, state.passwordAgain) {
      | (password, passwordAgain) when password !== passwordAgain =>
        Belt.Result.Error("Passwords dont match, please check again!")
      | (passwordAgain, _) => ValidatedForm.Validator.required(passwordAgain)
      },
  },
};
