# Gemini Context Chat 🤖

An interactive terminal-based chat interface for Google's Gemini AI that allows you to have context-aware conversations. Load your own dataset and chat with Gemini about it!

## Features ✨

-  📚 Context-aware conversations with Gemini AI
-  💾 Save chat history to files
-  🎨 Beautiful terminal interface with colored output
-  📝 Command system for easy interaction
-  🔄 Automatic chat history management
-  ⚙️ Configurable settings
-  🔒 Secure API key handling through environment variables

## Installation 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gemini-context-chat.git
cd gemini-context-chat
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
CONTEXT_FILE=path/to/your/data.txt
```

## Usage 💡

1. Prepare your context file (data.txt) with the information you want to chat about

2. Start the chat:

```bash
npm start
```

### Available Commands 🛠️

-  `/save` - Save chat history to a file
-  `/clear` - Clear chat history
-  `/context` - Show current loaded context
-  `/help` - Show available commands
-  `/exit` - Exit the chat

## Configuration ⚙️

Edit `config.js` to customize:

-  Model settings (temperature, max tokens)
-  Chat history length
-  UI elements
-  Default file paths

## Example Usage 📝

```bash
$ npm start

⚙️ Loading context from file...
🤖 Context loaded! Here's a summary of the provided information...

🧑 What are the key points in the loaded context?
🤖 Based on the context, here are the main points...

🧑 /save
⚙️ Chat saved to chat_log_2024-12-05T12:34:56.789Z.txt

🧑 /exit
⚙️ Chat session ended. Duration: 145 seconds
⚙️ Messages exchanged: 12
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License 📄

MIT License - feel free to use this project however you'd like!
