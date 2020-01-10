open Utils;
module MandatoryAsterisk = ValidatedForm.MandatoryAsterisk;
module Styles = FormStyles;
open BsReactstrap;

module SubmitWare = EditWareMutation.SubmitWare;
module SubmitWareQuery = EditWareMutation.SubmitWareQuery;

module FormConfig = {
  include WareFormConfig;

  let validators = [
    nameField.validator,
    longitudeField.validator,
    latitudeField.validator,
    uvpField.validator,
    ownerField.validator,
  ];
};

module EditWareForm = ValidatedForm.Make(FormConfig);

module WareFormConfig = {
  type interfaceType = EditWareForm.Hook.interface;
  module Input = EditWareForm.Input;
};

module WareDataForm = WareFormCommon.EditWareDataForm(WareFormConfig);

module Form = {
  [@react.component]
  let make = (~mutation: SubmitWare.apolloMutation, ~ean: string, ~initialState:FormConfig.state) => {
    let (showInvalidEan, setShowInvalidEan) = React.useState(() => false);
    let (showInvalidUser, setShowInvalidUser) = React.useState(() => false);

    let form =
      EditWareForm.useForm(
        ~initialState,
        ~onSubmit=(state, submissionCallback) => {
          let variables =
            SubmitWareQuery.makeWithVariables({
              "ean": ean,
              "name": state.name,
              "longitude": state.longitude,
              "latitude": state.latitude,
              "uvp": state.uvp,
              "owner": Some(state.owner),
            });

          let parseToken = (res: SubmitWareQuery.MT_Ret.t) => {
            res##updateWare##status === `OK
              ? Some(res##updateWare##ean) : None;
          };

          let getStatus = (res: SubmitWareQuery.MT_Ret.t) => {
            res##updateWare##status;
          };

          mutation(~variables=variables##variables, ())
          |> Js.Promise.then_(result => {
               let response:
                 ReasonApolloTypes.executionResponse(SubmitWareQuery.MT_Ret.t) = result;

               switch (response) {
               | Data(data) =>
                 switch (parseToken(data)) {
                 | Some(ean) =>
                   let url = "/";
                  //  let url = "/ware/ean=" ++ ean;
                   ReasonReactRouter.replace(url);
                   Js.Promise.resolve(result);
                 | _ =>
                   switch (getStatus(data)) {
                   | `INVALIDEAN =>
                     submissionCallback.notifyOnFailure(
                       FormConfig.InvalidEan,
                     );
                     setShowInvalidEan(_ => true);
                    | `INVALIDUSER =>
                     submissionCallback.notifyOnFailure(
                       FormConfig.InvalidUser,
                     );
                     setShowInvalidUser(_ => true);
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
      <EditWareForm.Form form showFormError={() => showFormError(_ => true)}>
        <h1 className=Styles.title>
          <Text> {{j|Edit $ean |j} |> str} </Text>
        </h1>
        <FormCommon.MainFormError show=showInvalidEan text="EAN is invalid!" />
        <FormCommon.MainFormError show=showInvalidUser text="User is invalid!" />
        <FormCommon.MainFormError
          show=showMainError
          text="To continue, correct the following errors in your input."
        />
        <WareDataForm form />
        <Row className={Css.style([Css.justifyContent(`center)])}>
          <Col xs=6 md=6>
            <button type_="submit" className=Styles.submitButtonWithM>
              <Text> {"Update Ware" |> str} </Text>
            </button>
          </Col>
        </Row>
      </EditWareForm.Form>
    </Flex>;
  };
};

[@react.component]
let make = (~ean:string) => {
        <GetWareQuery ean>
        {response => {
          let location =Array.get(response##getWare##locations,(Array.length(response##getWare##locations)-1));

          let longitude= switch(location){
            | Some(location) => location##longitude
            | _ => 0.0
          };
          let latitude = switch(location){
            | Some(location) => location##latitude
            | _ => 0.0
          };

          // let latitude =Array.get(response##getWare##locations,(Array.length(response##getWare##locations)-1))##longitude;

          let initialState:FormConfig.state = {
            ean,
            name: response##getWare##name,
            longitude,
            latitude,
            uvp: response##getWare##uvp,
            owner: response##getWare##owner##username,
          };

  <SubmitWare> {(mutation, _) => <Form mutation ean initialState/>} </SubmitWare>
         }} </GetWareQuery>
  ;
}