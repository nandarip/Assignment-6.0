// Function to generate a summary of the article
function generateSummary(text) {
    console.log('Generating summary for text:', text.substring(0, 100) + '...');
    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Filter out very short sentences and clean them
    const cleanSentences = sentences
        .filter(sentence => sentence.length > 20)
        .map(sentence => sentence.trim());
    
    // Select the first 4 sentences as summary
    const summary = cleanSentences.slice(0, 4).join(' ');
    console.log('Generated summary:', summary);
    return summary;
}

// Function to explain highlighted content
function explainHighlightedContent(highlightedText, topics) {
    const topic = topics.find(t => 
        new RegExp(`\\b${t}\\b`, 'i').test(highlightedText)
    );
    
    if (!topic) return "This content is relevant to your interests.";
    
    const explanations = {
        'AI': 'This section discusses artificial intelligence and its applications.',
        'technology': 'This section covers technological developments and innovations.',
        'science': 'This section explains scientific concepts and discoveries.',
        'business': 'This section relates to business strategies and market trends.',
        'health': 'This section discusses health-related topics and medical information.',
        'education': 'This section covers educational topics and learning methods.',
        'environment': 'This section relates to environmental issues and sustainability.',
        'politics': 'This section discusses political matters and governance.',
        'culture': 'This section covers cultural aspects and societal trends.',
        'sports': 'This section relates to sports events and athletic achievements.'
    };
    
    return explanations[topic.toLowerCase()] || 
           `This section discusses ${topic.toLowerCase()} and related topics.`;
}

// Function to add summary and explanation overlay
function addSummaryOverlay(summary, highlightedContent, topics) {
    console.log('Adding summary overlay with:', { summary, highlightedContent, topics });
    // Remove existing overlay if any
    const existingOverlay = document.getElementById('cognitive-summary');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'cognitive-summary';
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        font-family: Arial, sans-serif;
        border: 1px solid #e0e0e0;
        max-height: 80vh;
        overflow-y: auto;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Article Summary';
    title.style.cssText = `
        margin: 0 0 10px 0;
        color: #2196F3;
        font-size: 16px;
    `;
    overlay.appendChild(title);

    const summaryText = document.createElement('p');
    summaryText.textContent = summary;
    summaryText.style.cssText = `
        margin: 0 0 15px 0;
        line-height: 1.5;
    `;
    overlay.appendChild(summaryText);

    if (highlightedContent) {
        const explanationTitle = document.createElement('h4');
        explanationTitle.textContent = 'Highlight Explanation';
        explanationTitle.style.cssText = `
            margin: 15px 0 10px 0;
            color: #1976D2;
            font-size: 14px;
        `;
        overlay.appendChild(explanationTitle);

        const explanation = document.createElement('p');
        explanation.textContent = explainHighlightedContent(highlightedContent, topics);
        explanation.style.cssText = `
            margin: 0;
            font-style: italic;
            color: #666;
        `;
        overlay.appendChild(explanation);
    }

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
    `;
    closeButton.onclick = () => overlay.remove();
    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);
}

// Function to safely highlight sentences on the page
function highlightSentences(topics, color = '#FFFF00') {
    // Create a style element for the highlight
    const style = document.createElement('style');
    style.textContent = `
        .cognitive-highlight {
            background-color: ${color};
            padding: 2px 4px;
            border-radius: 4px;
            margin: 2px 0;
            display: inline-block;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .cognitive-highlight:hover {
            background-color: #FFD700;
        }
    `;
    document.head.appendChild(style);

    // Function to show explanation in popup
    function showExplanation(text, topics) {
        const explanation = explainHighlightedContent(text, topics);
        chrome.runtime.sendMessage({
            type: 'showExplanation',
            explanation: explanation
        });
    }

    // Function to split text into sentences or search result snippets
    function splitIntoContent(text) {
        // For search results, split on newlines or sentence endings
        if (window.location.hostname.includes('google.com')) {
            return text.split(/\n|(?<=[.!?])\s+/);
        }
        // For regular pages, split on sentence endings
        return text.split(/(?<=[.!?])\s+/);
    }

    // Function to check if content contains any of the topics
    function containsTopic(content, topics) {
        return topics.some(topic => {
            // Create a regex that matches the whole word, case insensitive
            const regex = new RegExp(`\\b${topic}\\b`, 'i');
            return regex.test(content);
        });
    }

    // Function to process a text node
    function processTextNode(node) {
        try {
            const text = node.textContent;
            const contentPieces = splitIntoContent(text);
            
            // If no content contains topics, return
            if (!contentPieces.some(piece => containsTopic(piece, topics))) {
                return;
            }

            // Create a document fragment to hold the processed content
            const fragment = document.createDocumentFragment();
            
            contentPieces.forEach(piece => {
                if (containsTopic(piece, topics)) {
                    // For Google search results, use a different approach
                    if (window.location.hostname.includes('google.com')) {
                        const span = document.createElement('span');
                        span.className = 'cognitive-highlight';
                        span.textContent = piece.trim() + ' ';
                        
                        // Add click handler
                        span.addEventListener('click', function(event) {
                            event.stopPropagation();
                            showExplanation(piece.trim(), topics);
                        });
                        
                        // Insert the span after the original text
                        const textNode = document.createTextNode(piece.trim() + ' ');
                        fragment.appendChild(textNode);
                        fragment.appendChild(span);
                    } else {
                        // Regular highlighting for other pages
                        const span = document.createElement('span');
                        span.className = 'cognitive-highlight';
                        span.textContent = piece.trim() + ' ';
                        
                        // Add click handler
                        span.addEventListener('click', function(event) {
                            event.stopPropagation();
                            showExplanation(piece.trim(), topics);
                        });
                        
                        fragment.appendChild(span);
                    }
                } else {
                    // Add regular text for other content
                    const textNode = document.createTextNode(piece.trim() + ' ');
                    fragment.appendChild(textNode);
                }
            });

            // Replace the original node with the processed content
            if (node.parentNode) {
                node.parentNode.replaceChild(fragment, node);
            }
        } catch (error) {
            console.error('Error processing text node:', error);
            // Continue processing other nodes even if one fails
        }
    }

    // Function to walk through the DOM
    function walkDOM(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walkDOM(node, func);
            node = node.nextSibling;
        }
    }

    // Process all text nodes in the document
    walkDOM(document.body, node => {
        if (node.nodeType === Node.TEXT_NODE && 
            node.parentNode && 
            !node.parentNode.classList.contains('cognitive-highlight') &&
            node.textContent.trim().length > 0) {
            processTextNode(node);
        }
    });
}

// Function to add a suggestion overlay
function addSuggestionOverlay(suggestions) {
    // Remove existing overlay if any
    const existingOverlay = document.getElementById('cognitive-suggestions');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'cognitive-suggestions';
    overlay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        font-family: Arial, sans-serif;
        border: 1px solid #e0e0e0;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Related Content';
    title.style.cssText = `
        margin: 0 0 10px 0;
        color: #2196F3;
        font-size: 16px;
    `;
    overlay.appendChild(title);

    const list = document.createElement('ul');
    list.style.cssText = `
        margin: 0;
        padding: 0;
        list-style: none;
    `;

    suggestions.forEach(suggestion => {
        const item = document.createElement('li');
        item.style.margin = '8px 0';
        
        const link = document.createElement('a');
        link.href = suggestion.url;
        link.textContent = suggestion.title || suggestion.url;
        link.style.cssText = `
            color: #1976D2;
            text-decoration: none;
            display: block;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.2s;
        `;
        
        link.addEventListener('mouseover', () => {
            link.style.backgroundColor = '#f5f5f5';
        });
        
        link.addEventListener('mouseout', () => {
            link.style.backgroundColor = 'transparent';
        });
        
        item.appendChild(link);
        list.appendChild(item);
    });

    overlay.appendChild(list);
    document.body.appendChild(overlay);
}

// Function to send page content to background script
function sendPageContent() {
    try {
        const pageContent = {
            title: document.title,
            text: document.body.innerText,
            url: window.location.href
        };
        
        chrome.runtime.sendMessage({
            type: 'pageLoaded',
            content: pageContent
        }).catch(error => {
            if (error.message.includes('Extension context invalidated')) {
                // Extension was reloaded, wait and retry
                setTimeout(sendPageContent, 1000);
            }
        });
    } catch (error) {
        if (error.message.includes('Extension context invalidated')) {
            // Extension was reloaded, wait and retry
            setTimeout(sendPageContent, 1000);
        }
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        if (request.type === 'highlight') {
            highlightSentences(request.content);
            sendResponse({ status: 'success' });
        } else if (request.type === 'suggest') {
            addSuggestionOverlay(request.suggestions);
            sendResponse({ status: 'success' });
        }
    } catch (error) {
        if (error.message.includes('Extension context invalidated')) {
            // Extension was reloaded, wait and retry
            setTimeout(() => {
                chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                    if (request.type === 'highlight') {
                        highlightSentences(request.content);
                        sendResponse({ status: 'success' });
                    } else if (request.type === 'suggest') {
                        addSuggestionOverlay(request.suggestions);
                        sendResponse({ status: 'success' });
                    }
                });
            }, 1000);
        }
    }
});

// Send page content to background script when page loads
window.addEventListener('load', sendPageContent);

// Handle extension reloads
chrome.runtime.onConnect.addListener(port => {
    port.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
            // Extension was reloaded, wait and retry
            setTimeout(sendPageContent, 1000);
        }
    });
}); 