process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const sampleData = require('./sample_data');
const ValidatorModel = require('../models/validator');


chai.use(chaiHttp);

describe('Validators APIs', () => {
    before(done => {
        ValidatorModel.deleteMany({}, err => done());
    });

    describe('POST /validators', () => {
        it('should insert all validators successfully', done => {
            chai.request(app)
                .post('/validators')
                .send(sampleData)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(14);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(0);
                    done();
                });
        });

        it('should return empty result', done => {
            const data = {
                "result": {
                    "block_height": sampleData.result.block_height,
                    "validators": [sampleData.result.validators[0]]
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(0);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(0);
                    done();
                });
        });

        it('should create 1 and update 1 validators', done => {
            const data = {
                "result": {
                    "block_height": "3363043",
                    "validators": [
                        {
                            ...sampleData.result.validators[0],
                            voting_power: 123,
                        }, {
                            "address": "105851A834330118A7EAF1E778DDFDFDB3BB800D",
                            "pub_key": {
                                "type": "tendermint/PubKeyEd25519",
                                "value": "+D4SzWqrgBE0WdRqTFfwjNg0v7mypHMqllCV/zgjRdS="
                            },
                            "voting_power": "11223",
                            "proposer_priority": "58568"
                        }
                    ]
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end(async (err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(1);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(1);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(0);
                    done();
                });
        });

        it('should return invalid block height and validators error', done => {
            const data = {
                "result": {
                    "block_height": "xxx",
                    "validators": null
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(0);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(2)
                        .that.include('blockHeight is required')
                        .that.include('validators must be array');
                    done();
                });
        });

        it('should return public key mismatch error', done => {
            const data = {
                "result": {
                    "block_height": "3363042",
                    "validators": [
                        {
                            ...sampleData.result.validators[0],
                            pub_key: {
                                type: "tendermint/PubKeyEd25519",
                                value: "abc"
                            },
                        }
                    ]
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(0);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(1)
                        .that.include('Public key mismatch for address 00B587BAA478C3FCD0A1AE34658764BCE01A2A41');
                    done();
                });
        });

        it('should return fields required errors', done => {
            const data = {
                "result": {
                    "block_height": "3363042",
                    "validators": [
                        {
                            "address": "105851A834330118A7EAF5E778DDFDFDB3BB8001",
                            "pub_key": {
                                "type": "tendermint/PubKeyEd25519",
                                "value": "+D4SzWqrgBE0WdRqTF4wjNg0v7mypHMqllCV/zgj2dA="
                            }
                        }
                    ]
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(0);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(1)
                        .that.include('Validator validation failed: proposer_priority: Path `proposer_priority` is required., voting_power: Path `voting_power` is required.');
                    done();
                });
        });

        it('should return invalid number errors', done => {
            const data = {
                "result": {
                    "block_height": "3363042",
                    "validators": [
                        {
                            "address": "105851A834330118A7EAF5E778DDFDFDB3BB8001",
                            "pub_key": {
                                "type": "tendermint/PubKeyEd25519",
                                "value": "+D4SzWqrgBE0WdRqTF4wjNg0v7mypHMqllCV/zgj2dA="
                            },
                            "voting_power": "qwryqrtq",
                            "proposer_priority": "qwyqrwet"
                        }
                    ]
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(0);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(1)
                        .that.include('Validator validation failed: voting_power: Cast to Number failed for value "qwryqrtq" at path "voting_power", proposer_priority: Cast to Number failed for value "qwyqrwet" at path "proposer_priority"');
                    done();
                });
        });

        it('should return invalid string length errors', done => {
            const data = {
                "result": {
                    "block_height": "3363042",
                    "validators": [
                        {
                            "address": "105851A834330118A7EAF5E778DDFDFDB3BB8",
                            "pub_key": {
                                "type": "tendermint/PubKeyEd25519",
                                "value": "+D4SzWqrgBE0WdRqTF4wjNg0v7mypHMqllCV/zgj2dA534="
                            },
                            "voting_power": "1815430500000000",
                            "proposer_priority": "-28471297322249822"
                        }
                    ]
                }
            };
            chai.request(app)
                .post('/validators')
                .send(data)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('created').that.is.a('number').that.equals(0);
                    res.body.should.have.property('updated').that.is.a('number').that.equals(0);
                    res.body.should.have.property('errors').that.is.a('array').with.lengthOf(1)
                        .that.include('Validator validation failed: address: Path `address` (`105851A834330118A7EAF5E778DDFDFDB3BB8`) is shorter than the minimum allowed length (40)., pub_key: Path `pub_key` (`+D4SzWqrgBE0WdRqTF4wjNg0v7mypHMqllCV/zgj2dA534=`) is longer than the maximum allowed length (44).');
                    done();
                });
        });
    });

    describe('GET /validators', () => {
        it('should get all validators successfully', done => {
            chai.request(app)
                .get('/validators')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array').that.is.not.empty;
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('address');
                    res.body[0].should.have.property('pub_key');
                    res.body[0].should.have.property('voting_power');
                    res.body[0].should.have.property('proposer_priority');
                    res.body[0].should.have.property('updated_at_block');
                    done();
                });
        });
    });

    describe('GET /validators/:address', () => {
        it('should get a validator successfully', done => {
            chai.request(app)
                .get('/validators/' + sampleData.result.validators[0].address)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('address');
                    res.body.should.have.property('pub_key');
                    res.body.should.have.property('voting_power').that.is.equals(123);
                    res.body.should.have.property('proposer_priority');
                    res.body.should.have.property('updated_at_block');
                    done();
                });
        });

        it('should return 404 error', done => {
            chai.request(app)
                .get('/validators/' + sampleData.result.validators[0].address + 'xxx')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').that.is.equals(404);
                    res.body.should.have.property('message').that.is.a('string');
                    done();
                });
        });
    });
});

