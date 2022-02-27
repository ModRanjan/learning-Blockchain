
import Sha256 from './sha256.js';

const showGenesisBlock = document.querySelector(".show-Genesis-Block")
const showPreviousBlock = document.querySelector(".show-Previous-Block")
const showNextBlock = document.querySelector(".show-Next-Block")
const showRecentBlock = document.querySelector(".show-Recent-Block")
const transaction = document.querySelector(".transaction")
const mineNewBlock = document.querySelector(".mine-block")



function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.createNewBlock(0, "0", "0");
}

Blockchain.prototype.createNewBlock = function (nonce, prevBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(), // unix time
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    prevBlockHash: prevBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
  };

  this.pendingTransactions.push(newTransaction);

  return this.getLastBlock()["index"] + 1;
};

Blockchain.prototype.hashBlock = function (prevBlockHash, currentBlockData, nonce) {
  const dataAsString =
    prevBlockHash + timestamp.toString() + nonce.toString() + JSON.stringify(currentBlockData);
  
  const hash = Sha256.hash(dataAsString);
  return hash;
};

Blockchain.prototype.proofOfWork = function (prevBlockHash, currentBlockData) {
  /*
  * repeated hash block until it finds correct hash => '00....'
  * continuously changes nonce value until it finds the correct hash
  * returns to us the nonce value tha creates the correct hash
  */
  let nonce = 0;
  let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
    // console.log(hash)
  }
  // console.log(nonce)

  return nonce;
};


//  testing for creation of new blockchain()
const bitcoin = new Blockchain();

// get entire blockchain
function showBlockchain(count) {
  var showIndex = document.getElementById("index");
  var showTimestamp = document.getElementById("timestamp");
  var showNonce = document.getElementById("nonce");
  var showPrevHash = document.getElementById("prevHash");
  var showCurrHash = document.getElementById("currHash");

  // var showPendingTransactions = document.getElementById("show-pendingTransactions");

  const chain = bitcoin.chain;


  showIndex.value = `${chain[count].index}`
  showTimestamp.value = `${chain[count].timestamp}`;
  showNonce.value = `${chain[count].nonce}`;
  showPrevHash.value = `${chain[count].prevBlockHash}`;
  showCurrHash.value = `${chain[count].hash}`;

  // if (bitcoin.pendingTransactions.length == 0) {
  //   showPendingTransactions.innerHTML = "Pending Transactions: No pending Transation."
  // }
  // else {
  //   for (let i = 0; i < bitcoin.pendingTransactions.length; i++)
  //     showPendingTransactions.innerHTML = `Sender: ${bitcoin.pendingTransactions[i]['sender']} <br>
  //                                   Recipient: ${bitcoin.pendingTransactions[i]['recipient']} <br>
  //                                   Amount: ${bitcoin.pendingTransactions[i]['amount']} <br>
  //                                   `;
  // }
}

let count = 0;
showGenesisBlock.addEventListener('click', () => {
  count = 0;
  showBlockchain(count);
}) 
showPreviousBlock.addEventListener('click', () => {
  if (count <= 0) {
    showBlockchain(0);
  } else {
    count = count - 1;
    showBlockchain(count);
  }
})
showNextBlock.addEventListener('click', () => {
  let lastBlockIndex = bitcoin.getLastBlock().index;

  if (count >= (lastBlockIndex-1)) {
    showBlockchain(lastBlockIndex-1);
  } else {
    count = count + 1;
    showBlockchain(count);
  }
})
showRecentBlock.addEventListener('click', () => {
  let lastBlockIndex = bitcoin.getLastBlock().index;

  showBlockchain(lastBlockIndex-1);
  
})

// create new transaction
function performTransaction(amount, sender, recipient) {

  const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);

  return `Transation Successfull and is added in ${blockIndex} block of Blockchain.`
}

transaction.addEventListener('click', () => {
  var alertSuccess = document.getElementById("alert-success");
  var alertDanger = document.getElementById("alert-danger");

  const amount = document.getElementById("amount").value
  const sender = document.getElementById("sender").value
  const recipient = document.getElementById("recipient").value

  if (amount === "" || sender == "" || recipient == "") {
    alertSuccess.style.display = "none";
    alertDanger.style.display = "inline-Block";
    alertDanger.textContent = `Please fill all neccerery boxes.`
  }
  else {
    alertDanger.style.display = "none";
    alertSuccess.style.display = "inline-Block";
    alertSuccess.textContent = `${performTransaction(amount, sender, recipient)}`;
  }
  // console.log(bitcoin);
})

// mine new block
function mineBlock(_lastBlock, _prevBlockHash, _currentBlockData, _nodeAddress) {
  var showIndex = document.getElementById("new-block-index");
  var showNewBlockNonce = document.getElementById("new-block-nonce");
  var showPrevHash = document.getElementById("previous-block-hash");
  var showCurrHash = document.getElementById("new-block-hash");

  const nonce = bitcoin.proofOfWork(_prevBlockHash, _currentBlockData);
  
  const blockHash = bitcoin.hashBlock(_prevBlockHash, _currentBlockData, nonce);
  
  // create a reward
  bitcoin.createNewTransaction(12.5, "00", _nodeAddress);
  
  const newBlock = bitcoin.createNewBlock(nonce, _prevBlockHash, blockHash);
  console.log(newBlock);
  
  
  showIndex.value = `${newBlock['index']}`;
  showNewBlockNonce.value = `${newBlock['nonce']}`;
  showPrevHash.value = `${newBlock['prevBlockHash']}`;
  showCurrHash.value = `${newBlock['hash']}`;

  console.log(`New Block mined Successfully :)`);
}

mineNewBlock.addEventListener('click', () => {
  const block = document.getElementById("block");

  const nodeAddress = document.getElementById("miner-address").value;

  const lastBlock = bitcoin.getLastBlock();
  const prevBlockHash = lastBlock["hash"];
  const currentBlockData = {
    timestamp: Date.now(),
    index: lastBlock["index"] + 1,
    transactions: bitcoin.pendingTransactions
  };
  
  block.style.display = "block";
  mineBlock(lastBlock, prevBlockHash, currentBlockData, nodeAddress);
})

