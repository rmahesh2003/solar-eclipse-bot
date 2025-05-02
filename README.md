# Solar Eclipse Tracker and Simulator

A comprehensive web application for tracking and simulating solar eclipses, built with Angular, Node.js, MongoDB, and Python.

## Features

- Interactive map for location selection
- Real-time eclipse phase calculations
- 3D simulation of eclipse events
- Audio notifications for eclipse phases
- User preferences and saved locations
- Responsive design for multiple devices

## Tech Stack

- **Frontend**: Angular 15+ with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Computation Service**: Python with Flask
- **Containerization**: Docker and Docker Compose
- **3D Visualization**: Three.js
- **Maps**: Leaflet.js

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.9+
- MongoDB 6.0+

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solar-eclipse-tracker.git
cd solar-eclipse-tracker
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://mongodb:27017/eclipse-tracker
NODE_ENV=development
TTS_API_KEY=your_ibm_watson_api_key
TTS_URL=your_ibm_watson_service_url
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Python Service: http://localhost:5000

## Development

### Frontend Development
```bash
cd frontend
npm install
ng serve
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Python Service Development
```bash
cd python-service
pip install -r requirements.txt
python app.py
```

## Project Structure

```
solar-eclipse-tracker/
├── frontend/              # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── components/
│   │   │   │   │   ├── components/
│   │   │   │   │   └── models/
│   │   │   │   └── assets/
│   ├── backend/              # Node.js backend application
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── python-service/       # Python computation service
│       ├── calculations/
│       └── api/
└── docker-compose.yml    # Docker Compose configuration
```

## API Documentation

### Backend API Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/eclipse/calculate` - Calculate eclipse data for a location
- `GET /api/eclipse/upcoming` - Get upcoming eclipses
- `POST /api/simulation/start` - Start eclipse simulation
- `POST /api/simulation/stop` - Stop eclipse simulation

### Python Service Endpoints

- `POST /api/calculate-eclipse` - Calculate detailed eclipse data
- `GET /api/eclipse-path` - Get eclipse path data
- `POST /api/simulation-data` - Get simulation data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NASA for eclipse data and calculations
- Skyfield for astronomical calculations
- Three.js for 3D visualization
- Leaflet for map visualization 