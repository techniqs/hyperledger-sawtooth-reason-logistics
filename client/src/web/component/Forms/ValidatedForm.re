open BsReactstrap;
open Utils;

module type FormConfig = {
  type field;
  type state;
  // type message = string;
  //   type submissionError;
  let validators:
    list(Formality__Validation.validator(field, state, string));
  type submissionError;
};

type fieldConfig('field, 'state) = {
  field: 'field,
  getFromState: 'state => string,
  setToState: ('state, string) => 'state,
  validator: Formality.validator('field, 'state, string),
};

module Make = (FormConfig: FormConfig) => {
  type state = FormConfig.state;

  module Hook =
    Formality.Make({
      include FormConfig;
      type message = string;
    });

  let useForm = Hook.useForm;

  module Form = {
    [@react.component]
    let make =
        (~form: Hook.interface, ~showFormError: unit => unit=?, ~children) => {
      <Form
        onSubmit={(event: ReactEvent.Form.t) => {
          if (!form.valid()) {
            showFormError();
          };
          Formality.Dom.preventDefault(form.submit, event);
        }}>
        children
      </Form>;
    };
  };

  module InputError = {
    [@react.component]
    let make = (~valid: bool, ~errorMessage: option(string)) => {
      <FormFeedback valid>
        <Text>
          {errorMessage |> renderOpt(errorMessage => errorMessage |> str)}
        </Text>
      </FormFeedback>;
    };
  };

  let parseResult = (~form: Hook.interface, ~field: fieldConfig('a, 'b)) =>
    switch (form.result(field.field)) {
    | Some(Error(message)) => (false, Some(message))
    | _ => (true, None)
    };

  module Input = {
    [@react.component]
    let make =
        (
          ~className: string=?,
          ~form: Hook.interface,
          ~field: fieldConfig('a, 'b),
          ~id: string=?,
          ~placeholder: string=?,
          ~_type: string,
          ~children: option(React.element)=?,
        ) => {
      let (valid, errorMessage) = parseResult(~form, ~field);
      <Flex mt={Css.px(4)}>
        <Input
          id
          _type
          invalid={!valid}
          value={field.getFromState(form.state)}
          onBlur={_ => form.blur(field.field)}
          className
          placeholder
          onChange={event =>
            form.change(
              field.field,
              field.setToState(
                form.state,
                event->ReactEvent.Form.target##value,
              ),
            )
          }>
          {switch (children) {
           | Some(children) => children
           | _ => ReasonReact.null
           }}
        </Input>
        <InputError valid errorMessage />
      </Flex>;
    };
  };

  module Checkbox = {
    [@react.component]
    let make =
        (
          ~form: Hook.interface,
          ~field: FormConfig.field,
          ~fieldconfig: fieldConfig('a, 'b),
          ~id: string,
          // eg. form.state.agb
          ~stateField: bool,
          ~label: React.element,
        ) => {
      <FormGroup
        className={
          switch (form.result(field)) {
          | Some(Error(_)) =>
            Css.(
              style([
                selector(
                  "input:not(:checked)+label::before",
                  [borderColor(Colors.warning1)],
                ),
              ])
            )
          | _ => ""
          }
        }>
        <input
          type_="checkbox"
          checked=stateField
          // value=(form.state.agb ? "checked" : "")
          onChange={_event =>
            form.change(
              field,
              fieldconfig.setToState(
                form.state,
                stateField != true ? "checked" : "",
              ),
            )
          }
          id
        />
        label
        {switch (form.result(field)) {
         | Some(Error(errorMessage)) =>
           <FormFeedback className=Css.(style([display(block)]))>
             {errorMessage |> str}
           </FormFeedback>
         | _ => ReasonReact.null
         }}
      </FormGroup>;
    };
  };

  module MainFormError = {
    [@react.component]
    let make = (~show: bool, ~text) => {
      switch (show) {
      | true =>
        <Flex
          background=Colors.warning2
          px={Css.px(32)}
          py={Css.px(20)}
          alignItems=`center
          full=true>
          <Text color=Colors.warning1> {text |> str} </Text>
        </Flex>
      | _ => ReasonReact.null
      };
    };
  };
};

module Validator = {
  let required = value =>
    switch (value) {
    | "" => Belt.Result.Error("Please fill in required field.")
    | _ => Belt.Result.Ok(Formality__Validation.Result.Valid)
    };

  let maxStringLength = (value: string, maxLength: int) =>
    switch (value |> Js.String.length) {
    | stringLength when stringLength > maxLength =>
      Belt.Result.Error("Too long text")
    | _ => Belt.Result.Ok(Formality__Validation.Result.Valid)
    };

  // todo create two separate vaidators
  let maxStringLengthAndRequired = (value: string, maxLength: int) =>
    switch (value |> Js.String.length) {
    | stringLength when stringLength > maxLength || stringLength == 0 =>
      Belt.Result.Error("Please fill in required field.")
    | _ => Belt.Result.Ok(Formality__Validation.Result.Valid)
    };

  let email = (email: string) => {
    let emailRegex = [%bs.re "/\\S+@\\S+\\.\\S+/"];
    switch (Js.Re.exec_(emailRegex, email)) {
    | Some(_) => Belt.Result.Ok(Formality__Validation.Result.Valid)
    | _ => Belt.Result.Error("Please fill in a valid email!")
    };
  };

  let notRequired = _ => Belt.Result.Ok(Formality__Validation.Result.Valid);
};

module MandatoryAsterisk = {
  [@react.component]
  let make = () =>
    <span className=Css.(style([color(Colors.warning1)]))>
      {"*" |> str}
    </span>;
};