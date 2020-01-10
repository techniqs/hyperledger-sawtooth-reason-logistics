module SubmitWareQuery = [%graphql
  {|
  mutation UpdateWareMutation ($ean: String!, $name: String!, $longitude: Float!, $latitude: Float!, $uvp: Float!, $owner: String) {
        updateWare(input: {ean: $ean, name: $name, longitude: $longitude, latitude: $latitude, uvp: $uvp, owner: $owner}) {
            ean
            status
        }
    }
|}
];

module SubmitWare = ReasonApollo.CreateMutation(SubmitWareQuery);