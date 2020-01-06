module Query = [%graphql
  {|
  query LoginQuery ($username: String!, $password: String!) {
        loginUser(input: {username: $username, password: $password}) {
            token
            status
        }
    }
|}
];

module SubmitLogin = ReasonApollo.CreateQuery(Query);