// Imports
let bch = require('./src/main')

// Settings
let BCH = new bch('mainnet')

  // 2 Addresses for Testing
let Addresses = [
  'bitcoincash:qpqleyswmje4av2fghdgayth420nmegsp58fsrnmk4',
  'bitcoincash:qpkufg8n60hz42q26sngftaanlmdvu2ncq8skfc630'
]
  // Their Corrresponding Private Keys
let PrivKeys = []
  // BIP39 Mnemonic for an unrelated Account
let mnemonic = ""

// Maincode
// BCH.createWallet().then(console.log)
// BCH.createWallet('demoWallet1').then(console.log)
// BCH.importWallet('demoWallet1').then(console.log)
// BCH.checkBalance(Addresses[0]).then(console.log)
// BCH.getUTXO(Addresses[0]).then(info => console.log(info[0]))
// BCH.gatherUTXO(Addresses[0],70000).then(console.log)
// BCH.loadWallet(PrivKeys[0]).then(console.log)
// BCH.loadWallet(null,mnemonic).then(console.log)
// BCH.sendBCH(PrivKeys[0],Addresses[1],50000).then(console.log)

// TIP: A way to check Balances for a collection of Addresses
Promise.all(Addresses.map(addr => BCH.checkBalance(addr))).then(console.log)

let payment = 4000, cja = 600
// Gather UTXOs from your account starting from highest-value bills
Promise.all(Addresses.map(addr => BCH.gatherUTXO(addr,payment))).then(info1 => {
  let Inputs = info1.map(x => x.utxos)
  let Amount = info1.map(x => x.amount)

  // Payment Amount | Coinjoin Amount | Custom Fee
  Promise.all(Amount.map((amount,idx) => BCH.splitInput(payment,amount,cja,PrivKeys[idx],500))).then(info2 => {
    // At this point, the private keys are noted by the caller and kept securely
    // Then, the information is filtered for the joined transaction
    let Keyring = [], Outputs = [], ChangeKeys = []
    for (let i=0; i<info2.length; i++) {
      Keyring[i] = [], Outputs[i] = []
      info2[i].forEach(({account,value}) => {
        Keyring[i].push(account.privateK)
        Outputs[i].push({address: account.legacyA,value})
        // Store PK for Change Accounts Separately
        if (value !== cja) { ChangeKeys[i] = account.privateK }
      })
    }

    // console.log({Keyring,Outputs,Inputs})
    // console.log(Outputs)
    // console.log(Inputs)

    // Simulate Sending Inputs/Outputs to Coordinator
    BCH.combineIO(Inputs,Outputs).then(info3 => {
      // Simulate User Signing Process
      Promise.all(PrivKeys.map((key,idx) => BCH.signPSBT(info3,key,Inputs[idx]))).then(info4 => {
        // Simulate Merging Signatures
        BCH.mergeSigns(info4).then(info5 => {
          // Coordinator Broadcasts the Transaction
          BCH.broadcastPSBT(info5).then(console.log).catch(console.log)
        })
      })
    })
  })
})