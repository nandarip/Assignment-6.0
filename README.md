# Cognitive Chrome Agent

A Chrome extension that implements a cognitive agent with four layers: Perception, Memory, Decision-Making, and Action. The agent learns from user preferences and provides personalized browsing assistance.

## Features

- Personalized content highlighting based on user interests
- Smart content suggestions
- Automatic content saving for later viewing
- Customizable page view based on preferences
- Learning from user behavior and preferences

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter your preferences:
   - Location
   - Interests (comma-separated)
   - Favorite topics (comma-separated)
   - Favorite websites (comma-separated)
3. Click "Save Preferences"
4. Browse normally - the agent will automatically:
   - Highlight relevant content
   - Suggest related articles
   - Save interesting content
   - Customize your view based on preferences

## Architecture

The extension is built with four cognitive layers that work together to create an intelligent browsing assistant:

### 1. Perception Layer (`perception.py`)
This layer acts as the extension's "senses", analyzing and understanding web content:
- Scans webpage DOM structure and content
- Extracts key information like:
  - Main article text and headlines
  - Important keywords and topics
  - User interaction patterns (clicks, scrolls, time spent)
- Uses natural language processing to understand content context
- Identifies content relevance to user interests

### 2. Memory Layer (`memory.py`)
Functions as the extension's storage and learning system:
- Maintains persistent storage of:
  - User preferences and interests
  - Browsing history with metadata
  - Previously identified relevant content
- Implements learning mechanisms:
  - Updates interest weights based on user behavior
  - Builds knowledge graphs of related topics
  - Tracks content engagement patterns
- Provides quick access to historical data for decision making

### 3. Decision-Making Layer (`decision_making.py`)
Acts as the "brain" of the extension, processing information and making choices:
- Analyzes input from Perception and Memory layers
- Makes intelligent decisions about:
  - Which content to highlight
  - When to suggest related articles
  - What content to save for later
  - How to customize page layout
- Uses machine learning algorithms to:
  - Score content relevance
  - Predict user interests
  - Optimize timing of suggestions
  - Balance user engagement and interruption

### 4. Action Layer (`action.py`)
Executes the decisions made by implementing changes in the browser:
- Modifies webpage appearance:
  - Highlights relevant text
  - Adds visual indicators for important content
  - Adjusts layout based on preferences
- Manages user interactions:
  - Shows notification popups
  - Handles content saving
  - Implements custom navigation features
- Provides feedback to other layers about:
  - User responses to actions
  - Success rates of suggestions
  - Performance metrics

## Development

The extension consists of the following files:

- `manifest.json`: Extension configuration
- `popup.html` & `popup.js`: User interface for preferences
- `background.js`: Background processes and message handling
- `perception.py`: Content analysis module
- `memory.py`: Data storage and retrieval module
- `decision_making.py`: Action decision module
- `action.py`: Browser interaction module
- `main.py`: Main agent integration

## Requirements

- Chrome browser
- Python 3.x (for the cognitive agent modules)
- Chrome extension development tools

## License

MIT License 