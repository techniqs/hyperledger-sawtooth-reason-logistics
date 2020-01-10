open Utils;
module MandatoryAsterisk = ValidatedForm.MandatoryAsterisk;
module Styles = FormStyles;
open BsReactstrap;
module SubmitLogin = LoginQuery.SubmitLogin;
module LoginQuery = LoginQuery.Query;

module FormConfig = {
  include FormConfig;

  let validators = [usernameField.validator, loginPasswordField.validator];
};

module LoginForm = ValidatedForm.Make(FormConfig);

module UserFormConfig = {
  type interfaceType = LoginForm.Hook.interface;
  module Input = LoginForm.Input;
  module Checkbox = LoginForm.Checkbox;
};

module LoginUserDataForm = FormCommon.LoginUserDataForm(UserFormConfig);

module Form = {
  [@react.component]
  let make = (~apolloClient: ApolloClient.generatedApolloClient) => {
    let (showWrongCredentials, setshowWrongCredentials) =
      React.useState(() => false);

    let (_, setCookies) = Cookie.useCookies();

    let form =
      LoginForm.useForm(
        ~initialState=FormConfig.initialState,
        ~onSubmit=(state, submissionCallback) => {
          let params =
            LoginQuery.makeWithVariables({
              "username": state.username,
              "password": state.password,
            });
          let query =
            apolloClient##query({
              "query": ApolloClient.gql(. params##query),
              "variables": params##variables,
            })
            |> Js.Promise.then_((result: ReasonApolloQuery.renderPropObjJS) =>
                 Js.Promise.resolve(
                   switch (
                     result
                     |> ReasonApolloQuery.dataGet
                     |> ReasonApolloUtils.getNonEmptyObj
                   ) {
                   | None => None
                   | Some(data) =>
                     switch (LoginQuery.parse(data)) {
                     | parsedData => Some(parsedData)
                     | exception _ => None
                     }
                   },
                 )
               );

          let parseToken = (result: option(LoginQuery.MT_Ret.t)) => {
            result
            |> flatMap(res =>
                 res##loginUser##status === `OK ? res##loginUser##token : None
               );
          };

          query
          |> Js.Promise.then_((result: option(LoginQuery.MT_Ret.t)) =>
               switch (parseToken(result)) {
               | Some(token) =>
                 {
                   setCookies("userToken", token, ());
                   setCookies("username", state.username, ());
                   reload();
                 };
                 Js.Promise.resolve(result);
               | _ =>
                 Js.log("WRONG SIGN IN");
                 submissionCallback.notifyOnFailure(FormConfig.BadLogin);
                 setshowWrongCredentials(_ => true);
                 Js.Promise.resolve(result);
               }
             )
          |> Js.Promise.catch(_ => {
               submissionCallback.notifyOnFailure(
                 FormConfig.UnexpectedServerError,
               );
               Js.Promise.resolve(None);
             })
          |> ignore;
          ();
        },
      );

    let (formError, showFormError) = React.useState(() => false);
    let showMainError = formError && !form.valid();

    <Flex width=Css.pct(50.) ml=`auto mr=`auto className=Styles.form>
      <LoginForm.Form form showFormError={() => showFormError(_ => true)}>
        <h1 className=Styles.title> <Text> {"Sign in" |> str} </Text> </h1>
        <FormCommon.MainFormError
          show=showWrongCredentials
          text="Invalid credentials!"
        />
        <FormCommon.MainFormError
          show=showMainError
          text="To continue, correct the following errors in your input."
        />
        <LoginUserDataForm form />
        <Row className=Css.style([Css.justifyContent(`center)])>
          <Col xs=6 md=6>
            <button type_="submit" className=Styles.submitButton>
              <Text> {"Log in" |> str} </Text>
            </button>
          </Col>
        </Row>
        <Row className=Css.style([Css.justifyContent(`center)])>
          <Col xs=6 md=6 className=Styles.forgotPassword>
            <Link.Link2 page=RegisterPage>
              <Flex className=Styles.link m=`auto>
                <Text> {"No Account yet? Register here!" |> str} </Text>
              </Flex>
            </Link.Link2>
          </Col>
        </Row>
      </LoginForm.Form>
    </Flex>;
  };
};

[@react.component]
let make = () => {
  <ApolloConsumer> {apolloClient => <Form apolloClient />} </ApolloConsumer>;
};