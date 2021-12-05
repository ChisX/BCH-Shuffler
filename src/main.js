// Imports
let ECPAIR = require('@psf/bch-js/src/ecpair')
let TXMAKE = require('@psf/bch-js/src/transaction-builder')
let MAINJS = require('mainnet-js')
let BCHLIB = require('bitcoincashjs-lib')
let axios  = require('axios').default
let fs = require('fs')

// Settings
let APIKEY = ''

// Maincode
class BitcoinCashWallet {
  constructor(NETWORK) {
    this.net = NETWORK
  }

  toLegacy(privKey) {
    return new Promise((resolve,reject) => {
      try {
        resolve(ECPAIR.toLegacyAddress(ECPAIR.fromWIF(privKey)))
      } catch (err) { reject(err) }
    })
  }

  createWallet(name=null) {
    return new Promise(async (resolve,reject) => {
      try {
        let account = await MAINJS.Wallet.newRandom()
        let net = (this.net === 'mainnet' ? 'main' : 'test')
        account = {
          name: (name ? name : 'anon'),
          mnemonic: account.mnemonic,
          cashaddr: account.cashaddr,
          privateK: account.privateKeyWif,
          legacyA : await this.toLegacy(account.privateKeyWif)
        }

        // If a name is provided, create and save account info as a file
        if (name) fs.writeFileSync(`./wallets/${net}/${name}.json`,JSON.stringify(account,null,2))
        resolve(account)
      } catch (err) { reject(err) }
    })
  }

  // Load a wallet file
  importWallet(name) {
    let net = (this.net === 'mainnet' ? 'main' : 'test')
    return new Promise((resolve,reject) => {
      fs.readFile(`./wallets/${net}/${name}.json`,'utf8',(err,data) => {
        if (err || !name) reject(err || 'ERROR: Missing Name Error')
        resolve(data)
      })
    })
  }

  // Load wallet functions, using either private key or bip39-mnemonic
  loadWallet(privKey,mnemonic=null) {
    return new Promise((resolve,reject) => {
      try {
        if (!privKey && !mnemonic) reject('ERROR: Private Key or Mnemonic must be Provided')
        if (privKey)  resolve(MAINJS.Wallet.fromWIF(privKey))
        if (mnemonic) resolve(MAINJS.Wallet.fromSeed(mnemonic))
      } catch (err) { reject(err) }
    })
  }

  formatWallet(prk,name='anon') {
    return new Promise(async (resolve,reject) => {
      try {
        let account = await this.loadWallet(prk)
        resolve({
          name,
          mnemonic: account.mnemonic,
          cashaddr: account.cashaddr,
          privateK: account.privateKeyWif,
          legacyA : await this.toLegacy(account.privateKeyWif)
        })
      } catch (err) { reject(err) }
    })
  }

  checkBalance(address) {
    return new Promise((resolve,reject) => {
      try {
        let url = `https://api.blockchair.com/bitcoin-cash/dashboards/address/${address}`
        axios.get(url).then(({data}) => resolve(data.data[address].address.balance))
      } catch (err) { reject(err) }
    })
  }

  getUTXO(address) {
    return new Promise((resolve,reject) => {
      try {
        let url = `https://api.blockchair.com/bitcoin-cash/dashboards/address/${address}`
        axios.get(url).then(({data}) => resolve(data.data[address].utxo))
      } catch (err) { reject(err) }
    })
  }

  // Gather UTXO up to an amount for a transaction from an address
  gatherUTXO(addr,amount) {
    return new Promise(async (resolve,reject) => {
      try {
        // Check if balance is sufficient
        let balance = await this.checkBalance(addr)
        if (balance < amount) reject('ERROR: Insufficient Balance')

        // Sort UTXOs in Descending Order of Value
        let utxos = (await this.getUTXO(addr)).sort((x,y) => y.value - x.value)
        
        // Gather UTXOs up to specified amount
        let gathered = 0, index = 0
        while (gathered < amount) {
          gathered += utxos[index].value
          index++
        }

        // Return list of UTXOs that fulfil amount condition
        resolve({utxos: utxos.slice(0,index+1),amount: gathered})
      } catch (err) { reject(err) }
    })
  }

  // Send Satoshi
  sendBCH(prk,to,amount) {
    return new Promise(async (resolve,reject) => {
      try {
        // Import Wallet from Private Key
        let wallet = await this.loadWallet(prk)
        resolve(await wallet.send([{cashaddr: to,value: amount,unit: 'sat'}]))
      } catch (err) { reject(err) }
    })
  }
}

// Helper Functions
function HexHash(hash) {
  return Buffer.from(hash).reverse().toString('hex')
}

function locateInput(inpArray,hash,index) {
  return inpArray.filter(inp => (HexHash(inp.hash) === hash) && (inp.index === index))[0]
}

function getSignedInputs(inpArray,userIndex) {
  return inpArray[userIndex].ins.filter(x => x.script.toString('hex') !== '')
}

// Exports
module.exports = BitcoinCashWallet