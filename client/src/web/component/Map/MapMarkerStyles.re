open Css;

let mapMarker =
  style([
    width(px(36)),
    height(px(48)),
    transition("all", ~duration=150, ~timingFunction=linear),
    cursor(`grab),
  ]);

let mapMarkerHoverable =
  style([
    hover([important(zIndex(10000)), filter([`brightness(115.)])]),
    cursor(`pointer),
  ]);

let mapMarkerHighlighted = style([important(zIndex(10000))]);

