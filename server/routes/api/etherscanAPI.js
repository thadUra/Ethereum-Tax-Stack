// functions/getEtherBalance.js

const express = require('express');
const router = express.Router();
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');
app.use(cors());
app.use(express.json());
const settings = require('../../config/key.json'); 
const UsersModel = require('../../models/Users');
const TransactionModel = require('../../models/Transactions');
const UserTransModel = require('../../models/UserTrans');

/**
 * @route GET etherscan/updateEtherBalance
 * @description Modifies ether balance in DB
 * @access Public
 */
router.post('/updateEtherBalance/:address', async (req, res) => {
    const userAddress = req.params.address;
    console.log(userAddress);
    const api_url = `https://api.etherscan.io/api?module=account&action=balance&address=${userAddress}&tag=latest&apikey=${settings.etherscanKey}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    UsersModel.updateOne(
        { "ethAddress" : `${userAddress}` },
        { $set: { "ethBalance": json.result } } )
        .then(usertrans => res.json(json))
        .catch(err => res.status(400).json({ error: '*Updating balance failed*' }));
});

/**
 * @route GET etherscan/normalTransactions
 * @description Adds normal transactions into DB
 * @access Public
 */
router.post('/normalTransactions/:address', async (req, res) => {
    const userAddress = req.params.address;
    console.log(userAddress);
    const api_url = `https://api.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${settings.etherscanKey}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    try { addTransaction(userAddress, "Normal", json); }
    catch (err) {
        res.json(err);
    }
    res.json({ transactions: 'Finished adding normal transactions...' });
});

/**
 * @route GET etherscan/internalTransactions
 * @description Adds internal transactions into DB
 * @access Public
 */
 router.post('/internalTransactions/:address', async (req, res) => {
    const userAddress = req.params.address;
    console.log(userAddress);
    const api_url = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${settings.etherscanKey}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    try { addTransaction(userAddress, "Internal", json); }
    catch (err) {
        res.json(err);
    }
    res.json({ transactions: 'Finished adding internal transactions...' });
});

/**
 * @route GET etherscan/erc20Transactions
 * @description Adds ERC20 transactions into DB
 * @access Public
 */
 router.post('/erc20Transactions/:address', async (req, res) => {
    const userAddress = req.params.address;
    console.log(userAddress);
    const api_url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${userAddress}&page=1&offset=10000&startblock=0&endblock=27025780&sort=asc&apikey=${settings.etherscanKey}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    try { addTransaction(userAddress, "ERC20", json); }
    catch (err) {
        res.json(err);
    }
    res.json({ transactions: 'Finished adding erc20 transactions...' });
});

/**
 * @route GET etherscan/erc721Transactions
 * @description Adds ERC20 transactions into DB
 * @access Public
 */
 router.post('/erc721Transactions/:address', async (req, res) => {
    const userAddress = req.params.address;
    console.log(userAddress);
    const api_url = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${userAddress}&page=1&offset=10000&startblock=0&endblock=27025780&sort=asc&apikey=${settings.etherscanKey}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    try { addTransaction(userAddress, "ERC721", json); }
    catch (err) {
        res.json(err);
    }
    res.json({ transactions: 'Finished adding erc721 transactions...' });
});

/**
 * @route GET etherscan/erc721Transactions
 * @description Adds ERC20 transactions into DB
 * @access Public
 */
 router.post('/erc1155Transactions/:address', async (req, res) => {
    const userAddress = req.params.address;
    console.log(userAddress);
    const api_url = `https://api.etherscan.io/api?module=account&action=token1155tx&address=${userAddress}&page=1&offset=10000&startblock=0&endblock=99999999&sort=asc&apikey=${settings.etherscanKey}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    try { addTransaction(userAddress, "ERC1155", json); }
    catch (err) {
        res.json(err);
    }
    res.json({ transactions: 'Finished adding erc1155 transactions...' });
});

/**
 * @funct Takes parameters to add functions accordingly
 * @description Adds transactions to DB
 * @access Private
 */
function addTransaction(address, type, json) {
    // console.log(json);
    for( let i = 0; i < json.result.length; i++ ) {
        TransactionModel.updateOne(
            { txnHash: json.result[i].hash }, 
            {
                type: type,
                txnHash: json.result[i].hash,
                data: JSON.stringify(json.result[i])
            },
            {upsert:true}, 
            (err, result) => {
                if (err) {
                    return err;
                }
                console.log(result);
                if (result.modifiedCount == 1) {
                    console.log('modified trans hash: ' + json.result[i].hash);
                }
                else if ( result.upsertedCount == 1 ) {
                    console.log('inserted trans hash: ' + json.result[i].hash);
                }
            }
        );
    }
    console.log()
}

module.exports = router;