open Css;


module GlobalStyle = {
  Utils.requireCss("./Form.css");
  Utils.requireCss("./Fonts.css");

  global(
    "html",
    [
      fontSize(px(14)),
      fontFamily(`custom("Poppins")),
      fontWeight(normal),
      backgroundColor(Colors.white),
    ],
  );
  global(
    "body",
    [
      fontFamily(`custom("Poppins")),
      fontWeight(normal),
      color(hex("424346")),
      overflowY(scroll),
      overflowX(hidden),
      margin(`zero),
    ],
  );
  global("root", [maxWidth(vw(100.)), overflowX(`hidden)]);
  global(
    ".container",
    [
      maxWidth(pct(80.0)),
      media("(max-width: 991px)", [maxWidth(pct(100.0))]),
    ],
  );

  // ********** SCROLLBAR **************
  global("::-webkit-scrollbar", [width(px(7)), paddingRight(px(5))]);
  global("::-webkit-scrollbar-track", [backgroundColor(hex("f1f1f1"))]);
  global("::-webkit-scrollbar-thumb", [backgroundColor(hex("d9dde5"))]);
  global(
    "::-webkit-scrollbar-thumb:hover",
    [backgroundColor(hex("aeb1b8"))],
  );

  // ********** SCROLLBAR **************
  global("label", [display(block)]);

  // ********** ALLERT **************
  global(
    ".alert",
    [
      borderWidth(`zero),
      padding2(~h=px(17), ~v=px(14)),
      borderRadius(`zero),
    ],
  );

  global(
    ".alert-success",
    [backgroundColor(Colors.checked2), color(Colors.checked1)],
  );

  global("a", [important(textDecoration(`none))]);
  // ********** ALLERT **************
};
