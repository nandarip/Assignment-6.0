class Memory:
    def __init__(self):
        self.user_preferences = {
            'location': None,
            'interests': [],
            'topics': [],
            'favorite_websites': []
        }
        self.browsing_history = []
        self.learned_patterns = {}

    def store_preferences(self, preferences):
        """Store user preferences"""
        self.user_preferences.update(preferences)
        return self.user_preferences

    def get_preferences(self):
        """Retrieve user preferences"""
        return self.user_preferences

    def add_to_history(self, url, timestamp, relevance_score):
        """Add a page to browsing history with relevance score"""
        self.browsing_history.append({
            'url': url,
            'timestamp': timestamp,
            'relevance_score': relevance_score
        })

    def get_relevant_history(self, topic):
        """Get browsing history relevant to a specific topic"""
        return [entry for entry in self.browsing_history 
                if entry['relevance_score'] > 0.5]

    def update_learned_patterns(self, pattern, weight):
        """Update learned patterns based on user behavior"""
        self.learned_patterns[pattern] = weight

    def get_learned_patterns(self):
        """Retrieve learned patterns"""
        return self.learned_patterns 