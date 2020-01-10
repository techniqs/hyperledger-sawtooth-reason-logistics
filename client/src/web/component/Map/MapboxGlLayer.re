[@react.component]
let make = () => {
  // State management for mapbox, because on server side "window" is not available -> dynamic initialisation
  let (mapBox: bool, setMapBox) = React.useState(() => false);

  React.useEffect(() => {
    setMapBox(_ => true);
    Some(() => ());
  });

  <div>
    {if (mapBox == true) {
       %bs.raw
       {|
                    React.createElement(require('@mongodb-js/react-mapbox-gl-leaflet/lib/react-mapbox-gl-leaflet').default, {
    accessToken: "pk.eyJ1IjoidGVjaG5pcXMiLCJhIjoiY2s1NzM5cGo0MDltYzNtbGo1YnpvMHRociJ9.ELl13xgYky3-nI3E51G1Bg",
    style: "mapbox://styles/techniqs/ck573idp80ad81clhkj55h2e4",
    attribution: "OpenStreetMap contributors",
                                              }, undefined)
                    |};
     } else {
       ReasonReact.null;
     }}
  </div>;
};