
module type PayloadType = {
    type action;


};

module Payload = (PayloadType) => {
  type t;

}