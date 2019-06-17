# Validator API
NodeJS test task for Fetch

## Problem
One of the upcoming products for our client is a block explorer for Tendermint Blockchains. You
will design and code a simple REST API web server with nodeJS / Express that persists data to
PostgresQL / MongoDB database for the following endpoints:
POST http://localhost:3000/api/v1/validators (CREATE)
● When posted with the sample data, it should 
○ Add in a new validator if The public key / address does not exist 
○ Update the validator if The voting power changed, and blockHeight is higher than the previous data entry
GET http://localhost:3000/api/v1/validators (READ ALL)
GET http://localhost:3000/api/v1/validators/<validator_address> (READ ONE)
Required Fields:
● validatorAaddress ● publicKey
● validatorIndex
● votingPower
Sample Data:
https://s3-ap-southeast-1.amazonaws.com/sws-recruiting/backend-engineer/rpcValidatorSet.json
Require Frameworks
• - Nodejs >= 15.10.0 or Express >= 4.0.0
• - MongoDB / PostgresQL
Deliverables
● Source code in a Github Repository including integration test files

## Installation instruction
- Run `npm install`
- Set database URL to .env file
- Start server: `npm start`
- Run tests: `npm test`