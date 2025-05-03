class Perception:
    def __init__(self):
        self.current_url = None
        self.page_content = None
        self.user_preferences = None

    def update_page_info(self, url, content):
        """Update the current page information"""
        self.current_url = url
        self.page_content = content

    def get_page_context(self):
        """Get the current page context"""
        return {
            'url': self.current_url,
            'content': self.page_content
        }

    def set_user_preferences(self, preferences):
        """Set user preferences for personalized perception"""
        self.user_preferences = preferences

    def analyze_page(self):
        """Analyze the current page based on user preferences"""
        if not self.page_content or not self.user_preferences:
            return None

        # Analyze page content based on user preferences
        relevant_content = {
            'interests': [],
            'topics': [],
            'suggestions': []
        }

        # Example analysis based on user preferences
        for interest in self.user_preferences.get('interests', []):
            if interest.lower() in self.page_content.lower():
                relevant_content['interests'].append(interest)

        for topic in self.user_preferences.get('topics', []):
            if topic.lower() in self.page_content.lower():
                relevant_content['topics'].append(topic)

        return relevant_content 