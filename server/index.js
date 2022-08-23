/**
 * Initializing required files and dependencies
 */
const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const settings = require('./config/key.json'); 

/**
 * Connecting to Mongo Database
 */
const connectDB = require('./config/db');
connectDB();

/**
 * Loading Backend Route APIs
 */
const userTrans = require('./routes/api/userTransAPI');
const users = require('./routes/api/usersAPI');
const transactions = require('./routes/api/transactionsAPI');
const etherscan = require('./routes/api/etherscanAPI');
app.use('/userTrans', userTrans);
app.use('/users', users);
app.use('/transactions', transactions);
app.use('/etherscan/', etherscan);

/**
 * Miscellaneous
 */
app.listen(3001, () => {
    console.log('Server is online...');
});