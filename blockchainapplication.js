const express = require('express')
const app=new express()
const port=3000
var myParser = require("body-parser")
var md5 = require('md5')
var cors = require('cors')
app.use(cors())

var fs = require('fs');
//fs.writeFile('myjsonfile.json', json, 'utf8', callback);





var mem_pool = [];
var chain = [];
var prev_hash = '0000000000000000000000000000000000';
app.use(myParser.json());
//app.use(myParser);
app.listen(port)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req,res){
res.send('Blockchain application running...')
})

app.post('/transaction/add', function (req, res) {
    data= req.body
    temp_tx = req.body;
    temp_tx.hash = md5(JSON.stringify(temp_tx));
    mem_pool.push(temp_tx);
    res.send('New transaction added to the memory pool.');
})

app.post('/mempool', function (req, res) {
    res.send(mem_pool)
})

app.post('/chain', function (req, res) {
    res.send(chain)
})

app.post('/buildblock', function (req, res) {
    raw_data = mem_pool;
    temp_block = {};
    temp_block.prev_hash = prev_hash;
    temp_block.block = chain.length + 1;
    temp_block.transactions = raw_data;
    for (nonce = 0; nonce < 500000; nonce++) {
        temp_block.hash = md5(prev_hash + JSON.stringify(raw_data) + nonce);
        if (temp_block.hash.substr(0, 4) == '0000') {
            prev_hash = temp_block.hash;
            temp_block.nonce = nonce;
            chain.push(temp_block);
            mem_pool = [];
            break;
        }
    }

    res.send('Operation completed.');
})

