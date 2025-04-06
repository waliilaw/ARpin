<template>
  <vn-app>
    <div class="options-container">
      <h1>ARpin Settings</h1>

      <div class="section">
        <h2>Arweave Network</h2>
        <vn-text-field
          v-model="arweaveNode"
          label="Arweave Node URL"
          placeholder="https://arweave.net"
          :rules="[rules.required, rules.url]"
          @update:model-value="saveSettings"
        ></vn-text-field>
      </div>

      <div class="section">
        <h2>AI Tagging</h2>
        <vn-switch
          v-model="enableAiTagging"
          label="Enable AI-powered content tagging"
          @update:model-value="saveSettings"
        ></vn-switch>

        <div class="subsection" v-if="enableAiTagging">
          <vn-select
            v-model="aiModel"
            label="AI Model"
            :items="aiModelOptions"
            @update:model-value="saveSettings"
          ></vn-select>

          <vn-slider
            v-model="confidenceThreshold"
            label="Tag Confidence Threshold"
            :min="0"
            :max="100"
            :step="5"
            thumb-label
            @update:model-value="saveSettings"
          ></vn-slider>
        </div>
      </div>

      <div class="section">
        <h2>Storage</h2>
        <vn-switch
          v-model="enableLocalCache"
          label="Enable local caching of archived page metadata"
          @update:model-value="saveSettings"
        ></vn-switch>

        <div class="subsection" v-if="enableLocalCache">
          <vn-text-field
            v-model.number="cacheDuration"
            label="Cache Duration (days)"
            type="number"
            :rules="[rules.required, rules.positive]"
            @update:model-value="saveSettings"
          ></vn-text-field>
        </div>
      </div>

      <div class="section">
        <h2>Display</h2>
        <vn-switch
          v-model="showTransactionStatus"
          label="Show transaction status in popup"
          @update:model-value="saveSettings"
        ></vn-switch>
      </div>
    </div>
  </vn-app>
</template>

<script>
import storage from '../storage/storage';

export default {
  name: 'Options',

  data() {
    return {
      arweaveNode: 'https://arweave.net',
      enableAiTagging: true,
      aiModel: 'default',
      confidenceThreshold: 75,
      enableLocalCache: true,
      cacheDuration: 30,
      showTransactionStatus: true,

      aiModelOptions: [
        { title: 'Default AO Process', value: 'default' },
        { title: 'Custom Model', value: 'custom' }
      ],

      rules: {
        required: value => !!value || 'Required',
        url: value => {
          try {
            new URL(value);
            return true;
          } catch {
            return 'Must be a valid URL';
          }
        },
        positive: value => value > 0 || 'Must be greater than 0'
      }
    };
  },

  methods: {
    async loadSettings() {
      const settings = await storage.get('settings');
      if (settings) {
        this.arweaveNode = settings.arweaveNode || this.arweaveNode;
        this.enableAiTagging = settings.enableAiTagging ?? this.enableAiTagging;
        this.aiModel = settings.aiModel || this.aiModel;
        this.confidenceThreshold = settings.confidenceThreshold || this.confidenceThreshold;
        this.enableLocalCache = settings.enableLocalCache ?? this.enableLocalCache;
        this.cacheDuration = settings.cacheDuration || this.cacheDuration;
        this.showTransactionStatus = settings.showTransactionStatus ?? this.showTransactionStatus;
      }
    },

    async saveSettings() {
      await storage.set('settings', {
        arweaveNode: this.arweaveNode,
        enableAiTagging: this.enableAiTagging,
        aiModel: this.aiModel,
        confidenceThreshold: this.confidenceThreshold,
        enableLocalCache: this.enableLocalCache,
        cacheDuration: this.cacheDuration,
        showTransactionStatus: this.showTransactionStatus
      });
    }
  },

  async mounted() {
    await this.loadSettings();
  }
};
</script>

<style>
.options-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  margin: 0 0 32px 0;
  font-size: 24px;
  font-weight: 500;
}

.section {
  margin-bottom: 32px;
}

.section h2 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 500;
}

.subsection {
  margin-top: 16px;
  padding-left: 24px;
}

.v-text-field,
.v-select {
  max-width: 400px;
}

.v-slider {
  max-width: 300px;
}
</style>
