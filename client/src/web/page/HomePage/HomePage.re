open Utils;
[@react.component]
let make = () => {
  <Layout>
    <Flex flexDirection=`column>
      <Flex full=true justifyContent=`center>
        <Text fontSize={Css.px(30)} color=Colors.orange>
          {"Hyperledger Sawtooth Reason Logistics" |> str}
        </Text>
      </Flex>
      <Flex mt={Css.px(50)}>
        <Text fontSize={Css.px(16)}>
          {"Hyperledger Sawtooth Reason Logistics is a logistics application for managing wares built with Hyperledger Sawtooth, ReasonML/Reason-react and JS. It provides a frontend where one may manage users and wares while using the blockchain technology of hyperledger sawtooth to store the data transparently. The transaction processor is implemented in ReasonML, which includes type-safety, therefore ensuring validity on the blockchain."
           |> str}
        </Text>
      </Flex>
      <Flex mt={Css.px(20)}>
        <Text fontSize={Css.px(16)}>
          {"An api, implemented in nodejs, is in charge of processing, wrapping and feeding requests into the validator of sawtooth. After validating this transaction, an event is broadcasted to the corresponding transaction processor.  Consequently, the data is stored on the blockchain, while another event is emitted for the subscription client. This node js application waits for data to be persisted into a database, which then gets queried by the beforementioned api."
           |> str}
        </Text>
      </Flex>
      <Flex mt={Css.px(20)}>
        <Text fontSize={Css.px(16)}>
          {"To use hyperledger Sawooth Reason Logistics, create an account using the button in the navbar above. Once an account got created, you are immediatly logged in. You will be able to add new wares, update attributes of the newly created ware, update its location and transfer the ware to another existing user."
           |> str}
        </Text>
      </Flex>
      <Flex mt={Css.px(30)}>
        <Link
          href="https://www.hyperledger.org/projects/sawtooth"
          className=Css.(
            style([
              hover([color(Colors.orange2), textDecoration(`underline)]),
              color(Colors.orange),
              fontSize(px(12)),
            ])
          )>
          {"Click here to find out more about Sawtooth!" |> str}
        </Link>
      </Flex>
    </Flex>
  </Layout>;
};