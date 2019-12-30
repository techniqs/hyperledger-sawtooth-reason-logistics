import { throwExceptionAndClose } from "../components/exceptionHandler";
import { NAMESPACE, USER_PREFIX, WARE_PREFIX } from "../utils/addressHandler";
const protobuf = require('../../sawtooth-transpiled/protobuf')

const MAX_BLOCK_NUMBER = null;
// const MAX_BLOCK_NUMBER = Number.MAX_SAFE_INTEGER - 1;

export const handle_events = async (db, events, subscriberRef) => {
    console.log("EVENTHANDLER CALLED");
    const block = parseNewBlock(events);
    if (block.block_id !== null && block.block_num !== null) {
        const duplicate = await resolveFork(db, block);
        if (!duplicate) {
            // here parse state changes, deserialize data and save it to db
            // look at education stuff 
            console.log("parsing data!!!");
            parseData(db, events, block);
        }
        else {
            console.log("duplicate block!!!!!!");
        }

    } else {
        throwExceptionAndClose(subscriberRef,
            "Unable to handle event, blockID and/or blockNum couldnt be found");
    }
}

// here parse state changes, deserialize data and save it to db
// look at education stuff 
const parseData = async (db, events, block) => {

    for (let event of sortEvents(events, false)) {
        const stateChanges = protobuf.StateChangeList.decode(event.data).stateChanges;
        // check if my application, 
        for (let change of stateChanges.filter(stateChange =>
            stateChange.address.substring(0, 6) === NAMESPACE)) {
            //doesnt matter what it is i can save block already
            await db.insertBlock(block);
            // check resource type, since we only have two, everything else not valid ..
            const prefix = change.address.substring(6, 8);
            if (prefix === USER_PREFIX) {
                parseUserData(db, change.value, block.block_num)
            } else if (prefix === WARE_PREFIX) {
                // ware
                console.log("ware")
                parseWareData(db, change.value, block.block_num)
            } else {
                // unknown type 
                console.log("unkown prefix, couldnt parse data.");
            }
        }
    }

};
const parseUserData = (db, buffer, block_num) => {
    const userData = JSON.parse(buffer.toString());
    userData["timestamp"]=parseInt(userData.timestamp,10);
    userData["start_block_num"]=block_num;
    userData["end_block_num"]=MAX_BLOCK_NUMBER;

    // console.log("userData: ",userData)
    db.insertUser(userData);
}

const parseWareData = (db, buffer, block_num) => {
    const data = buffer.toString();
    //start_block_num
    data.push(block_num);
    //end_block_num
    data.push(MAX_BLOCK_NUMBER);


}


const resolveFork = async (db, block) => {
    const existingBlock = await db.fetchBlock(block.block_num)
    if (existingBlock !== null) {
        //block is duplicate
        if (existingBlock.block_id === block.block_id)
            return true;

        // fork detected, undo all events >= blockNum
        console.log("FORK DETECTED!! DELETING RECENT EVENTS");
        await db.dropFork(block.block_num)
    }

    return false;
}

//blockcommit = true -> filters events with eventtype sawtooth/block-commit else sawtooth/state-delta
const sortEvents = (events, blockCommit) => {
    return events.filter(event =>
        event.eventType === (blockCommit ? "sawtooth/block-commit" : "sawtooth/state-delta"));
}


const parseNewBlock = (events) => {
    let block_num = null;
    let block_id = null;
    for (let event of sortEvents(events, true)) {
        const attributes = event.attributes;
        // console.log("attributes", attributes);
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

    return { block_id, block_num };
}