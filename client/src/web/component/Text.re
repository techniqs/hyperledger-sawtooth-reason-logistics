open Utils;

type fontWeightType = [ Css.Types.FontWeight.t | Css.Types.Cascading.t];
type fontSizeType = [ Css.Types.Length.t | Css.Types.Cascading.t];
type textAlignType = [ Css.Types.TextAlign.t | Css.Types.Cascading.t];
type textFontStyleType = [ Css.Types.FontStyle.t | Css.Types.Cascading.t];
type textLineHeightType = [
  Css.Types.LineHeight.t
  | Css.Types.Length.t
  | Css.Types.Cascading.t
];
type whiteSpaceType = [ Css.Types.WhiteSpace.t | Css.Types.Cascading.t];
type textDecorationType = [
  | `none
  | `underline
  | `overline
  | `lineThrough
  | Css.Types.Cascading.t
];
type marginType = [ Css.Types.Length.t | Css.Types.Margin.t];

[@react.component]
let make =
    (
      ~fontSize: option(fontSizeType)=?,
      ~fontWeight: option(fontWeightType)=?,
      ~lineHeight: option(textLineHeightType)=?,
      ~children: React.element,
      ~className: string="",
      ~color: option(Css.Types.Color.t)=?,
      ~fontFamily: string="Poppins",
      ~fontStyle: option(textFontStyleType)=?,
      ~full: bool=false,
      ~hoverColor: option(Css.Types.Color.t)=?,
      ~hoverFontWeight: option(fontWeightType)=?,
      ~whiteSpaceAfterText: bool=false,
      ~whiteSpaceBeforeText: bool=false,
      ~inlineBlock: bool=true,
      ~m: option(marginType)=?,
      ~mb: option(marginType)=?,
      ~ml: option(marginType)=?,
      ~mr: option(marginType)=?,
      ~mt: option(marginType)=?,
      ~mx: option(marginType)=?,
      ~my: option(marginType)=?,
      ~textAlign: option(textAlignType)=?,
      ~textDecoration: option(textDecorationType)=?,
      ~whiteSpace: option(whiteSpaceType)=?,
      ~ellipsis=false,
      ~cursor: option(Css.Types.Cursor.t)=?,
    ) => {
  let hoverStyle =
    switch (hoverColor, hoverFontWeight) {
    | (Some(hoverColor), Some(hoverFontWeight)) =>
      Some([Css.color(hoverColor), Css.fontWeight(hoverFontWeight)])
    | (Some(hoverColor), _) => Some([Css.color(hoverColor)])
    | (_, Some(hoverFontWeight)) => Some([Css.fontWeight(hoverFontWeight)])
    | _ => None
    };

  let style =
    [|
      applyStyle(mb, my, m, Css.marginBottom),
      applyStyle(ml, mx, m, Css.marginLeft),
      applyStyle(mr, mx, m, Css.marginRight),
      applyStyle(mt, my, m, Css.marginTop),
      color |> map(color => Css.color(color)),
      fontSize |> map(fontSize => Css.fontSize(fontSize)),
      fontWeight |> map(fontWeight => Css.fontWeight(fontWeight)),
      lineHeight |> map(lineHeight => Css.lineHeight(lineHeight)),
      fontStyle |> map(fontStyle => Css.fontStyle(fontStyle)),
      textAlign |> map(textAlign => Css.textAlign(textAlign)),
      textDecoration
      |> map(textDecoration => Css.textDecoration(textDecoration)),
      hoverStyle |> map(hoverStyle => Css.hover(hoverStyle)),
      whiteSpace |> map(whiteSpace => Css.whiteSpace(whiteSpace)),
      cursor |> map(cursor => Css.cursor(cursor)),
    |]
    |> filterNone
    |> List.fromArray;

  let elementClassName =
    Css.merge([
      "text",
      Css.style([
        Css.display(inlineBlock ? `inlineBlock : `inline),
        Css.fontFamily(`custom(fontFamily)),
        Css.width(full ? Css.pct(100.) : `auto),
        Css.textOverflow(ellipsis ? `ellipsis : `initial),
        Css.wordBreak(ellipsis ? `breakAll : `initial),
        Css.overflow(ellipsis ? `hidden : `visible),
        Css.before(whiteSpaceBeforeText ? [Css.contentRule("\00a0 ")] : []),
        Css.after(whiteSpaceAfterText ? [Css.contentRule("\00a0 ")] : []),
        ...style,
      ]),
      className,
    ]);

  <span className=elementClassName> children </span>;
};