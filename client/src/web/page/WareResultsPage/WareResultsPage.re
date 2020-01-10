module Styles = WareResultsPageStyles;
open Utils;
[@react.component]
let make = () => {
  let renderAttributes =
      (
        ~response,
        ~ean: bool=false,
        ~uvp: bool=false,
        ~name: bool=false,
        added,
      ) => {
    response##listWares
    |> Array.mapi((ware, index) =>
         <Flex
           key={index |> string_of_int}
           py={Css.px(15)}
           full=true
           justifyContent=`center>
           {ean
              ? <Link.Link2 page={WareDetailPage({ean: ware##ean})}>
                  <Text
                    className=Styles.hover
                    fontSize={Css.px(18)}
                    fontWeight=`semiBold
                    color=Colors.orange>
                    {ware##ean |> str}
                  </Text>
                </Link.Link2>
              : React.null}
           <Text fontSize={Css.px(18)} color=Colors.grey1>
             {switch (uvp, name, added) {
              | (true, _, _) =>
                let uvp = ware##uvp |> Js.Float.toString |> str;
                {j|$uvp €|j} |> str;
              | (_, true, _) => ware##name |> str
              | (_, _, true) => ware##createdAt |> str
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
        <WareResultsQuery>
          {response =>
             Array.length(response##listWares) === 0
               ? <Flex full=true justifyContent=`center mt={Css.px(30)}>
                   <Text
                     fontSize={Css.px(16)}
                     fontWeight=`semiBold
                     color=Colors.orange>
                     {"No wares found!" |> str}
                   </Text>
                 </Flex>
               : <>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       full=true
                       justifyContent=`center
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"EAN" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, ~ean=true, false)}
                   </Flex>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       full=true
                       justifyContent=`center
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"Name" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, ~name=true, false)}
                   </Flex>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       justifyContent=`center
                       full=true
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"UVP" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, ~uvp=true, false)}
                   </Flex>
                   <Flex full=true flexDirection=`column>
                     <Flex
                       py={Css.px(12)}
                       full=true
                       justifyContent=`center
                       className=Styles.nav>
                       <Text fontSize={Css.px(16)} fontWeight=`semiBold>
                         {"Added" |> str}
                       </Text>
                     </Flex>
                     {renderAttributes(~response, true)}
                   </Flex>
                 </>}
        </WareResultsQuery>
      </Flex>
    </Flex>
  </Layout>;
};