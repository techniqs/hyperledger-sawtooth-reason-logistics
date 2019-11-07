Possible Database actions:
Querys:
Get AgentInformation
Get RecordInformation



Mutations:
Create agent
Create record
Update record
Transfer record? (update?)




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

