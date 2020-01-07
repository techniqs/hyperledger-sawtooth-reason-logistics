open Utils;
module MandatoryAsterisk = ValidatedForm.MandatoryAsterisk;
module Styles = FormStyles;
open BsReactstrap;

module SubmitUser = RegistrationMutation.SubmitUser;
module SubmitUserQuery = RegistrationMutation.SubmitUserQuery;

module FormConfig = {
  include FormConfig;

  let validators = [
    usernameField.validator,
    registerPasswordField.validator,
    registerPasswordAgainField.validator,
  ];
};

module RegistrationForm = ValidatedForm.Make(FormConfig);

module UserFormConfig = {
  type interfaceType = RegistrationForm.Hook.interface;
  module Input = RegistrationForm.Input;
};

module RegistrationUserDataForm =
  FormCommon.RegistrationUserDataForm(UserFormConfig);

module Form = {
  [@react.component]
  let make = (~mutation: SubmitUser.apolloMutation) => {
    let (_, setCookies) = Cookie.useCookies();

    let (showUsernameAlreadyInUse, setShowUsernameAlreadyInUse) =
      React.useState(() => false);

    let form =
      RegistrationForm.useForm(
        ~initialState=FormConfig.initialState,
        ~onSubmit=(state, submissionCallback) => {
          let variables =
            SubmitUserQuery.makeWithVariables({
              "username": state.username,
              "password": state.password,
            });

          let parseToken = (res: SubmitUserQuery.MT_Ret.t) => {
            res##createUser##status === `OK ? res##createUser##token : None;
          };

          mutation(~variables=variables##variables, ())
          |> Js.Promise.then_(result => {
               let response:
                 ReasonApolloTypes.executionResponse(SubmitUserQuery.MT_Ret.t) = result;

               switch (response) {
               | Data(data) =>
                 switch (parseToken(data)) {
                 | Some(token) =>
                   setCookies("userToken", token, ());
                   ReasonReactRouter.replace("/");
                   Js.Promise.resolve(result);
                 | _ =>
                   submissionCallback.notifyOnFailure(
                     FormConfig.UsernameAlreadyExists,
                   );
                   setShowUsernameAlreadyInUse(_ => true);
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
      <RegistrationForm.Form
        form showFormError={() => showFormError(_ => true)}>
        <h1 className=Styles.title>
          <Text> {"New account registration" |> str} </Text>
        </h1>
        <FormCommon.MainFormError
          show=showUsernameAlreadyInUse
          text="Username already in use!"
        />
        <FormCommon.MainFormError
          show=showMainError
          text="To continue, correct the following errors in your input."
        />
        <RegistrationUserDataForm form />
        <Row className=Css.style([Css.justifyContent(`center)])>
          <Col xs=6 md=6>
            <button type_="submit" className=Styles.submitButtonWithM>
              <Text> {"Create account" |> str} </Text>
            </button>
          </Col>
        </Row>
        <Row className=Css.style([Css.justifyContent(`center)])>
          <Col xs=6 md=6 className=Styles.forgotPassword>
            <Link.Link2 page=LoginPage>
              <Flex className=Styles.link m=`auto>
                <Text> {"Back to login" |> str} </Text>
              </Flex>
            </Link.Link2>
          </Col>
        </Row>
      </RegistrationForm.Form>
    </Flex>;
  };
};

[@react.component]
let make = () => {
  <SubmitUser> {(mutation, _) => <Form mutation />} </SubmitUser>;
};