import { Stream } from "sawtooth-sdk/messaging/stream";
const protobuf = require('sawtooth-sdk/protobuf')
import { NAMESPACE } from "../utils/addressHandler";
import { throwExceptionAndClose } from "../utils/exceptionHandler";

export default class Subscriber extends Stream {
    constructor(validatorUrl) {
        super(validatorUrl);
    }


    eventHandler(message) {
        console.log("EVENTHANDLER CALLED");
        const block = this.parseNewBlock(message);
        console.log(this.parseNewBlock(message));
        if (block.block_id !== null && block.block_num !== null) {
            // do stuff here 
        } else {
            throwExceptionAndClose(this, 
                "Unable to handle event, blockID and blockNum couldnt be found");
        }
    }


    parseNewBlock(message) {
        const eventlist = protobuf.EventList.decode(message).events;
        console.log("------------------------------");
        let block_num = null;
        let block_id = null;
        for (let event of eventlist) {
            if (event.eventType === "sawtooth/block-commit") {
                const attributes = event.attributes;
                for (let attr of attributes) {
                    if (attr.key === "block_id") {
                        block_id = attr.value;
                    } else if (attr.key === "block_num") {
                        block_num = attr.value;
                        if (block_id !== null)
                            break;
                    }
                }
            }
        }

        return { block_id, block_num };
    }



    async start() {
        await this.connect(function () {
            // callback for connection / disconnect like do something here probably 
            console.log("connection changed");

        })

        const self = this;

        // get lastKnownBlockIds 
        let known_ids = ['0000000000000000'];
        const blockSub = protobuf.EventSubscription.create({
            eventType: "sawtooth/block-commit"
        });

        const matchString = "^" + NAMESPACE + ".*";
        const deltaSub = protobuf.EventSubscription.create({
            eventType: "sawtooth/state-delta",
            filters: protobuf.EventFilter.create({
                key: "address",
                matchString: matchString,
                filterType: 3
            })
        })
        const request = protobuf.ClientEventsSubscribeRequest.encode({
            subscriptions: [blockSub, deltaSub],
            lastKnownBlockIds: known_ids
        }).finish()


        this.onReceive(function (message) {
            // messageStatus = 504 / CLIENT_EVENTS 
            console.log("-------------------------------------");
            // console.log("ONRECEIVE CALLED: ", message);
            // console.log("BUFFER CONTENT: ", Buffer.from(message.content).toString("utf8"));
            // console.log("BUFFER CONTENT: ", Buffer.from(message.content).toString("ascii"));
            // console.log("BUFFER CONTENT: ", Buffer.from(message.content).toString());
            self.eventHandler(message.content);

            return Promise.resolve(message);

        });


        return await this.send(500, request).then((res) => {
            const response = protobuf.ClientEventsSubscribeResponse.decode(res);

            // 1 = OK
            // 3 = Unknown block
            if (response.status !== 1) {
                const errorMessage = "Subscription failed with status: " + response.status;
                return Promise.reject(new Error(errorMessage));
            }
            return Promise.resolve(res);
        })

    }


}
