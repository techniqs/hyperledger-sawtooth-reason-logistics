import { Stream } from "../../sawtooth-transpiled/messaging/stream";
const protobuf = require('../../sawtooth-transpiled/protobuf')
import { NAMESPACE } from "../utils/addressHandler";
import { handle_events } from "./eventHandler";
import Database from "./database";

export default class Subscriber extends Stream {
    constructor(validatorUrl) {
        super(validatorUrl);
        this.database = new Database();
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
            const events = protobuf.EventList.decode(message.content).events;
            handle_events(self.database, events, self);


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
