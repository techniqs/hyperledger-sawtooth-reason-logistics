
I left processor to start rest api, getting state works already,
setting state shouldnt be that hard either, but i should for testing purposes get client and api running
before i can do more :)

i did convert my header and payload to records for accessing -> so i need to figure state out and then im almost done :) -> for state look at some js file 
either simplewalletHandler or the js sdk of sawtooth


They use cbor to encode their payload.. so i could also use it ? :)
right now i will still go for buffer hehe
https://sawtooth.hyperledger.org/docs/core/releases/1.0/_autogen/sdk_submit_tutorial_js.html#encoding-your-payload

Ehm looks like everything is encoded with protobuf, except for payload -> encoded your way. and i think the validator decodes it sends it to the tp -> and payload is obviously still encoded thats why we dont need to decode transaction header /context
for protobuf encoding look at simplewalletClient



!!find a better way to cast js object header to record type header @ Handler.re
ask pavel one day :) !!

!!updated bs-platform from 5.0.6 to 5.2.1 !!



TODOS:
if protos not needed for processor, delete protos folder
create dockerfile for tp ->
https://nodejs.org/de/docs/guides/nodejs-docker-webapp/


protobufjs probably not needed! just a json file LOOK AT simplewalletClient!1


protobufJs useful links: (look at JsTester.js)
https://github.com/protobufjs/protobuf.js/blob/master/README.md#examples
https://github.com/protobufjs/protobuf.js/issues/523
probably also useful??
https://github.com/protobufjs/protobuf.js/blob/master/examples/custom-get-set.js
https://github.com/protobufjs/protobuf.js/blob/master/examples/traverse-types.js
