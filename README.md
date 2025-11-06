# Help Buddy App

A task management and mood tracking application with Google Calendar integration.

## Architecture

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React Native (Expo)
- **Features**: 
  - Task management (CRUD operations)
  - Mood tracking with recommendations
  - Google Calendar integration
  - Journal entries
  - Badge system
  - Progress tracking

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```

4. Start the backend server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The server will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API base URL (if different from localhost):
Edit `frontend/app/services/api.js` and update:
```javascript
const API_BASE_URL = 'http://your-backend-url:4000';
```

4. Start the Expo development server:
```bash
npm start
```

Then choose to run on iOS, Android, or Web.

### Important Notes

- **User ID**: Currently using a temporary user ID (`TEMP_USER_ID`) until authentication is implemented
- **Google Calendar**: Requires proper OAuth setup in Google Cloud Console
- **Database**: Ensure MongoDB is running and accessible

## API Endpoints

### Tasks
- `GET /tasks?userId=<userId>` - Get all tasks for a user
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Journal Entries
- `GET /journalEntry?userId=<userId>` - Get all journal entries
- `POST /journalEntry` - Create a new entry
- `PATCH /journalEntry/:id` - Update an entry
- `DELETE /journalEntry/:id` - Delete an entry

### Emotions/Recommendations
- `GET /emotions` - Get all emotion recommendations
- `GET /emotions/:mood` - Get recommendations by mood
- `PATCH /emotions/:id` - Update emotion data

### Favorites
- `GET /favorites?userId=<userId>` - Get favorites
- `POST /favorites` - Add favorite
- `DELETE /favorites/:id` - Remove favorite

### Google Calendar
- `POST /api/google/add-event` - Add event to Google Calendar

## Recent Changes

### Backend Fixes
- Fixed `journalEntryController.js`: corrected typos, proper route parameters, proper date handling
- Fixed `emotionRecomController.js`: corrected model name references
- Fixed `taskController.js`: corrected `Date.now()` call and error codes

### Frontend Integration
- Created `api.js` service layer for backend communication
- Integrated TaskContext with backend API (CRUD operations)
- Fixed Google Calendar integration to use backend API
- Fixed Account page badges display
- Updated TaskContext to load tasks from backend on mount
- Added loading states and error handling

## Development

### Key Files Structure

**Backend:**
- `server.js` - Main server file
- `config/db.js` - Database configuration
- `controllers/` - Request handlers
- `models/` - Mongoose schemas
- `routes/` - API routes

**Frontend:**
- `app/` - Main app directory
- `app/context/` - React contexts (TaskContext, MoodContext)
- `app/services/` - API services
- `app/hooks/` - Custom hooks
- `app/tabs/` - Tab screens (home, todo, journal, account)

## Todo
- [ ] Implement proper user authentication
- [ ] Add real-time synchronization
- [ ] Improve error handling and user feedback
- [ ] Add journal entry backend integration
- [ ] Configure API base URL via environment variables

## License

ISC

