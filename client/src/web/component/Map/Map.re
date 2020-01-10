if (!Config.ssr) {
  // process this only for client. For server side window is not defined and leaflet rendering fails.
  Utils.requireCss("leaflet/dist/leaflet.css");
};

module LeafletInternal = {
  [@bs.module "react-leaflet-universal"] [@react.component]
  external make:
    (
      ~className: string,
      ~center: array(float)=?,
      ~zoom: int=?,
      ~bounds: array(array(float))=?,
      ~scrollWheelZoom: bool=?,
      ~children: React.element
    ) =>
    // ~items: array(React.element),
    // ~children: array(React.element)
    React.element =
    "Map";
};

[@react.component]
let make =
    (
      ~className: string,
      ~center: array(float)=?,
      ~zoom: int=?,
      ~bounds: array(array(float))=?,
      ~scrollWheelZoom: bool=true,
      ~children: React.element,
    ) => {
  <LeafletInternal className center zoom bounds scrollWheelZoom>
    children
  </LeafletInternal>;
};

module TileLayer = {
  [@bs.module "react-leaflet-universal"] [@react.component]
  external make:
    (~attribution: string, ~url: string) =>
    // ~items: array(React.element),
    // ~children: array(React.element)
    React.element =
    "TileLayer";
};
