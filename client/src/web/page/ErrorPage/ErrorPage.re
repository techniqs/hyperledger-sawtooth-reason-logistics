open Utils;
[@react.component]
let make = () => {
  <Layout>
    <Text fontSize={Css.px(21)} color=Colors.warning1>
      {"Error, nothing to see here :)" |> str}
    </Text>
  </Layout>;
};