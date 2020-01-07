open Css;

let cbIcon = style([width(px(20)), marginRight(px(5))]);

let marginWrapper =
  style([marginLeft(px(16)), marginRight(px(16))]);

let maxWidth = style([width(pct(100.))]);

let title =
  style([
    margin(px(0)),
    marginLeft(px(16)),
    color(Colors.grey1),
    marginBottom(px(16)),
    fontSize(px(30)),
    fontWeight(`semiBold),
  ]);

let cashBackTitle = merge([title, style([marginBottom(px(8))])]);
let text =
  style([margin(px(0)), color(Colors.grey1)]);

let marginWhiteSpace = (mergeCss: string) => {
  merge([mergeCss, style([marginRight(px(4))])]);
};

let paddingLeftAndRight = style([padding2(~v=px(0), ~h=px(16))]);

let textWithPaddingandMb =
  merge([
    paddingLeftAndRight,
    text,
    style([marginBottom(px(16))]),
  ]);

let cashBackText = newColor => {
  merge([
    text,
    style([
      color(newColor),
      marginLeft(px(16)),
      marginRight(px(16)),
      marginBottom(px(24)),
    ]),
  ]);
};

let form =
  style([
    selector("label", [fontSize(px(14))]),
    selector(
      "input[type='text'], input[type='email'], select, textarea",
      [borderRadius(px(0)), fontSize(px(14))],
    ),
    selector(".invalid-feedback", [fontSize(px(14)), fontWeight(semiBold)]),
  ]);
let label =
  merge([
    text,
    style([marginLeft(pxFloat(32.5)), textIndent(pxFloat(-32.5))]),
  ]);

let submitButton =
  style([
    width(pct(100.0)),
    background(Colors.marine1),
    height(px(44)),
    marginTop(px(28)),
    borderRadius(px(4)),
    border(px(0), `none, Colors.marine1),
    color(white),
    fontSize(px(14)), fontWeight(semiBold),
    hover([backgroundColor(Colors.marine2)]),
  ]);

let submitButtonWithM = merge([submitButton, style([marginTop(px(24))])]);
let submitButtonWithoutM =
  merge([submitButton, style([marginTop(px(0))])]);
let submitButtonWith12 = merge([submitButton, style([marginTop(px(12))])]);

let cashbackButton =
  merge([
    submitButton,
    style([
      background(Colors.cashback1),
      marginTop(px(12)),
      hover([
        backgroundColor(Colors.cashback2),
        color(Colors.white),
        textDecoration(none),
      ]),
      color(Colors.white),
    ]),
  ]);

let cashbackButtonOuter =
  merge([
    cashbackButton,
    style([
      display(flexBox),
      justifyContent(center),
      alignItems(center),
      hover([cursor(`pointer)]),
    ]),
  ]);

let link =
  merge([
    style([
      cursor(`pointer),
      color(Colors.marine1),
       fontSize(px(14)), fontWeight(semiBold),
       justifyContent(center),
      hover([color(Colors.marine2)]),
    ]),
  ]);

let inlineLink = merge([link, style([display(inline)])]);


let modalLink =
  merge([
    inlineLink,
    style([display(inlineBlock), textIndent(px(0)), fontSize(px(14))]),
  ]);

let forgotPassword =
  style([marginTop(px(24)), textAlign(center)]);
