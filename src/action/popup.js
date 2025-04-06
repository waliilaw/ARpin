import { createApp } from 'vue';

const app = createApp({
  data() {
    return {
      walletAddress: null,
      archives: [],
      isConnecting: false,
      isArchiving: false,
      isLoadingArchives: false,
      error: null
    };
  },

  computed: {
    truncatedAddress() {
      if (!this.walletAddress) return '';
      return `${this.walletAddress.slice(0, 6)}...${this.walletAddress.slice(-4)}`;
    }
  },

  methods: {
    async connectWallet() {
      try {
        this.isConnecting = true;
        this.error = null;
        await browser.runtime.sendMessage({ id: 'connectWallet' });
        await this.loadWalletAddress();
        await this.loadArchives();
      } catch (error) {
        console.error('Error connecting wallet:', error);
        this.error = 'Failed to connect wallet. Please try again.';
      } finally {
        this.isConnecting = false;
      }
    },

    async disconnectWallet() {
      try {
        this.error = null;
        await browser.runtime.sendMessage({ id: 'disconnectWallet' });
        this.walletAddress = null;
        this.archives = [];
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        this.error = 'Failed to disconnect wallet. Please try again.';
      }
    },

    async loadWalletAddress() {
      try {
        this.error = null;
        this.walletAddress = await browser.runtime.sendMessage({ id: 'getWalletAddress' });
      } catch (error) {
        console.error('Error loading wallet address:', error);
        this.error = 'Failed to load wallet address. Please try again.';
      }
    },

    async loadArchives() {
      try {
        this.isLoadingArchives = true;
        this.error = null;
        this.archives = await browser.runtime.sendMessage({ id: 'getArchivedPages' });
      } catch (error) {
        console.error('Error loading archives:', error);
        this.error = 'Failed to load archives. Please try again.';
      } finally {
        this.isLoadingArchives = false;
      }
    },

    async archiveCurrentPage() {
      try {
        this.isArchiving = true;
        this.error = null;
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        
        // Get the page content using the content script
        const response = await browser.tabs.sendMessage(tab.id, { id: 'getPageContent' });
        
        if (response.success) {
          // Archive the page
          const archiveResponse = await browser.runtime.sendMessage({
            id: 'archivePage',
            data: response.data
          });

          if (archiveResponse.success) {
            await this.loadArchives();
          } else {
            throw new Error('Failed to archive page');
          }
        } else {
          throw new Error(response.error || 'Failed to get page content');
        }
      } catch (error) {
        console.error('Error archiving page:', error);
        this.error = error.message || 'Failed to archive page. Please try again.';
      } finally {
        this.isArchiving = false;
      }
    },

    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString();
    }
  },

  async mounted() {
    try {
      await this.loadWalletAddress();
      if (this.walletAddress) {
        await this.loadArchives();
      }
    } catch (error) {
      console.error('Error initializing popup:', error);
      this.error = 'Failed to initialize. Please try again.';
    }
  }
});

app.mount('#app'); 