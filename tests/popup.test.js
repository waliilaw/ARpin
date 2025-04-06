import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import popup from '../src/action/popup.js';

describe('Popup', () => {
  let wrapper;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create and mount the component
    const app = createApp(popup);
    wrapper = mount(app);
  });

  it('should render the initial state correctly', () => {
    expect(wrapper.find('.wallet-section').exists()).toBe(true);
    expect(wrapper.find('.connect-button').exists()).toBe(true);
    expect(wrapper.find('.main-section').exists()).toBe(false);
  });

  it('should handle wallet connection', async () => {
    // Mock successful wallet connection
    browser.runtime.sendMessage.mockResolvedValueOnce({ success: true });
    browser.runtime.sendMessage.mockResolvedValueOnce('test-wallet-address');
    browser.runtime.sendMessage.mockResolvedValueOnce([]);

    // Click connect button
    await wrapper.find('.connect-button').trigger('click');

    // Check if wallet is connected
    expect(wrapper.vm.walletAddress).toBe('test-wallet-address');
    expect(wrapper.find('.main-section').exists()).toBe(true);
  });

  it('should handle wallet connection error', async () => {
    // Mock failed wallet connection
    browser.runtime.sendMessage.mockRejectedValueOnce(new Error('Connection failed'));

    // Click connect button
    await wrapper.find('.connect-button').trigger('click');

    // Check error message
    expect(wrapper.vm.error).toBe('Failed to connect wallet. Please try again.');
  });

  it('should handle page archiving', async () => {
    // Setup wallet connection
    wrapper.vm.walletAddress = 'test-wallet-address';
    wrapper.vm.archives = [];

    // Mock successful page content retrieval and archiving
    browser.tabs.query.mockResolvedValueOnce([{ id: 1 }]);
    browser.tabs.sendMessage.mockResolvedValueOnce({
      success: true,
      data: {
        html: '<html>test</html>',
        metadata: {
          title: 'Test Page',
          url: 'https://example.com'
        }
      }
    });
    browser.runtime.sendMessage.mockResolvedValueOnce({ success: true, txId: 'test-tx-id' });
    browser.runtime.sendMessage.mockResolvedValueOnce([]);

    // Click archive button
    await wrapper.find('.archive-button').trigger('click');

    // Check if archive was successful
    expect(wrapper.vm.isArchiving).toBe(false);
    expect(wrapper.vm.error).toBeNull();
  });

  it('should handle archive error', async () => {
    // Setup wallet connection
    wrapper.vm.walletAddress = 'test-wallet-address';

    // Mock failed page content retrieval
    browser.tabs.query.mockResolvedValueOnce([{ id: 1 }]);
    browser.tabs.sendMessage.mockRejectedValueOnce(new Error('Failed to get content'));

    // Click archive button
    await wrapper.find('.archive-button').trigger('click');

    // Check error message
    expect(wrapper.vm.error).toBe('Failed to get page content');
  });

  it('should format dates correctly', () => {
    const timestamp = 1625097600000; // July 1, 2021
    const formattedDate = wrapper.vm.formatDate(timestamp);
    expect(formattedDate).toMatch(/7\/1\/2021/);
  });
}); 