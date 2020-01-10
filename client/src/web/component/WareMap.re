open Utils;

let getPositionOfProperty = property => {
  let latitude = property##lngLat |> map(lngLat => lngLat##latitude);
  let longitude = property##lngLat |> map(lngLat => lngLat##longitude);
  switch (latitude, longitude) {
  | (Some(x), Some(y)) => [|x, y|]
  | _ => [|0.0, 0.0|]
  };
};

[@react.component]
let make =
    
    (~locations, ~zoom=18) => {
  let (shiftPressed, setShiftPressed) = React.useState(_ => false);
  let mapRatio = 0.566;

  let shiftDownListener = key =>
    if (ReactEvent.Keyboard.keyCode(key) === 16) {
      setShiftPressed(_ => true);
    };

  let shiftUpListener = key =>
    if (ReactEvent.Keyboard.keyCode(key) === 16) {
      setShiftPressed(_ => false);
    };

  let effect = () => {
    addKeybordEventListener("keydown", shiftDownListener);
    addKeybordEventListener("keyup", shiftUpListener);
    Some(
      () => {
        removeKeybordEventListener("keydown", shiftDownListener);
        removeKeybordEventListener("keyup", shiftUpListener);
      },
    );
  };

  React.useEffect(effect);

  let markers =
    locations
    |> Array.mapi((location,index) =>
         <MapMarker key={index |> string_of_int} position=[|location##latitude, location##longitude|] />
       );

  let latLngBounds =
    locations
    |> Array.map(location => [|location##latitude, location##longitude|]);

  <ImageRatio ratio=mapRatio>
    <Map
      center=?{latLngBounds |> Array.length == 1 ? latLngBounds[0] : None}
      bounds=?{latLngBounds |> Array.length > 1 ? Some(latLngBounds) : None}
      zoom=?{Some(zoom)}
      className=Css.(
        style([
          width(pct(100.)),
          height(pct(100.)),
          zIndex(1),
          marginBottom(px(8)),
        ])
      )
      scrollWheelZoom=shiftPressed>
      <MapboxGlLayer />
       {markers |> React.array} </Map>
  </ImageRatio>;
};