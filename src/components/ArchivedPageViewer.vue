<template>
  <div class="archived-page-viewer">
    <div class="viewer-header">
      <h2>{{ pageData.title }}</h2>
      <div class="metadata">
        <a :href="pageData.url" target="_blank" rel="noopener">{{ pageData.url }}</a>
        <span class="timestamp">Archived on: {{ formatDate(pageData.timestamp) }}</span>
      </div>
      <div class="transaction-info">
        <span>Transaction ID: {{ transactionId }}</span>
        <a :href="viewerUrl" target="_blank" rel="noopener">View on Arweave</a>
      </div>
    </div>

    <div class="viewer-content" v-if="pageData.content">
      <iframe
        :srcdoc="pageData.content"
        sandbox="allow-same-origin"
        class="content-frame"
      ></iframe>
    </div>

    <div v-else class="loading-state">
      <vn-progress-circular indeterminate></vn-progress-circular>
      <span>Loading archived content...</span>
    </div>
  </div>
</template>

<script>
import { arweaveService } from '../utils/arweave';

export default {
  name: 'ArchivedPageViewer',

  props: {
    transactionId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      pageData: null,
      error: null
    };
  },

  computed: {
    viewerUrl() {
      return `https://viewblock.io/arweave/tx/${this.transactionId}`;
    }
  },

  methods: {
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString();
    },

    async loadArchivedPage() {
      try {
        this.pageData = await arweaveService.getArchivedPage(this.transactionId);
      } catch (error) {
        console.error('Failed to load archived page:', error);
        this.error = error;
      }
    }
  },

  async mounted() {
    await this.loadArchivedPage();
  }
};
</script>

<style>
.archived-page-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}

.viewer-header {
  margin-bottom: 16px;
}

.viewer-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.metadata {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  margin-bottom: 8px;
}

.metadata a {
  color: var(--v-theme-primary);
  text-decoration: none;
}

.metadata a:hover {
  text-decoration: underline;
}

.timestamp {
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.transaction-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.transaction-info a {
  color: var(--v-theme-primary);
  text-decoration: none;
}

.transaction-info a:hover {
  text-decoration: underline;
}

.viewer-content {
  flex: 1;
  position: relative;
}

.content-frame {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 4px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100%;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style> 