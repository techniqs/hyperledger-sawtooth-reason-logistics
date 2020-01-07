open BsReactstrap;
open Utils;
module Styles = FormStyles;
module MandatoryAsterisk = ValidatedForm.MandatoryAsterisk;

module MainFormError = {
  [@react.component]
  let make = (~show: bool, ~text: string) => {
    switch (show) {
    | true =>
      <Flex
        background=Colors.warning2
        px={Css.px(32)}
        py={Css.px(20)}
        alignItems=`center
        full=true>
        <Flex width={Css.px(16)} height={Css.px(16)} mr={Css.px(8)}>
          <Icon icon="error" />
        </Flex>
        <Text color=Colors.warning1> {text |> str} </Text>
      </Flex>
    | _ => ReasonReact.null
    };
  };
};


module type UserFormConfig = {
  type interfaceType;

  module Input: {
    let make:
      {
        .
        "_type": string,
        "children": option(React.element),
        "className": string,
        "placeholder": string,
        "field":
          ValidatedForm.fieldConfig(FormConfig.field, FormConfig.state),
        "form": interfaceType,
        "id": string,
      } =>
      ReasonReact.reactElement;

    let makeProps:
      (
        ~className: string=?,
        ~form: interfaceType,
        ~field: ValidatedForm.fieldConfig('a, 'b),
        ~id: string=?,
        ~placeholder: string=?,
        ~_type: string,
        ~children: React.element=?,
        ~key: string=?,
        unit
      ) =>
      {
        .
        "_type": string,
        "children": option(React.element),
        "className": string,
        "field": ValidatedForm.fieldConfig('a, 'b),
        "form": interfaceType,
        "placeholder": string,
        "id": string,
      };
  };
};
module LoginUserDataForm = (UserFormConfig: UserFormConfig) => {
  module Input = UserFormConfig.Input;

  [@react.component]
  let make = (~form: UserFormConfig.interfaceType) => {
    <>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup >
            <Label>
              <Text> {"Username" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="username"
                _type="text"
                form
                field=FormConfig.usernameField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup >
            <Label>
              <Text> {"Password" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="password"
                _type="password"
                form
                field=FormConfig.loginPasswordField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </>;
  };
};

module RegistrationUserDataForm = (UserFormConfig: UserFormConfig) => {
  module Input = UserFormConfig.Input;

  [@react.component]
  let make = (~form: UserFormConfig.interfaceType) => {
    <>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Username" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="registerUsername"
                _type="text"
                form
                field=FormConfig.usernameField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Password" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="registerPassword"
                _type="password"
                form
                field=FormConfig.registerPasswordField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Confirm password" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="passwordAgain"
                _type="password"
                form
                field=FormConfig.registerPasswordAgainField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </>;
  };
};