open Css;

let link =
  merge([
    style([
      cursor(`pointer),
      color(Colors.orange),
       fontSize(px(18)), fontWeight(semiBold),
       justifyContent(center),
       textDecoration(underline),
      hover([color(Colors.orange2)]),
    ]),
  ]);

  let nav = style([
    borderBottom(px(1), solid, Colors.orange),
    borderTop(px(1), solid, Colors.orange),
])
