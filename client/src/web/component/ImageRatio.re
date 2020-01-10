[@react.component]
let make =
    (
      ~children: React.element=?,
      ~className: string="",
      ~ratio: float=1.,
      ~src: option(string)=?,
    ) => {
  <Flex
    position=`relative
    full=true
    pt={Css.pct(ratio *. 100.)}
    overflow=`hidden
    className=Css.(
      style([
        selector(
          "> *",
          [
            position(`absolute),
            height(pct(100.)),
            width(pct(100.)),
            top(pct(50.)),
            left(pct(50.)),
            transform(translate(pct(-50.), pct(-50.))),
          ],
        ),
      ])
    )>
    {switch (src) {
     | Some(src) => <Image className src />
     | _ => children
     }}
  </Flex>;
};
