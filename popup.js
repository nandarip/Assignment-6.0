document.addEventListener('DOMContentLoaded', function() {
    // Load saved preferences
    chrome.storage.sync.get(['userPreferences'], function(result) {
        if (result.userPreferences) {
            document.getElementById('location').value = result.userPreferences.location || '';
            document.getElementById('interests').value = result.userPreferences.interests.join(', ');
            document.getElementById('topics').value = result.userPreferences.topics.join(', ');
            document.getElementById('websites').value = result.userPreferences.favorite_websites.join(', ');
        }
    });

    // Save preferences button click handler
    document.getElementById('savePreferences').addEventListener('click', function() {
        const preferences = {
            location: document.getElementById('location').value.trim(),
            interests: document.getElementById('interests').value.split(',').map(item => item.trim()),
            topics: document.getElementById('topics').value.split(',').map(item => item.trim()),
            favorite_websites: document.getElementById('websites').value.split(',').map(item => item.trim())
        };

        // Save to Chrome storage
        chrome.storage.sync.set({ userPreferences: preferences }, function() {
            const status = document.getElementById('status');
            status.textContent = 'Preferences saved successfully!';
            status.className = 'success';
            
            // Notify background script
            chrome.runtime.sendMessage({
                type: 'updatePreferences',
                preferences: preferences
            });
        });
    });

    // Close explanation button handler
    document.querySelector('.close-explanation').addEventListener('click', function() {
        document.getElementById('explanation-section').style.display = 'none';
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === 'showExplanation') {
            const explanationSection = document.getElementById('explanation-section');
            const explanationContent = document.getElementById('explanation-content');
            
            explanationContent.textContent = request.explanation;
            explanationSection.style.display = 'block';
            
            // Scroll to the explanation section
            explanationSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}); 