class Action:
    def __init__(self, memory):
        self.memory = memory
        self.available_actions = {
            'highlight_content': self.highlight_content,
            'suggest_related': self.suggest_related,
            'save_for_later': self.save_for_later,
            'customize_view': self.customize_view
        }

    def execute(self, action_type, action_data):
        """Execute the specified action"""
        if action_type in self.available_actions:
            return self.available_actions[action_type](action_data)
        return False

    def highlight_content(self, content):
        """Highlight relevant content on the page"""
        # Implementation would interact with the browser's DOM
        return {
            'type': 'highlight',
            'content': content,
            'status': 'success'
        }

    def suggest_related(self, context):
        """Suggest related content based on user preferences"""
        preferences = self.memory.get_preferences()
        relevant_history = self.memory.get_relevant_history(context)
        
        return {
            'type': 'suggestion',
            'suggestions': relevant_history,
            'based_on': preferences
        }

    def save_for_later(self, content):
        """Save content for later viewing"""
        timestamp = datetime.now().isoformat()
        self.memory.add_to_history(content['url'], timestamp, content['relevance_score'])
        
        return {
            'type': 'save',
            'content': content,
            'timestamp': timestamp
        }

    def customize_view(self, preferences):
        """Customize the page view based on user preferences"""
        return {
            'type': 'customize',
            'preferences': preferences,
            'changes': {
                'font_size': preferences.get('font_size', 'medium'),
                'theme': preferences.get('theme', 'light'),
                'layout': preferences.get('layout', 'default')
            }
        } 