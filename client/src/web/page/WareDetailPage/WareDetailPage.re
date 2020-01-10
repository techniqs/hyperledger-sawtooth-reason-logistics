module Styles = WareDetailPageStyles;
open Utils;
open Cookie;
[@react.component]
let make = (~params: string) => {
  let (cookies, _) = useCookies();

  let checkUsername = (username, trueValue, falseValue) => {
    switch (cookies |> getUsername) {
    | Some(me) => me === username ? trueValue : falseValue
    | _ => falseValue
    };
  };

  <Layout>
    <Flex full=true flexDirection=`column>
      <Flex full=true justifyContent=`spaceBetween py={Css.px(12)}>
        <GetWareQuery ean=params>
          {response => {
             Js.log2("response", response);
             <>
               <Flex flexDirection=`column full=true>
                 <Flex mb={Css.px(30)} full=true flexDirection=`column>
                   <Flex mb={Css.px(10)} justifyContent=`spaceBetween>
                     <Flex alignItems=`center>
                       <Text fontSize={Css.px(18)} mr={Css.px(10)}>
                         {"EAN:" |> str}
                       </Text>
                       <Text fontSize={Css.px(18)} color=Colors.orange>
                         {response##getWare##ean |> str}
                       </Text>
                     </Flex>
                     <Flex alignItems=`center>
                       <Text fontSize={Css.px(18)} mr={Css.px(10)}>
                         {"Name:" |> str}
                       </Text>
                       <Text fontSize={Css.px(18)} color=Colors.orange>
                         {response##getWare##name |> str}
                       </Text>
                     </Flex>
                   </Flex>
                   <Flex mb={Css.px(10)} justifyContent=`spaceBetween>
                     <Flex alignItems=`center>
                       <Text fontSize={Css.px(18)} mr={Css.px(10)}>
                         {"Owner:" |> str}
                       </Text>
                       <Text fontSize={Css.px(18)} color=Colors.orange>
                         {response##getWare##owner##username |> str}
                       </Text>
                     </Flex>
                     <Flex alignItems=`center>
                       <Text fontSize={Css.px(18)} mr={Css.px(10)}>
                         {"UVP:" |> str}
                       </Text>
                       <Text fontSize={Css.px(18)} color=Colors.orange>
                         {
                           let uvp =
                             response##getWare##uvp |> Js.Float.toString;
                           {j|$uvp€|j} |> str;
                         }
                       </Text>
                     </Flex>
                   </Flex>
                   <Flex mb={Css.px(10)} justifyContent=`spaceBetween>
                     <Flex alignItems=`center>
                       <Text fontSize={Css.px(18)} mr={Css.px(10)}>
                         {"Created at:" |> str}
                       </Text>
                       <Text fontSize={Css.px(18)} color=Colors.orange>
                         {response##getWare##createdAt |> str}
                       </Text>
                     </Flex>
                     <Flex alignItems=`center>
                       <Text fontSize={Css.px(18)} mr={Css.px(10)}>
                         {"Last updated at:" |> str}
                       </Text>
                       <Text fontSize={Css.px(18)} color=Colors.orange>
                         {response##getWare##updatedAt |> str}
                       </Text>
                     </Flex>
                   </Flex>
                 </Flex>
                 <WareMap locations=response##getWare##locations />
                 <Flex
                   full=true
                   justifyContent={checkUsername(
                     response##getWare##owner##username,
                     `spaceAround,
                     `center,
                   )}
                   mt={Css.px(20)}>
                   <Link.Link2 page={WareHistoryPage({ean: params})}>
                     <Flex className=Styles.link m=`auto>
                       <Text> {"Update History" |> str} </Text>
                     </Flex>
                   </Link.Link2>
                   {checkUsername(
                      response##getWare##owner##username,
                      <Link.Link2 page={WareEditPage({ean: params})}>
                        <Flex className=Styles.link m=`auto>
                          <Text> {"Edit Ware" |> str} </Text>
                        </Flex>
                      </Link.Link2>,
                      React.null,
                    )}
                 </Flex>
               </Flex>
             </>;
           }}
        </GetWareQuery>
      </Flex>
    </Flex>
  </Layout>;
};