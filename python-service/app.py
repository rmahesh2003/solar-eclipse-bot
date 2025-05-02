from flask import Flask, request, jsonify
from flask_cors import CORS
from skyfield.api import load, wgs84
from datetime import datetime, timedelta
import numpy as np
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load ephemeris data
ts = load.timescale()
ephemeris = load('de421.bsp')
earth, sun, moon = ephemeris['earth'], ephemeris['sun'], ephemeris['moon']

@app.route('/api/calculate-eclipse', methods=['POST'])
def calculate_eclipse():
    try:
        data = request.json
        latitude = float(data['latitude'])
        longitude = float(data['longitude'])
        date = datetime.strptime(data['date'], '%Y-%m-%d')
        
        location = earth + wgs84.latlon(latitude, longitude)
        
        # Calculate eclipse circumstances
        t0 = ts.utc(date.year, date.month, date.day)
        t1 = ts.utc(date.year, date.month, date.day + 1)
        
        # Calculate positions at minute intervals
        times = ts.utc(date.year, date.month, date.day, 
                      range(0, 24*60, 1))
        
        sun_position = sun.at(times).observe(location)
        moon_position = moon.at(times).observe(location)
        
        # Calculate angular separation
        separation = sun_position.separation_from(moon_position)
        
        # Find eclipse phases
        phases = find_eclipse_phases(times, separation)
        
        return jsonify({
            'success': True,
            'phases': phases,
            'separation': separation.degrees.tolist()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

def find_eclipse_phases(times, separation):
    # Find minimum separation (maximum eclipse)
    min_sep_idx = np.argmin(separation.degrees)
    max_eclipse = {
        'time': times[min_sep_idx].utc_datetime().isoformat(),
        'separation': float(separation.degrees[min_sep_idx])
    }
    
    # Find first and last contacts (when separation equals sun+moon angular radii)
    sun_radius = 0.2666  # degrees
    moon_radius = 0.2666  # degrees
    contact_radius = sun_radius + moon_radius
    
    contacts = np.where(separation.degrees <= contact_radius)[0]
    if len(contacts) > 0:
        first_contact = times[contacts[0]].utc_datetime().isoformat()
        last_contact = times[contacts[-1]].utc_datetime().isoformat()
    else:
        first_contact = None
        last_contact = None
    
    return {
        'first_contact': first_contact,
        'maximum': max_eclipse,
        'last_contact': last_contact
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 