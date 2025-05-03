class DecisionMaking:
    def __init__(self, memory):
        self.memory = memory
        self.current_context = None
        self.decision_threshold = 0.7

    def update_context(self, context):
        """Update the current context for decision making"""
        self.current_context = context

    def evaluate_relevance(self, content):
        """Evaluate the relevance of content based on user preferences"""
        preferences = self.memory.get_preferences()
        relevance_score = 0.0
        
        # Calculate relevance based on interests
        for interest in preferences.get('interests', []):
            if interest.lower() in content.lower():
                relevance_score += 0.3

        # Calculate relevance based on topics
        for topic in preferences.get('topics', []):
            if topic.lower() in content.lower():
                relevance_score += 0.3

        # Consider location if relevant
        if preferences.get('location') and preferences['location'].lower() in content.lower():
            relevance_score += 0.2

        return min(relevance_score, 1.0)

    def make_decision(self, action_options):
        """Make a decision based on current context and user preferences"""
        if not self.current_context:
            return None

        # Evaluate each action option
        scored_actions = []
        for action in action_options:
            score = self.evaluate_relevance(action['content'])
            scored_actions.append({
                'action': action,
                'score': score
            })

        # Sort by score and return the best action
        scored_actions.sort(key=lambda x: x['score'], reverse=True)
        best_action = scored_actions[0] if scored_actions else None

        if best_action and best_action['score'] >= self.decision_threshold:
            return best_action['action']
        return None

    def adjust_decision_threshold(self, new_threshold):
        """Adjust the decision threshold based on user feedback"""
        self.decision_threshold = max(0.0, min(1.0, new_threshold)) 