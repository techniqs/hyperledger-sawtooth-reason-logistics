module Styles = MapMarkerStyles;

[@bs.deriving abstract]
type iconConfig = {
  className: string,
  iconUrl: string,
  iconSize: array(int),
  iconAnchor: array(int),
};

type icon;

[@bs.new] external createLIcon: iconConfig => icon = "L.Icon";

module Marker = {
  [@bs.module "react-leaflet-universal"] [@react.component]
  external make:
    (
      ~id: string=?,
      // ~onClick: option(ReactEvent.Mouse.t => unit)=?,
      // ~onMouseOver: ReactEvent.Mouse.t => unit=?,
      // ~onMouseOut: ReactEvent.Mouse.t => unit=?,
      ~position: array(float),
      ~icon: icon=?,
      // ~children: React.element
    ) =>
    React.element =
    "Marker";
};

[@react.component]
let make =
    (
      // ~children: React.element,
      ~position: array(float),
    ) => {
  <Marker
    position
    icon={createLIcon(
      iconConfig(
        ~className=
          Css.(
            merge([
              Styles.mapMarker,
            ])
          ),
        ~iconUrl= Utils.requireImage("./orangePin.svg"),
        ~iconSize=[|36, 48|],
        ~iconAnchor=[|18, 48|],
      ),
    )}>
    // children
  </Marker>;
};
