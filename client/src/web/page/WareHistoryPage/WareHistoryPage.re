module Styles = WareDetailPageStyles;
open Utils;
[@react.component]
let make = (~params: string) => {
  let renderAttributes =
      (~response, ~location: bool=false, ~owner: bool=false, added) => {
    response##getUpdateHistory
    |> Array.mapi((update, index) =>
         <Flex
           key={index |> string_of_int}
           py={Css.px(15)}
           full=true
           justifyContent=`center>
           <Text fontSize={Css.px(18)} color=Colors.grey1>
             {switch (location, owner, added) {
              | (true, _, _) =>
                let longitude =
                  update##location##longitude |> Js.Float.toString |> str;
                let latitude =
                  update##location##latitude |> Js.Float.toString |> str;
                {j|$latitude , $longitude|j} |> str;
              | (_, true, _) => update##owner |> str
              | (_, _, true) => update##createdAt |> str
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
        <WareUpdateHistoryQuery ean=params>
          {response => {
             Js.log2("response", response);
             <Flex full=true flexDirection=`column>
               <Flex
                 full=true
                 mb={Css.px(10)}
                 flexDirection=`row
                 justifyContent=`center>
                 <Text fontSize={Css.px(21)} mr={Css.px(4)}>
                   {"EAN: " |> str}
                 </Text>
                 <Text fontSize={Css.px(21)} color=Colors.orange>
                   {params |> str}
                 </Text>
               </Flex>
               <Flex full=true justifyContent=`center mb={Css.px(20)}>
                 <Link.Link2 page={WareDetailPage({ean: params})}>
                   <Flex className=Styles.link m=`auto>
                     <Text> {"Back to ware" |> str} </Text>
                   </Flex>
                 </Link.Link2>
               </Flex>
               <WareMap
                 locations={
                   response##getUpdateHistory
                   |> Array.map(update => update##location)
                 }
               />
               <Flex mt={Css.px(20)}>
                 <Flex full=true flexDirection=`column>
                   <Flex
                     py={Css.px(12)}
                     full=true
                     justifyContent=`center
                     className=Styles.nav>
                     <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                       {"Location" |> str}
                     </Text>
                   </Flex>
                   {renderAttributes(~response, ~location=true, false)}
                 </Flex>
                 <Flex full=true flexDirection=`column>
                   <Flex
                     py={Css.px(12)}
                     full=true
                     justifyContent=`center
                     className=Styles.nav>
                     <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                       {"Owner" |> str}
                     </Text>
                   </Flex>
                   {renderAttributes(~response, ~owner=true, false)}
                 </Flex>
                 <Flex full=true flexDirection=`column>
                   <Flex
                     py={Css.px(12)}
                     justifyContent=`center
                     full=true
                     className=Styles.nav>
                     <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                       {"Added" |> str}
                     </Text>
                   </Flex>
                   {renderAttributes(~response, true)}
                 </Flex>
               </Flex>
             </Flex>;
           }}
        </WareUpdateHistoryQuery>
      </Flex>
    </Flex>
  </Layout>;
};