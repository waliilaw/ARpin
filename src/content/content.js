// Content script for ARpin extension

// Function to get the full page content
function getPageContent() {
  // Get the HTML content
  const html = document.documentElement.outerHTML;
  
  // Get the page metadata
  const metadata = {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    description: document.querySelector('meta[name="description"]')?.content || '',
    keywords: document.querySelector('meta[name="keywords"]')?.content || '',
    author: document.querySelector('meta[name="author"]')?.content || '',
    viewport: document.querySelector('meta[name="viewport"]')?.content || ''
  };

  // Create a structured data object
  const pageData = {
    html,
    metadata,
    timestamp: Date.now()
  };

  return pageData;
}

// Listen for messages from the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.id === 'getPageContent') {
    try {
      const pageData = getPageContent();
      sendResponse({ success: true, data: pageData });
    } catch (error) {
      console.error('Error getting page content:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Keep the message channel open for async response
  }
}); 