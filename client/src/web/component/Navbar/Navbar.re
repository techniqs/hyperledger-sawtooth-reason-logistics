module Styles = NavbarStyles;
open Utils;
[@react.component]
let make = () => {
  <Flex
    className=Styles.container
    p={Css.px(15)}
    justifyContent=`spaceBetween
    mb={Css.px(30)}>
    <Flex alignItems=`center>
      <Link.Link2 page=Routes.HomePage>
        <Text mr={Css.px(10)} color=Colors.marine1>
          {"Home" |> str}
        </Text>
      </Link.Link2>
      <Link.Link2 page=Routes.WareResultsPage>
        <Text mr={Css.px(10)} color=Colors.marine1>
          {"View Wares" |> str}
        </Text>
      </Link.Link2>
      <Link.Link2 page=Routes.UserResultsPage>
        <Text mr={Css.px(10)} color=Colors.marine1>
          {"View Users" |> str}
        </Text>
      </Link.Link2>
    </Flex>
    <Flex>
      <Link.Link2 page=Routes.LoginPage className=Styles.loginButton>
        <Text color=Colors.marine1> {"Login / Register" |> str} </Text>
      </Link.Link2>
    </Flex>
  </Flex>;
};