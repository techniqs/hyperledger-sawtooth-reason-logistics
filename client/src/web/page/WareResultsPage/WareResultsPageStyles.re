open Css;

let nav = style([
    borderBottom(px(1), solid, Colors.orange),
    borderTop(px(1), solid, Colors.orange),
])


let hover = style([
    hover([
        textDecoration(underline),
        color(Colors.orange),
        cursor(`pointer)
    ])
])

