// import {gethash} from "./sha256.js";
import Sha256 from './sha256.js';
var hashlist = [];

function get_all_hashes(transactions){
    for (let i = 0; i < transactions.length; i++) {
        hashlist.push(Sha256.hash(JSON.stringify(transactions[i])));
    }
}
function merkle_tree(hashlist) {
if(hashlist.length == 0){return null};
    if(hashlist.length == 1){
        return hashlist[0];
    }
    const new_hashlist=[];
   for(let i=0;i<hashlist.length-1;i+=2){
        new_hashlist.push(Sha256.hash(hashlist[i]+hashlist[i+1]));
    }
    //for last single Element
    if((hashlist.length)%2 == 1){
        new_hashlist.push(Sha256.hash(hashlist[hashlist.length-1]+hashlist[hashlist.length-1]));
    }
    // console.log(new_hashlist);
    return merkle_tree(new_hashlist);
}
function getMerkleroot(transactions) {
    hashlist = [];
    get_all_hashes(transactions);
    return merkle_tree(hashlist);
}
export {getMerkleroot};