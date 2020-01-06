[@react.component]
let make = (~children) => {
  <Flex flexDirection=`column>
    <Navbar />
    <Flex full=true maxWidth={Css.px(1140)} mr=`auto ml=`auto>
      children
    </Flex>
  </Flex>;
};