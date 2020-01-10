TODO:
    updateHistory gives wrong owners back
    code cleanup
    refactor ? look below
    readme update
    also homepage text update    


I implemented user auth structure like this:
on create salt gets generated, password gets hashed through salt
privatekey gets encrypted with hashed pw. 
in auth will be then iv, encryptedpw and salt saved and in token we save the hash

for login we hash pw with salt and verifykeys

for auth we can get the hash through token and check whatever

how i got into db of education
    docker exec -it simple-supply-postgres bash
    psql -U sawtooth -d simple-supply

how does login work: user types username and pw
i look for username in user, get the public key in the same table
now i check in auth, where for every created user there is a entry made with public key and private key encrypted with the hashed pw,
if i can decrypt the encrypted private key with the hashed pw and check if public and private key match

moment:
    timestamp : mom.unix()
    format timestamp back to date -> moment.unix(timestamp).format('DD/MM/YYYY, H:mm:ss')


change localhost ips to docker ips
look through whole project!!

The start_block_num and end_block_num columns specify the range in which that state value is set or exists.
Values that are valid as of the current block have end_block_num set to NULL.


info: 
Event with eventtype sawtooth/block-commit has attributes:
block_id, block_num, state_root_hash, previous_block_id,
----
Event with eventtype sawtooth/delta-commit has attributes:
address, and state data 


check how it would work with more then one tp .. 
can there be more then one validators? not sure :)
also does this have to be persistent? || is it persistent?

useful links:
https://github.com/babel/example-node-server
https://demo.bitwise.io/fish/#!/

what am i doing here?
    tans usecase: firma a ware x
    firma b scanned x 
    b angelangt durch scannen
    transpaerenz is key 

    save on blockchain only data which should be public
    user table:
    username, public, private encoded with hashed password 

utils and models can be in seperate folder probably need to transpile with babel to use it

Rename repo and change family name
check package.json (names)
comment
rewrite readme.me

check how it works with two tps ..

dont forget to rename sawtooth-reason-supply family name in source code

postgres is running on 5432

docker postgres commands: 
also for some extra help look @ rbDump.sh

docker run --name supply-postgres -p 5432:5432 -e POSTGRES_PASSWORD=supply -d mdillon/postgis

docker exec -u postgres supply-postgres createdb supplyDB
docker exec -u postgres supply-postgres dropdb supplyDB


// username == postgres, userpw = supply
// idk if needed
docker exec supply-postgres bash -c "PGPASSWORD=supply createdb -U postgres supplyDB"
