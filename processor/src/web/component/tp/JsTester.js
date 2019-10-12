const protobuf = require("protobufjs");
const path = require("path");


class Agent {
    public_key;
    name;
    constructor() {
        this.public_key = "pub_key";
        this.name = "name";
    }
};

export default class JsTester {
    constructor() {
        console.log("Tester works");
        this.testStuff();
    }

    testStuff() {

        //this works for node.js 
        // protobuf.load("protos/qq.proto", function(err, root) {
                
        // for browser we need to expose files since its accessing like localhost:4000/qq.proto :)
        // so everything has to be in public folder.. 

        protobuf.load("protos/qq.proto", function(err, root) {
            if (err)
                throw err;
        
            // Obtain a message type
            var AwesomeMessage = root.lookup("AwesomeMessage");
            console.log("IF NAME THEN RESOLVED ELSE FALSE", AwesomeMessage.name);

            // Exemplary payload
            var payload = { awesomeField: "AwesomeString" };

            //Do i really need to verify it?
            // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
            var errMsg = AwesomeMessage.verify(payload);
            if (errMsg)
                throw Error(errMsg);

            // Create a new message
            var message = AwesomeMessage.create(payload); // or use .fromObject if conversion is necessary

            // Encode a message to an Uint8Array (browser) or Buffer (node)
            var buffer = AwesomeMessage.encode(message).finish();
            // ... do something with buffer

            // Decode an Uint8Array (browser) or Buffer (node) to a message
            var message = AwesomeMessage.decode(buffer);
            // ... do something with message

            // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.

            // Maybe convert the message back to a plain object
            var object = AwesomeMessage.toObject(message, {
                longs: String,
                enums: String,
                bytes: String,
                // see ConversionOptions
            });
        });
    }

};