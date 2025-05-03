// Cognitive Agent implementation in JavaScript
class CognitiveAgent {
    constructor() {
        this.preferences = {
            interests: ['technology', 'innovation', 'research'],
            topics: ['AI', 'machine learning', 'artificial intelligence'],
            location: ''
        };
        this.browsingHistory = [];
        console.log('CognitiveAgent created with initial preferences:', this.preferences);
    }

    updatePreferences(newPreferences) {
        console.log('Updating preferences from:', this.preferences, 'to:', newPreferences);
        this.preferences = { ...this.preferences, ...newPreferences };
    }

    evaluateContentRelevance(content) {
        console.log('Evaluating content relevance for:', content.substring(0, 100) + '...');
        let score = 0;
        
        // Check interests
        this.preferences.interests.forEach(interest => {
            if (content.toLowerCase().includes(interest.toLowerCase())) {
                score += 2;
            }
        });
        
        // Check topics
        this.preferences.topics.forEach(topic => {
            if (content.toLowerCase().includes(topic.toLowerCase())) {
                score += 3;
            }
        });
        
        // Check location if specified
        if (this.preferences.location && 
            content.toLowerCase().includes(this.preferences.location.toLowerCase())) {
            score += 1;
        }
        
        console.log('Content relevance score:', score);
        return score;
    }

    processPage(pageContent) {
        console.log('Processing page:', pageContent.url);
        const relevanceScore = this.evaluateContentRelevance(pageContent.text);
        console.log('Page relevance score:', relevanceScore);
        
        // Update browsing history
        this.browsingHistory.push({
            url: pageContent.url,
            title: pageContent.title,
            timestamp: new Date().toISOString(),
            relevance: relevanceScore
        });
        
        // If content is relevant, return highlights
        if (relevanceScore > 0) {
            const highlights = [
                ...this.preferences.interests,
                ...this.preferences.topics
            ].filter(topic => 
                pageContent.text.toLowerCase().includes(topic.toLowerCase())
            );
            
            console.log('Generated highlights:', highlights);
            return { highlights };
        }
        
        return { highlights: [] };
    }
}

// Initialize the cognitive agent
const agent = new CognitiveAgent();
console.log('Cognitive agent initialized');

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    
    if (request.type === 'updatePreferences') {
        console.log('Updating preferences:', request.preferences);
        agent.updatePreferences(request.preferences);
        sendResponse({ status: 'success' });
    } else if (request.type === 'pageLoaded') {
        console.log('Processing page:', request.content.url);
        const result = agent.processPage(request.content);
        console.log('Page processing result:', result);
        
        // Send highlight request to content script
        if (result.highlights && result.highlights.length > 0) {
            console.log('Sending highlight request to content script:', result.highlights);
            chrome.tabs.sendMessage(sender.tab.id, {
                type: 'highlight',
                content: result.highlights
            }).catch(error => {
                console.error('Error sending highlight message:', error);
            });
        }
        
        sendResponse({ status: 'success' });
    }
    return true; // Keep the message channel open for async response
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tab updated:', { tabId, changeInfo, tab });
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        console.log('Injecting content script into:', tab.url);
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            console.log('Content script injected successfully');
        }).catch(error => {
            console.error('Error injecting content script:', error);
        });
    }
});

// Helper function to check if URL is valid for processing
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

// Function to get page content
function getPageContent() {
    return {
        title: document.title,
        text: document.body.innerText,
        url: window.location.href
    };
} 