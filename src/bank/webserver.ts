import express from 'express';
import { Bank } from './bank';
import { Database } from '../database/database';

const app = express();
const port = 3000;
const database = new Database();
console.log("hi");
const bank = new Bank(database);

async function initializeBank() {
  console.log("konten werden erstellt")
  await bank.loadAccounts();
  if (bank.accounts.length < 2) {
    await bank.createAccount(1234, 2000);
    await bank.createAccount(5678, 5000);
  }
}

initializeBank().then(() => {
  console.log('Bank initialized');

});

app.get('/accounts', async (req, res) => {
  await bank.showAccounts();
  res.send('Konten angezeigt. Details in der Konsole.');
});

app.get('/transaction', async (req, res) => {
    try {
      const accounts = bank.accounts;
      if (accounts.length < 2) {
        res.send('Nicht genügend Konten für eine Transaktion vorhanden.');
        return;
      }
  
      const account1 = accounts[0];
      const account2 = accounts[1];
      const transactionAmount = Math.floor(Math.random() * 20001) - 10000;
  
      await bank.transaction(account1.accountNumber, account2.accountNumber, transactionAmount, account1.pincode);
      res.send(`Transaktion von ${transactionAmount}€ von Konto ${account1.accountNumber} zu Konto ${account2.accountNumber} erfolgreich.`);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Unbekannter Fehler';
      res.status(500).send('Fehler bei der Transaktion: ' + errorMessage);
    }
  });
  

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
