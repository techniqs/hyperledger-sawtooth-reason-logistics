open Css;

let container = style([
    boxShadow(Shadow.box(~blur=px(5), rgba(0, 0, 0, 0.16))),
    background(Colors.dark),
]);

let shHover = style([
    marginRight(px(10)),
    padding(px(3)),
    hover([ border(px(1), solid,Colors.orange), borderRadius(px(5)),
    ])
])

let loginButton = style([
    fontSize(px(16)),
    border(px(1), solid,Colors.orange),
    padding(px(5)),
    borderRadius(px(5)),
    color(Colors.orange),
    hover([background(Colors.orange2), color(Colors.white)])
])