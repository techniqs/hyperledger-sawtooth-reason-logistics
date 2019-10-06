The processor will be a Node.js application. 
which means i need to rewrite bs.raw files to make it node.js compatible..

razzle only provided for hmr and ssr and some output // will delete probably
Should use ninja/bsb -w


i skipp payload and protobuf for now because i need to see some kind of information about payload .. 
I THINK I KNOW IT 
pb_2.SimpleSupplyPayload() 
would be the message of the proto file 


Look at sawtooth sdk --> they used also protobuf and protos maybe i can figure it out through them