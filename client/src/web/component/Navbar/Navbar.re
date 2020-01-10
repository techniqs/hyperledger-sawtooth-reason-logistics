module Styles = NavbarStyles;
open Utils;
open Cookie;
[@react.component]
let make = () => {
  let (cookies, _setCookies) = useCookies();
  let (_, _, removeCookie) = removeCookie();

  <Flex
    className=Styles.container
    p={Css.px(15)}
    justifyContent=`spaceBetween
    mb={Css.px(50)}
    full=true>
    <Flex alignItems=`center>
      <Link.Link2 page=Routes.HomePage className=Styles.shHover>
        <Text fontSize={Css.px(16)} color=Colors.orange>
          {"Home" |> str}
        </Text>
      </Link.Link2>
      {userLoggedIn(cookies) ? 
      <Link.Link2 page=Routes.WareCreatePage className=Styles.shHover>
        <Text fontSize={Css.px(16)} color=Colors.orange>
          {"Create Ware" |> str}
        </Text>
      </Link.Link2>
      : React.null}
      <Link.Link2 page=Routes.WareResultsPage className=Styles.shHover>
        <Text fontSize={Css.px(16)} color=Colors.orange>
          {"View Wares" |> str}
        </Text>
      </Link.Link2>
      <Link.Link2 page=Routes.UserResultsPage className=Styles.shHover>
        <Text fontSize={Css.px(16)} color=Colors.orange>
          {"View Users" |> str}
        </Text>
      </Link.Link2>
    </Flex>
    <Flex>
      {userLoggedIn(cookies)
         ? <Flex
             className=Styles.loginButton
             onClick={_ => {removeCookie(. "userToken"); removeCookie(. "username"); reload();}}>
             <Text> {"Logout" |> str} </Text>
           </Flex>
         : <Link.Link2 page=Routes.LoginPage className=Styles.loginButton>
             <Text> {"Login / Register" |> str} </Text>
           </Link.Link2>}
    </Flex>
  </Flex>;
};