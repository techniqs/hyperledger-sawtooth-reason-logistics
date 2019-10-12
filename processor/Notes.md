The processor will be a Node.js application. 
which means i need to rewrite bs.raw files to make it node.js compatible..

razzle only provided for hmr and ssr and some output // will delete probably
Should use ninja/bsb -w


i skipp payload and protobuf for now because i need to see some kind of information about payload .. 

I THINK I KNOW IT 
pb_2.SimpleSupplyPayload() -> in proto file SimpleSupplyPayload 
would be the message of the proto file 


TODOS:
Delete in /public protos folder
change in HandlerJSWrapper back to extends..


protobufJs useful links: 
https://github.com/protobufjs/protobuf.js/blob/master/README.md#examples
https://github.com/protobufjs/protobuf.js/issues/523
probably also useful??
https://github.com/protobufjs/protobuf.js/blob/master/examples/custom-get-set.js
https://github.com/protobufjs/protobuf.js/blob/master/examples/traverse-types.js