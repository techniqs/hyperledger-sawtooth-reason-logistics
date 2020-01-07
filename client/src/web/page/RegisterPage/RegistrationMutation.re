module SubmitUserQuery = [%graphql
  {|
  mutation RegistrationMutation ($username: String!, $password: String!) {
        createUser(input: {username: $username, password: $password}) {
            status
            token
        }
    }
|}
];

module SubmitUser = ReasonApollo.CreateMutation(SubmitUserQuery);