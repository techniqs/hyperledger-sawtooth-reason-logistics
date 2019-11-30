status:
i successfully subsribed to events, now i still need to check if its a fork or not
check handle_events from education also in my code its in // do stuff here
all i need to do now is check if duplicate if not apply changes :)

BIG TODO:
subscriber has some babel issues, i need to call stream class from sawtooth but thats es6 and since im using babel everything gets transpiled to es5 i need to transpile the whole package and use it.. but i cant exclude it idk .. here are some issues 


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


Rename repo
rename everything in package.json
check dependencies in package.json
comment
rewrite readme.me
Delete stuff with //Delete

check how it works with two tps ..
 

dont forget to rename sawtooth-reason-supply family name in source code

adress in tp and rest api unify