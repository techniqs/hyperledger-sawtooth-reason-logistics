open BsReactstrap;
open Utils;
module Styles = FormStyles;
module MandatoryAsterisk = ValidatedForm.MandatoryAsterisk;

module type UserWareFormConfig = {
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
          ValidatedForm.fieldConfig(
            WareFormConfig.field,
            WareFormConfig.state,
          ),
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

module WareDataForm = (UserWareFormConfig: UserWareFormConfig) => {
  module Input = UserWareFormConfig.Input;

  [@react.component]
  let make = (~form: UserWareFormConfig.interfaceType) => {
    <>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"EAN" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="ean"
                _type="number"
                form
                field=WareFormConfig.eanField
              />
            </Label>
          </FormGroup>
        </Col>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Name" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="name"
                _type="text"
                form
                field=WareFormConfig.nameField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Longitude" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="longitude"
                _type="number"
                form
                field=WareFormConfig.longitudeField
              />
            </Label>
          </FormGroup>
        </Col>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Latitude" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="latitude"
                _type="number"
                form
                field=WareFormConfig.latitudeField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"UVP" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="uvp"
                _type="number"
                form
                field=WareFormConfig.uvpField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </>;
  };
};

module EditWareDataForm = (UserWareFormConfig: UserWareFormConfig) => {
  module Input = UserWareFormConfig.Input;

  [@react.component]
  let make = (~form: UserWareFormConfig.interfaceType) => {
    <>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Name" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="name"
                _type="text"
                form
                field=WareFormConfig.nameField
              />
            </Label>
          </FormGroup>
        </Col>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"UVP" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="uvp"
                _type="number"
                form
                field=WareFormConfig.uvpField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Longitude" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="longitude"
                _type="number"
                form
                field=WareFormConfig.longitudeField
              />
            </Label>
          </FormGroup>
        </Col>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"Latitude" |> str} </Text>
              <MandatoryAsterisk />
              <Input
                id="latitude"
                _type="number"
                form
                field=WareFormConfig.latitudeField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
       <Row>
        <Col className=Styles.paddingLeftAndRight>
          <FormGroup>
            <Label>
              <Text> {"New Owner" |> str} </Text>
              <Input
                id="owner"
                _type="text"
                form
                field=WareFormConfig.ownerField
              />
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </>;
  };
};