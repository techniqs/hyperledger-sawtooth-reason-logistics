API STILL NEED TODO: 
    check all resolver methods! most of them still need something!
    also still need to implement this encrypting/decrypting of private key for login and creating
    also need to implement authorizationrequest for header with token // will come together with client hopefully for now some dummy data enabled
    uncomment in api checkAuth in resolver methods
    implement getPrivateKey, problem: lets say i want to createware and i have my user from context. so i have the pub key, --->
        but i dont have his password to decode privkey so i need to store it maybe in token or something?



lol ehm None from Reason to graphql does it translate to null? xDDD scared af

OKAY FROM API to sub everything works with createUser.

schema types i can do together with client because right now i dont know what i need for client

how i got into db of education
docker exec -it simple-supply-postgres bash
psql -U sawtooth -d simple-supply

how does login work: user types username and pw
i look for username in user, get the public key in the same table
now i check in auth, where for every created user there is a entry made with public key and private key encrypted with the hashed pw,
if i can decrypt the encrypted private key with the hashed pw and check if public and private key match



only thing that needs to be done in subscriber is insertWare into db ++ parseWare method
grad mit tan geredet:
er meint ja ist ziemlich schlau dass man immer einen eintrag in die ware table macht wenn irgendwas gemodified wird damit man sieht wann was valide ist.

before creating user do a call to db and ask if username already given :)

moment:

timestamp : mom.unix()
format timestamp back to date -> moment.unix(timestamp).format('DD/MM/YYYY, H:mm:ss')


change localhost ips to docker ips like in requesthandler sending to validator

Subscriber getting data from tp
https://imgur.com/a/d9VWglC

okay now i know everything i save to state will also get transmitted to my subscriber.
parsed data successfully need to save data to db

okay it needs to update because block nums need to be updated.
also probably user will never update and look at github issue for updating

try to check why on every insert it also updates ware lol
when does the user get updated never thanks.?

saving timestamp as 1234, fix!!

The start_block_num and end_block_num columns specify the range in which that state value is set or exists. Values that
are valid as of the current block have end_block_num set to NULL or MAX_INTEGER.

#####
status of tuesday
still parsing data, insertingblock though,
this question remains: question is if i also have to insert first block, cuz i think currently it doesnt, check education

#####

check if all files of transpiled sawtooth are in folder
check comments !!


info: 
Event with eventtype sawtooth/block-commit has attributes:
block_id, block_num, state_root_hash, previous_block_id,
----
Event with eventtype sawtooth/delta-commit has attributes:
address, and state data 




check how it would work with more then one tp .. 
can there be more then one validators? not sure :)
also does this have to be persistent?? 

https://github.com/babel/babel/issues/8802
https://github.com/babel/example-node-server


status: 
tp got transaction, can get and set. 
db models also right, 
start with eventsubscriber.
look at the streaming class -> do i really need to setup a serveR? i dont think so .. probably just connection between tp and subscriber but idk
also maybe graphql api doesnt need sequelize? but i think it does, random thought
btw slide ~40


db model: first save into blocks
          afterwards into specific tables
          tables below tables have to be inited first 


share code from repos .. 

https://demo.bitwise.io/fish/#!/
check if other exceptions from tp are also in the invalid transaction section.

what am i doing here?
    tans usecase: firma a ware x
    firma b scanned x 
    b angelangt durch scannen
    transpaerenz is key 

    save on blockchain only data which should be public
    user table:
    username, public, private encoded with hashed password 


also response from tp back to my graphl api if something went wrong..
also where todo validation of username?? in graph !!



first docker-compose -f sawtooth yaml file up
then start tp
then start graphql api :)


utils and models can be in seperate folder probably need to transpile with babel to use it

Rename repo and change family name
rename everything in package.json
check dependencies in package.json
comment
rewrite readme.me
Delete stuff with //Delete

check how it works with two tps ..
 

dont forget to rename sawtooth-reason-supply family name in source code

adress in tp and rest api unify