const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    address: {
        type: String,
        unique: true,
        required: true,
        minlength: 40,
        maxlength: 40,
        validate: {
            /**
             * I think address should match a format and match public key,
             * but I don't know how so I'll just leave an empty function here
             * @todo: implement validator
             */
            validator: () => true,
            message: 'Invalid address'
        },
    },
    pub_key: {
        type: String,
        unique: true,
        required: true,
        minlength: 44,
        maxlength: 44,
        validate: {
            validator: () => true,
            message: 'Invalid public key'
        },
    },
    voting_power: {
        type: Number,
        required: true,
    },
    proposer_priority: {
        type: Number,
        required: true,
    },
    updated_at_block: {
        type: Number,
        required: true,
    },
});

const Validator = mongoose.model('Validator', schema);




module.exports = Validator;
