from datetime import datetime
from perception import Perception
from memory import Memory
from decision_making import DecisionMaking
from action import Action

class CognitiveAgent:
    def __init__(self):
        self.memory = Memory()
        self.perception = Perception()
        self.decision_making = DecisionMaking(self.memory)
        self.action = Action(self.memory)
        self.is_initialized = False

    def initialize(self, user_preferences):
        """Initialize the agent with user preferences"""
        self.memory.store_preferences(user_preferences)
        self.perception.set_user_preferences(user_preferences)
        self.is_initialized = True
        return True

    def process_page(self, url, content):
        """Process a new page through the cognitive layers"""
        if not self.is_initialized:
            return {"error": "Agent not initialized with user preferences"}

        # Perception layer
        self.perception.update_page_info(url, content)
        page_context = self.perception.get_page_context()
        analyzed_content = self.perception.analyze_page()

        # Update decision-making context
        self.decision_making.update_context({
            'page_context': page_context,
            'analyzed_content': analyzed_content
        })

        # Generate possible actions
        action_options = [
            {
                'type': 'highlight_content',
                'content': analyzed_content['interests']
            },
            {
                'type': 'suggest_related',
                'content': page_context
            },
            {
                'type': 'save_for_later',
                'content': {
                    'url': url,
                    'relevance_score': self.decision_making.evaluate_relevance(content)
                }
            }
        ]

        # Decision-making layer
        chosen_action = self.decision_making.make_decision(action_options)

        # Action layer
        if chosen_action:
            result = self.action.execute(chosen_action['type'], chosen_action['content'])
            return result

        return {"status": "no_action_taken"}

    def get_user_preferences(self):
        """Get current user preferences"""
        return self.memory.get_preferences()

    def update_preferences(self, new_preferences):
        """Update user preferences"""
        return self.initialize(new_preferences)

# Example usage
if __name__ == "__main__":
    agent = CognitiveAgent()
    
    # Example user preferences
    user_preferences = {
        'location': 'New York',
        'interests': ['technology', 'science', 'art'],
        'topics': ['AI', 'machine learning', 'neural networks'],
        'favorite_websites': ['github.com', 'medium.com']
    }
    
    # Initialize the agent
    agent.initialize(user_preferences)
    
    # Example page processing
    example_url = "https://example.com/ai-article"
    example_content = "This article discusses the latest developments in artificial intelligence and machine learning..."
    
    result = agent.process_page(example_url, example_content)
    print(result) 