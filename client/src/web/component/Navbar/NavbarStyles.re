open Css;

let container = style([
    boxShadow(Shadow.box(~blur=px(5), rgba(0, 0, 0, 0.16))),
]);

let shHover = style([
    marginRight(px(10)),
    hover([padding(px(3)), boxShadow(Shadow.box(~blur=px(5), rgba(0, 0, 0, 0.16)))])
])

let loginButton = style([
    fontSize(px(16)),
    border(px(1), solid,Colors.marine1),
    padding(px(5)),
    borderRadius(px(5)),
    hover([background(Colors.marine3),boxShadow(Shadow.box(~blur=px(5), rgba(0, 0, 0, 0.16)))])
])