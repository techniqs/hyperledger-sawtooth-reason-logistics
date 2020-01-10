open Utils;
module MandatoryAsterisk = ValidatedForm.MandatoryAsterisk;
module Styles = FormStyles;
open BsReactstrap;

module SubmitWare = CreateWareMutation.SubmitWare;
module SubmitWareQuery = CreateWareMutation.SubmitWareQuery;

module FormConfig = {
  include WareFormConfig;

  let validators = [
    eanField.validator,
    nameField.validator,
    longitudeField.validator,
    latitudeField.validator,
    uvpField.validator,
    ownerField.validator,
  ];
};

module CreateWareForm = ValidatedForm.Make(FormConfig);

module WareFormConfig = {
  type interfaceType = CreateWareForm.Hook.interface;
  module Input = CreateWareForm.Input;
};

module WareDataForm = WareFormCommon.WareDataForm(WareFormConfig);

module Form = {
  [@react.component]
  let make = (~mutation: SubmitWare.apolloMutation) => {
    let (showInvalidEan, setShowInvalidEan) = React.useState(() => false);

    let form =
      CreateWareForm.useForm(
        ~initialState=FormConfig.initialState,
        ~onSubmit=(state, submissionCallback) => {
          let variables =
            SubmitWareQuery.makeWithVariables({
              "ean": state.ean,
              "name": state.name,
              "longitude": state.longitude,
              "latitude": state.latitude,
              "uvp": state.uvp,
              "owner": None,
            });

          let parseToken = (res: SubmitWareQuery.MT_Ret.t) => {
            res##createWare##status === `OK
              ? Some(res##createWare##ean) : None;
          };

          let getStatus = (res: SubmitWareQuery.MT_Ret.t) => {
            res##createWare##status;
          };

          mutation(~variables=variables##variables, ())
          |> Js.Promise.then_(result => {
               let response:
                 ReasonApolloTypes.executionResponse(SubmitWareQuery.MT_Ret.t) = result;

               switch (response) {
               | Data(data) =>
                 switch (parseToken(data)) {
                 | Some(ean) =>
                   let url = "ware/ean=" ++ ean;
                   ReasonReactRouter.replace(url);
                   Js.Promise.resolve(result);
                 | _ =>
                   switch (getStatus(data)) {
                   | `INVALIDEAN =>
                     submissionCallback.notifyOnFailure(
                       FormConfig.InvalidEan,
                     );
                     setShowInvalidEan(_ => true);
                   | _ => ()
                   };

                   Js.Promise.resolve(result);
                 }
               | _ =>
                 submissionCallback.notifyOnFailure(
                   FormConfig.UnexpectedServerError,
                 );
                 Js.Promise.resolve(ReasonApolloTypes.EmptyResponse);
               };
             })
          |> Js.Promise.catch(_ => {
               submissionCallback.notifyOnFailure(
                 FormConfig.UnexpectedServerError,
               );
               Js.Promise.resolve(ReasonApolloTypes.EmptyResponse);
             })
          |> ignore;
        },
      );

    let (formError, showFormError) = React.useState(() => false);
    let showMainError = formError && !form.valid();

    <Flex width={Css.pct(50.)} ml=`auto mr=`auto className=Styles.form>
      <CreateWareForm.Form form showFormError={() => showFormError(_ => true)}>
        <h1 className=Styles.title>
          <Text> {"Create new ware" |> str} </Text>
        </h1>
        <FormCommon.MainFormError show=showInvalidEan text="EAN is invalid!" />
        <FormCommon.MainFormError
          show=showMainError
          text="To continue, correct the following errors in your input."
        />
        <WareDataForm form />
        <Row className={Css.style([Css.justifyContent(`center)])}>
          <Col xs=6 md=6>
            <button type_="submit" className=Styles.submitButtonWithM>
              <Text> {"Create Ware" |> str} </Text>
            </button>
          </Col>
        </Row>
      </CreateWareForm.Form>
    </Flex>;
  };
};

[@react.component]
let make = () => {
  <SubmitWare> {(mutation, _) => <Form mutation />} </SubmitWare>;
}