import { config } from '@vue/test-utils';
import { createApp } from 'vue';
import Vuetify from 'vuetify';

// Create a Vue app instance
const app = createApp({});
app.use(Vuetify);

// Configure Vue Test Utils
config.global.plugins = [Vuetify];

// Mock browser APIs
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  }
};

// Mock Arweave
jest.mock('arweave', () => ({
  init: jest.fn().mockReturnValue({
    createTransaction: jest.fn(),
    transactions: {
      sign: jest.fn(),
      post: jest.fn()
    }
  })
}));

// Mock ArConnect
jest.mock('arconnect', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  getActiveAddress: jest.fn()
}));

// Mock Vue Test Utils
config.global.mocks = {
  $t: (key) => key
}; 