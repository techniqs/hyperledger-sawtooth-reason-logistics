# Hyperledger Sawtooth Reason Logistics
<p align="center"><img align="center" width="333" alt="Sawtooth Icon" src="./public/sawtooth_logo.png">
</p>
<br/>

This project was created during the course of a Bachelor's Thesis at the Vienna University of Technology. 
The goal is to provide a proof of concept of a blockchain application using ReasonML in combination with Hyperledger Sawtooth
while exploring the capabilities this relatively new framework provides. 

Since Sawtooth is such a novel technology, there aren't many (public) projects that are currently making use of it, which makes 
it interesting to utilize it and observe it's benefits. In fact, the only non-trivial resources that were available at the time
of developing this project was Sawtooth's own [reference tutorial project for developing a supply chain](https://github.com/hyperledger/education-sawtooth-simple-supply), which was often made use of as a reference guide.

In it's end state, this project will provide the following features:

- Frontend client
	sends requests to api
- API 
	processes client requests and wraps them into a transaction
- Processor
	processes transaction requests and saves data onto the blockchain
- Subscriber
	obtains saved data on blockchain and saves them in a "reporting database"
	to provide faster Query calls for the api

## Quickstart
### Cross-plattform Instructions
To run the application you must have installed [docker](https://docs.docker.com/install/#server) and [docker-compose](https://docs.docker.com/compose/install/).

### Installing and Hyperledger Sawtooth Reason Logistics
```
git clone https://github.com/techniqs/hyperledger-sawtooth-reason-logistics.git

cd hyperledger-sawtooth-reason-logistics/

docker-compose up
````

## Usage (right name?)

### Client

<p align="center"><img align="center" alt="Frontend" src="./public/frontend.png">
</p>

The above image shows the frontend/client-side of the application, where you can easily create transactions which then get forwarded to the custom graphql api.

Possible transactions are: 
-	Create a new user
-	Create a new ware
-	Update attributes of existing ware like (name, uvp)
-	Update location of existing ware like (longitude, latitude)
-	Transfer ware to a new existing owner

### Custom graphql API

<p align="center"><img align="center" alt="Graphql API" src="./public/graphql.png">
</p>

The above image shows the graphql-api playground of the application, where you can create transactions through mutations which get sent to the sawtooth validator and access the database with the given queries.

The api itsself doesnt store data in the reporting database except in the Auth table to instantly return a JWT token for the client.

Also the playground provides documentation about every query and mutation the api has to offer.

### Processor

After the transaction got validated by the sawtooth validator, the processor receives the transaction requests and stores data dependent on the action of the transaction and on the addresses which the processor can read from/ write to.

#### CreateUser Action
The processor receives a transaction with user relevant information and the action "create_user". 
This data gets only saved if, the created address from the signerPublicKey is the same as output address from the transaction request and nothing is saved on this specific address. 

#### SetWare Action
The processor receives a transaction with ware relevant information and the action "set_ware". This action can output 3 different results.
The address to store or look up data for the ware always gets created by the EAN of the ware. 

If there is no data saved on this specific address, then the ware payload gets stored on this address and it`s result is the creation of a ware.

If some data is saved on this address, but the input of the transaction consists only of 2 addresses (ware- and old-address) then the blockchain stores additional information about this ware and its result is the update of a ware.

If some data is saved on this address, and the input of the transaction consists of 3 addresses (ware-, oldowner-, newowner-address) then the blockchain stores additional information about this ware and its result is the transfer of a ware from one owner to another.

### Subscriber
After a payload gets saved on the blockchain, the sawtooth validator broadcasts an event with the data which gets caught by the subscriber.
The only functionality the subscriber has, is to create a new block for every event and save the broadcasted data in the reporting database. The Usefullness of this action is that the custom graphql api doesnt have to access the blockchain for every query instead queries over the reporting database for way faster query respones.

## Some Thoughts

The main challenge I had to face at the start of implementation was the lack of knowledge in ReasonML. 
Binding specific JS functions/classes from the sawtooth-core was a necessity to write my ReasonML transaction processor.
I spent quite some time figuring out how to extend classes in ReasonML or rather figuring out that extending a class isn't a feature which ReasonML intends to ever implement. So i had to keep some JS files because ReasonML couldnt handle everything.

After having overcome these issues for the transaction processor, the rest of the work like creating a transaction and sending it to the validator was quite easy, thanks to the JS specific application developer docs. The only thing I didn't find in the docs or in comments of their JS sawtooth-core code (feels like they slacked on JS, cuz there where no comments and only focused on python) was, how to catch data which gets broadcasted by the sawtooth-validator after a successfull save on the blockchain. Luckily the [simple-supply-repo]https://github.com/hyperledger/education-sawtooth-simple-supply) implemented a subscriber in python and i could guide my way through it.   

All in all I'm still glad i used ReasonML even with all my hassles, because now i ensured that the processor is atleast type safe // data on blockchain type safe lol.

## Acknowledgment
Special thanks go out to [Tan](https://github.com/tanmaster), who helped me obtain a fundamental understanding of blockchains.

Thanks to the contributors of [education-sawtooth-simple-supply](https://github.com/hyperledger/education-sawtooth-simple-supply), which guided me into the right direction for developing an appliction on sawtooth.

## Useful Links
- [Sawtooth JS Application Developers Guide](https://sawtooth.hyperledger.org/docs/core/releases/1.0/app_developers_guide/javascript_sdk.html)
- [ReasonML docs](https://reasonml.github.io/docs/en/what-and-why)
