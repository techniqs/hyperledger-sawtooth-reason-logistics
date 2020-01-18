TODO:
    updateHistory gives wrong owners back
    tests
    clear notes / or maybe do another dev notes thingy

// jest and look at the unit tests from this guy

// do transaction like you would be api and send it to validator and check if i get the exceptions back i should

// create user validation rules
// pubkey must be unique

// Exceptions.newInvalidTransactionException(
//     {j|Cannot create User! Public_key: $pubKey already exists!|j},
//   );

// create/ update/ transfer ware validation rules
// owner is already user
// Exceptions.newInvalidTransactionException(
//     {j|User with public_key: $pubKey doesn't exist!|j},
//   );

// latitude and longitude are valid

// Exceptions.newInvalidTransactionException(
//     {j|Longitude must be between -180 and 180. Got $longitude|j},
//   )

// Exceptions.newInvalidTransactionException(
//     {j|Latitude must be between -90 and 90. Got $latitude|j},
//   )




api: 
    docker build -t hsrl/api .
    docker run -p 4000:4000 -d --name hsrl-api hsrl/api 

client: 
    docker build -t hsrl/client .
    docker run -p 3000:3000 -d --name hsrl-client hsrl/client

postgres:
    postgres already in docker compose :)

processor:
    docker build -t hsrl/processor .
    docker run -p 4004 -d --name hsrl-processor hsrl/processor
sub:
    docker build -t hsrl/subscriber .
    docker run -p 4004 -d --name hsrl-subscriber hsrl/subscriber


I implemented user auth structure like this:
on createUSer salt gets generated, password gets hashed through salt
privatekey gets encrypted with hashed pw. 
in auth will be then iv, encryptedpw and salt saved and in token we save the hash

for login we hash pw with salt and verifykeys

for auth we can get the hash through token and check whatever

how does login work: user types username and pw
i look for username in user, get the public key in the same table
now i check in auth, where for every created user there is a entry made with public key and private key encrypted with the hashed pw,
if i can decrypt the encrypted private key with the hashed pw and check if public and private key match

The start_block_num and end_block_num columns specify the range in which that state value is set or exists.
Values that are valid as of the current block have end_block_num set to NULL.

info: 
Event with eventtype sawtooth/block-commit has attributes:
block_id, block_num, state_root_hash, previous_block_id,