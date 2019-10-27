
idk look how svd and postla did schema updating .. 


postgres is running on 5432

docker postgres commands: 
also for some extra help look @ rbDump.sh

docker run --name supply-postgres -p 5432:5432 -e POSTGRES_PASSWORD=supply -d postgres

// username == postgres, userpw = supply
docker exec supply-postgres bash -c "PGPASSWORD=supply createdb -U postgres supply"