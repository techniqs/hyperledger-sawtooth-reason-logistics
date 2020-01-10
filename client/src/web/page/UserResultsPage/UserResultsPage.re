module Styles = WareResultsPageStyles;
open Utils;
[@react.component]
let make = () => {
  let renderAttributes =
      (
        ~response,
        ~username: bool=false,
        ~pubKey: bool=false,
        createdAt
      ) => {
    response##listUsers
    |> Array.mapi((user, index) =>
         <Flex
           key={index |> string_of_int}
           py={Css.px(15)}
           full=true
           justifyContent=`center>
           <Text
             fontSize={Css.px(16)}>
             {switch (username, pubKey, createdAt) {
              | (true, _, _) => user##username |> str
              | (_, true, _) => user##pubKey |> str
              | (_, _, true) => user##createdAt |> str
              | (_, _, _) => React.null
              }}
           </Text>
         </Flex>
       )
    |> React.array;
  };

  <Layout>
    <Flex full=true flexDirection=`column>
      <Flex full=true justifyContent=`spaceBetween py={Css.px(12)}>
        <UserResultsQuery>
          {response =>
             Array.length(response##listUsers) === 0
               ? <Flex full=true justifyContent=`center mt={Css.px(30)}>
                   <Text
                     fontSize={Css.px(16)}
                     fontWeight=`semiBold
                     color=Colors.orange>
                     {"No users found!" |> str}
                   </Text>
                 </Flex>
               : <>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       full=true
                       justifyContent=`center
                       mb={Css.px(10)}
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"Public Key" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, ~pubKey=true, false)}
                   </Flex>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       full=true
                       mb={Css.px(10)}
                       justifyContent=`center
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"Username" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, ~username=true, false)}
                   </Flex>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       justifyContent=`center
                       full=true
                       mb={Css.px(10)}
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"Added" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, true)}
                   </Flex>
                 </>}
        </UserResultsQuery>
      </Flex>
    </Flex>
  </Layout>;
};