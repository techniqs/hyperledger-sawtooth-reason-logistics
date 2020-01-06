open Css;

let container = style([
    boxShadow(Shadow.box(~blur=px(5), rgba(0, 0, 0, 0.16))),
]);


let loginButton = style([
    border(px(1), solid,Colors.marine1),
    padding(px(3)),
    borderRadius(px(5))
])