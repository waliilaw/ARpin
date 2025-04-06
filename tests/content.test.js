import content from '../src/content/content.js';

describe('Content Script', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock document
    document.documentElement.innerHTML = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="Test description">
          <meta name="keywords" content="test, keywords">
          <meta name="author" content="Test Author">
          <meta name="viewport" content="width=device-width">
        </head>
        <body>
          <h1>Test Content</h1>
        </body>
      </html>
    `;
  });

  it('should get page content correctly', () => {
    const pageData = content.getPageContent();
    
    expect(pageData).toHaveProperty('html');
    expect(pageData).toHaveProperty('metadata');
    expect(pageData).toHaveProperty('timestamp');
    
    expect(pageData.metadata).toEqual({
      title: 'Test Page',
      url: window.location.href,
      description: 'Test description',
      keywords: 'test, keywords',
      author: 'Test Author',
      viewport: 'width=device-width'
    });
  });

  it('should handle missing metadata', () => {
    // Remove meta tags
    document.querySelectorAll('meta').forEach(meta => meta.remove());
    
    const pageData = content.getPageContent();
    
    expect(pageData.metadata).toEqual({
      title: 'Test Page',
      url: window.location.href,
      description: '',
      keywords: '',
      author: '',
      viewport: ''
    });
  });

  it('should handle message listener', async () => {
    const mockSendResponse = jest.fn();
    
    // Simulate message
    content.browser.runtime.onMessage.addListener.mock.calls[0][0](
      { id: 'getPageContent' },
      { tab: { id: 1 } },
      mockSendResponse
    );
    
    // Check if response was sent
    expect(mockSendResponse).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        html: expect.any(String),
        metadata: expect.any(Object),
        timestamp: expect.any(Number)
      })
    });
  });

  it('should handle message listener error', async () => {
    const mockSendResponse = jest.fn();
    
    // Mock error in getPageContent
    const originalGetPageContent = content.getPageContent;
    content.getPageContent = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Simulate message
    content.browser.runtime.onMessage.addListener.mock.calls[0][0](
      { id: 'getPageContent' },
      { tab: { id: 1 } },
      mockSendResponse
    );
    
    // Check if error response was sent
    expect(mockSendResponse).toHaveBeenCalledWith({
      success: false,
      error: 'Test error'
    });
    
    // Restore original function
    content.getPageContent = originalGetPageContent;
  });
}); 