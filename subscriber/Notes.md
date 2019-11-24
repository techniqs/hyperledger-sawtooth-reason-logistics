dont forget validation in api like username, shouldnt be in tp 

maybe refactor keyhandler to a class with signer obj and pubkey, privatekey blabla
rest api link change from localhost to rest-api !! docker needs rest-api since in container only like this accessible.


Possible Database actions:
Querys:
Get AgentInformation
Get RecordInformation



Mutations:
Create agent
Create record
Update record
Transfer record? (update?)


for sending from our api to tp look at simplewalletclient wrap_and_send method
need node-fetch
https://www.npmjs.com/package/node-fetch

question i have:
look @scenario
user sends mutation to graphql api, which forwards it to 
tp, which transactions it blabla, but when will user be notified if done?

should i do something like callmutation-> forward-> query over what i wanted from mutation and if not there some error occured?
Answer: TP GIVES YOU RESULT BACK IF VALIDATED OR NOT ;) OR DOES IT?

keys should be stored in 



tutorial to use graphql server
https://www.robinwieruch.de/graphql-apollo-server-tutorial#apollo-server-postgresql-sequelize-setup

dont forget to start docker


reason apollo server examples

https://github.com/drejohnson/reason-apollo-server-example
https://github.com/zackify/reason-apollo-server


idk look how svd and postla did schema updating .. 
graphql boilerplates
https://github.com/graphql-boilerplates


postgres is running on 5432

docker postgres commands: 
also for some extra help look @ rbDump.sh

docker run --name supply-postgres -p 5432:5432 -e POSTGRES_PASSWORD=supply -d mdillon/postgis

check for real docker container if it works with mdillon/postgis

docker exec -u postgres supply-postgres createdb supplyDB
docker exec -u postgres supply-postgres dropdb supplyDB


// username == postgres, userpw = supply
// idk if needed
docker exec supply-postgres bash -c "PGPASSWORD=supply createdb -U postgres supplyDB"




i think apollo should be the way to go

apollo client
https://www.apollographql.com/docs/apollo-server/getting-started/#step-1-create-a-new-project

graphql link
https://graphql.org/graphql-js/running-an-express-graphql-server/

