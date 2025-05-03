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

The extension is built with four cognitive layers:

1. **Perception**: Gathers and analyzes page content
2. **Memory**: Stores user preferences and browsing history
3. **Decision-Making**: Evaluates content and decides on actions
4. **Action**: Executes decisions and interacts with the browser

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