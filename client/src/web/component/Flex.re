open Utils;

type backgroundType = [
  Css.Types.Color.t
  | Css.Types.Url.t
  | Css.Types.Gradient.t
  | `none
];
type flexType = [ | `auto | `initial | `none | `num(float)];
type flexDirectionType = [ Css.Types.FlexDirection.t | Css.Types.Cascading.t];
type flexWrapType = [ Css.Types.FlexWrap.t | Css.Types.Cascading.t];
type flexBasisType = [
  Css.Types.FlexBasis.t
  | Css.Types.Percentage.t
  | Css.Types.Length.t
];
type justifyContentType = [
  Css.Types.PositionalAlignment.t
  | Css.Types.NormalAlignment.t
  | Css.Types.DistributedAlignment.t
  | Css.Types.Cascading.t
];
type alignItemsType = [
  Css.Types.AlignItems.t
  | Css.Types.PositionalAlignment.t
  | Css.Types.BaselineAlignment.t
  | Css.Types.Cascading.t
];
type marginType = [ Css.Types.Length.t | Css.Types.Margin.t];
type widthType = [
  Css.Types.Width.t
  | Css.Types.Percentage.t
  | Css.Types.Length.t
  | Css.Types.Cascading.t
];
type heightType = [
  Css.Types.Height.t
  | Css.Types.Percentage.t
  | Css.Types.Length.t
  | Css.Types.Cascading.t
];

type maxWidthType = [
  Css.Types.MaxWidth.t
  | Css.Types.Percentage.t
  | Css.Types.Length.t
  | Css.Types.Cascading.t
];

type positionType = [ Css.Types.Position.t | Css.Types.Cascading.t];



[@react.component]
let make =
    (
      ~alignItems: option(alignItemsType)=?,
      ~background: option(backgroundType)=?,
      ~children: option(React.element)=?,
      ~className: string="",
      ~flex: flexType=`initial,
      ~flexDirection: flexDirectionType=`row,
      ~flexWrap: flexWrapType=`nowrap,
      ~flexBasis: option(flexBasisType)=?,
      ~flexGrow: option(float)=?,
      ~flexShrink: option(float)=?,
      ~full: bool=false,
      ~height: option(heightType)=?,
      ~id: option(string)=?,
      ~inlineFlex: bool=false,
      ~justifyContent: option(justifyContentType)=?,
      ~m: option(marginType)=?,
      ~mb: option(marginType)=?,
      ~ml: option(marginType)=?,
      ~mr: option(marginType)=?,
      ~mt: option(marginType)=?,
      ~mx: option(marginType)=?,
      ~my: option(marginType)=?,
      ~minWidth: option(widthType)=?,
      ~maxWidth: option(maxWidthType)=?,
      ~onClick: option(ReactEvent.Mouse.t => unit)=?,
      ~onMouseEnter: option(ReactEvent.Mouse.t => unit)=?,
      ~onMouseLeave: option(ReactEvent.Mouse.t => unit)=?,
      ~overflow: option(Css.Types.Overflow.t)=?,
      ~overflowX: option(Css.Types.Overflow.t)=?,
      ~overflowY: option(Css.Types.Overflow.t)=?,
      ~p: option(Css.Types.Length.t)=?,
      ~pb: option(Css.Types.Length.t)=?,
      ~pl: option(Css.Types.Length.t)=?,
      ~pr: option(Css.Types.Length.t)=?,
      ~pt: option(Css.Types.Length.t)=?,
      ~px: option(Css.Types.Length.t)=?,
      ~py: option(Css.Types.Length.t)=?,
      ~position: option(positionType)=?,
      ~width: option(widthType)=?,
      ~zIndex: option(int)=?,
    ) => {
  let style =
    [|
      applyStyle(mb, my, m, Css.marginBottom),
      applyStyle(ml, mx, m, Css.marginLeft),
      applyStyle(mr, mx, m, Css.marginRight),
      applyStyle(mt, my, m, Css.marginTop),
      applyStyle(pb, py, p, Css.paddingBottom),
      applyStyle(pl, px, p, Css.paddingLeft),
      applyStyle(pr, px, p, Css.paddingRight),
      applyStyle(pt, py, p, Css.paddingTop),
      alignItems |> map(alignItems => Css.alignItems(alignItems)),
      background |> map(background => Css.background(background)),
      flexBasis |> map(flexBasis => Css.flexBasis(flexBasis)),
      flexGrow |> map(flexGrow => Css.flexGrow(flexGrow)),
      flexShrink |> map(flexShrink => Css.flexShrink(flexShrink)),
      height |> map(height => Css.height(height)),
      justifyContent
      |> map(justifyContent => Css.justifyContent(justifyContent)),
      overflow |> map(overflow => Css.overflow(overflow)),
      overflowX |> map(overflowX => Css.overflowX(overflowX)),
      overflowY |> map(overflowY => Css.overflowY(overflowY)),
      position |> map(position => Css.position(position)),
      maxWidth |> map(maxWidth => Css.maxWidth(maxWidth)),
      minWidth |> map(minWidth => Css.minWidth(minWidth)),
      width |> map(width => Css.width(width)),
      zIndex |> map(zIndex => Css.zIndex(zIndex)),
    |]
    |> filterNone
    |> List.fromArray;

  let elementClassName =
    Css.merge([
      Css.style([
        Css.border(Css.px(0), `solid, Colors.white),
        Css.display(inlineFlex ? `inlineFlex : `flex),
        Css.flex(flex),
        Css.flexDirection(flexDirection),
        Css.flexWrap(flexWrap),
        Css.width(full ? Css.pct(100.0) : `auto),
        Css.maxWidth(Css.pct(100.0)),
        Css.focus([Css.outline(Css.px(0), `solid, Colors.white)]),
        Css.background(`transparent),
        ...style,
      ]),
      className,
    ]);
  switch (onClick) {
  | Some(onClick) =>
    <button
      type_="button"
      ?id
      ?onMouseEnter
      ?onMouseLeave
      className=elementClassName
      onClick>
      {children |> renderOpt(children => children)}
    </button>
  | None =>
    <div ?id ?onMouseEnter ?onMouseLeave className=elementClassName>
      {children |> renderOpt(children => children)}
    </div>
  };
};
