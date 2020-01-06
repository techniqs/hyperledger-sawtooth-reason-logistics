Utils.requireCss("react-toastify/dist/ReactToastify.css");

module ToastifyInternal = {
  [@bs.module "react-toastify"] [@react.component]
  external make:
    (
      ~className: string=?,
      ~position: string=?,
      ~autoClose: int=?,
      ~children: React.element=?,
      unit
    ) =>
    React.element =
    "ToastContainer";
};

module Style = {
  open Css;

  let toast =
    style([
      selector(
        ".Toastify__toast",
        [
          boxShadow(
            Shadow.box(
              ~x=px(4),
              ~y=px(4),
              ~blur=px(5),
              rgba(0, 0, 0, 0.75),
            ),
          ),
        ],
      ),
    ]);
};

[@react.component]
let make = () =>
  <ToastifyInternal
    className=Style.toast
    position="top-center"
    autoClose=10000
  />;

[@bs.module "react-toastify"] [@bs.scope "toast"]
external error: (~message: string) => unit = "error";

[@bs.module "react-toastify"] [@bs.scope "toast"]
external success: (~message: string) => unit = "success";

[@bs.module "react-toastify"] [@bs.scope "toast"]
external warn: (~message: string) => unit = "warn";
