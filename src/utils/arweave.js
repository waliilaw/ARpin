import Arweave from 'arweave';
import { createData } from 'ar-gql';

class ArweaveService {
  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    this.gql = createData();
  }

  async connectWallet() {
    try {
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
      return await window.arweaveWallet.getActiveAddress();
    } catch (error) {
      console.error('Failed to connect to ArConnect:', error);
      throw error;
    }
  }

  async getWalletBalance(address) {
    try {
      const winston = await this.arweave.wallets.getBalance(address);
      return this.arweave.ar.winstonToAr(winston);
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      throw error;
    }
  }

  async archivePage(pageData) {
    try {
      const data = JSON.stringify({
        url: pageData.url,
        title: pageData.title,
        content: pageData.content,
        timestamp: Date.now()
      });

      const transaction = await this.arweave.createTransaction({ data });
      
      transaction.addTag('Content-Type', 'application/json');
      transaction.addTag('App-Name', 'ARpin');
      transaction.addTag('Type', 'webpage-archive');
      transaction.addTag('URL', pageData.url);

      await window.arweaveWallet.sign(transaction);
      await this.arweave.transactions.post(transaction);

      return transaction.id;
    } catch (error) {
      console.error('Failed to archive page:', error);
      throw error;
    }
  }

  async searchArchives(query) {
    try {
      const result = await this.gql.search()
        .tag('App-Name', 'ARpin')
        .tag('Type', 'webpage-archive')
        .findAll();
      
      return result.filter(tx => 
        tx.tags.some(tag => 
          tag.name === 'URL' && tag.value.toLowerCase().includes(query.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Failed to search archives:', error);
      throw error;
    }
  }

  async getArchivedPage(transactionId) {
    try {
      const data = await this.arweave.transactions.getData(transactionId, {
        decode: true,
        string: true
      });
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to get archived page:', error);
      throw error;
    }
  }
}

export const arweaveService = new ArweaveService(); 