# BCH-Shuffler
The BitcoinCash shuffling functions are based on an asynchronous implementation of the BitcoinCashJS library, aiming for a direct boost of privacy in digital transactions. Built in Javascript, it is a design with cross-platform integration in mind, capable of offering the same quality of service to multiple platforms, reaching as many interested users as possible. We, at ARCANE TECHNOLOGIES™., intend to offer this feature out-of-the-box at the launch of our multi-platform cryptocurrency wallet.

# Diclaimer - APIs Used
## This work was made possible and further facilitated via use of the following API services:
API Service        | Homepage URL                                                | API Documentation
-----------------  | ----------------------------------------------------- | ---------------------------------------------------------
Fullstack.Cash API | [Fullstack.cash](https://api.fullstack.cash/)         | https://api.fullstack.cash/docs
Blockchair API     | [Blockchair.com](https://blockchair.com/)             | https://blockchair.com/api/docs
Insomnia API       | [Insomnia.fountainhead](https://fountainhead.cash/)   | https://insomnia.fountainhead.cash
Mainnet REST API   | [Mainnet.cash](https://mainnet.cash/)                 | https://mainnet.cash/tutorial/rest.html

# Brief Description
BitcoinCash shuffling applies using protocols based on the structure of a "Partially Signed Bitcoin Transaction" (PSBT, for short). This is a concept that firstly derives from certain bitcoin improvement proposals(BIPs), but due to the resemblance of the currencies on the programmatic level, can be abstracted and implemented for Bitcoin Cash as well.

Partially Signed Bitcoin Transactions (PSBTs) are a data format that allows wallets to exchange information about a Bitcoin transaction and the signatures necessary to complete it. This ultimately allows for a joint-transaction between users to take place, obfuscating the relations between spenders and receivers, and providing a degree of privacy in crypto-transactions proportional to the number of participants in it.

For a more detailed explanation, you may read the following articles:
* https://bitcoinexchangeguide.com/bitcoin-improvement-proposal-bip-174-for-partially-signed-bitcoin-transactions-psbt/
* https://river.com/learn/what-are-partially-signed-bitcoin-transactions-psbts/

# Technical Documentation
Developers (and all else both interested and technically knowledgeable) are advised to personally examine the original proposals that first conceived and elaborated upon the ideas that are being implemented now in practice:
1. BIP-0174      - https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki
2. BIP-0370      - https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki

# Programming Libraries
1. BitcoinCashJS    - https://github.com/bigearth/bitcoincashjs-lib
2. PSF's Bch-js     - https://github.com/Permissionless-Software-Foundation/bch-js
3. Mainnet-js       - https://github.com/mainnet-cash/mainnet-js