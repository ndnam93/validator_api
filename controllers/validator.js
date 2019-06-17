const _ = require('lodash');
const ValidatorModel = require('../models/validator');

const getList = async (req, res, next) => {
    const list = await ValidatorModel.find();
    res.json(list);
};

const get = async (req, res, next) => {
    const model = await ValidatorModel.findOne({address: req.params.address});
    if (model) {
        res.json(model);
    } else {
        const err = new Error('Validator address not found');
        err.status = 404;
        next(err);
    }
};

const create = async (req, res, next) => {
    let {result: {block_height: blockHeight, validators}} = req.body;
    blockHeight = parseInt(blockHeight);
    const response = {
        created: 0,
        updated: 0,
        errors: [],
    };

    if (!blockHeight) {
        response.errors.push('blockHeight is required');
    }
    if (!_.isArray(validators)) {
        response.errors.push('validators must be array');
    }
    if (response.errors.length) {
        res.status(400).json(response).end();
        return;
    }

    for (let validatorData of validators) {
        if (!_.isObject(validatorData)) continue;
        try {
            const {pub_key: {value: pubKey}} = validatorData;
            validatorData.pub_key = pubKey;
            let model = await ValidatorModel.findOne(_.pick(validatorData, ['address']));
            if (model) {
                if (model.pub_key != validatorData.pub_key) {
                    throw new Error(`Public key mismatch for address ${model.address}`);
                }
                if (model.voting_power != parseInt(validatorData.voting_power) && model.updated_at_block < blockHeight) {
                    model = _.assign(model, _.pick(validatorData, ['voting_power', 'proposer_priority']));
                    await model.save();
                    response.updated++;
                }
            } else {
                const newModel = new ValidatorModel({
                    ...validatorData,
                    updated_at_block: blockHeight,
                });
                await newModel.save();
                response.created++;
            }
        } catch (err) {
            response.errors.push(err.message);
        }
    }
    res.json(response);
};



module.exports = {getList, get, create};
