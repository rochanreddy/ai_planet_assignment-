# AI Planet Assignment - No-Code Workflow Builder

A full-stack application that allows users to build and execute AI workflows through a visual interface, integrating with Google's Gemini API for intelligent responses.

## 🚀 Features

- **Visual Workflow Builder**: Drag-and-drop interface to create AI workflows
- **Real-time Chat Interface**: Interactive chat with AI responses
- **Multiple AI Providers**: Support for Google Gemini API (with OpenAI as backup)
- **Component-based Architecture**: Modular workflow components
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Flow** for workflow visualization
- **Lucide React** for icons

### Backend
- **FastAPI** (Python)
- **Google Gemini API** for AI responses
- **SQLAlchemy** for database operations (future)
- **Pydantic** for data validation
- **Uvicorn** for ASGI server

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/rochanreddy/ai_planet_assignment-.git
cd ai_planet_assignment-
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp env_template.txt .env

# Edit .env file and add your Gemini API key
# GEMINI_API_KEY=your_actual_gemini_api_key_here

# Start the backend server
python main.py
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup
```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI API Key (backup)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Database URL (for future features)
DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
```

### Getting API Keys

1. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

2. **OpenAI API Key** (optional):
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key to your `.env` file

## 🎯 Usage

### Building Workflows

1. **Open the Workflow Builder**: Click on the workflow builder interface
2. **Add Components**: Drag components from the sidebar to the canvas
3. **Configure Components**: Click on components to configure their settings
4. **Connect Components**: Draw connections between components
5. **Validate Workflow**: Click "Validate Workflow" to check for errors

### Chat Interface

1. **Open Chat**: Click the chat icon in the workflow builder
2. **Send Messages**: Type your questions or requests
3. **Get AI Responses**: Receive intelligent responses from Google Gemini

### Available Components

- **User Query**: Input component for user questions
- **Knowledge Base**: Document processing and storage
- **LLM Engine**: AI model integration (Gemini/OpenAI)
- **Output**: Response formatting and display

## 🔌 API Endpoints

### Backend API

- `GET /` - Health check
- `GET /test` - Test endpoint
- `POST /query` - Send queries to AI
- `POST /upload` - Upload documents (future)

### Request Format

```json
{
  "user_query": "Your question here"
}
```

### Response Format

```json
{
  "response": "AI generated response"
}
```

## 🏗️ Project Structure

```
project/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── routers/             # API route handlers
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── components/          # React components
│   ├── types/               # TypeScript type definitions
│   └── main.tsx            # React entry point
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check if port 8000 is available
   - Verify your `.env` file exists and has the correct API key
   - Ensure all Python dependencies are installed

2. **Frontend can't connect to backend**:
   - Verify backend is running on `http://localhost:8000`
   - Check browser console for CORS errors
   - Ensure proxy configuration in `vite.config.ts` is correct

3. **API errors**:
   - Verify your Gemini API key is valid
   - Check API rate limits
   - Ensure proper request format

### Debug Mode

To enable debug logging, set the environment variable:
```bash
export DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI capabilities
- [React Flow](https://reactflow.dev/) for workflow visualization
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/rochanreddy/ai_planet_assignment-/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Happy Building! 🚀** 