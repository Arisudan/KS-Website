import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import shutil

app = Flask(__name__, static_folder='.')
CORS(app)

app.secret_key = 'ks-drives-secret-key-change-this-in-prod'

# Configuration
UPLOAD_FOLDER = 'assets/uploads'
DATA_FILE = 'data/content.json'
MESSAGES_FILE = 'data/messages.json'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}
ADMIN_PASSWORD = 'admin'

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

from flask import session

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if data and data.get('password') == ADMIN_PASSWORD:
        session['logged_in'] = True
        return jsonify({"success": True})
    return jsonify({"error": "Invalid password"}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    return jsonify({"success": True})

@app.route('/api/auth-status', methods=['GET'])
def auth_status():
    return jsonify({"authenticated": session.get('logged_in', False)})

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

@app.route('/api/content', methods=['GET'])
def get_content():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return jsonify(json.load(f))
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({}), 404

@app.route('/api/content', methods=['POST'])
def save_content():
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        
        return jsonify({"message": "Content saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add a unique prefix to avoid overwriting or browser caching issues
        import time
        filename = f"{int(time.time())}_{filename}"
        
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Return the relative path for the frontend to use
        # Force forward slashes for web usage
        web_path = f"{UPLOAD_FOLDER}/{filename}".replace("\\", "/")
        return jsonify({"url": web_path})
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.json
        if not data or not all(k in data for k in ('name', 'email', 'message')):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Add timestamp
        import time
        from datetime import datetime
        data['timestamp'] = datetime.now().isoformat()
        data['id'] = int(time.time() * 1000)
        
        # Load existing messages
        messages = []
        if os.path.exists(MESSAGES_FILE):
            with open(MESSAGES_FILE, 'r') as f:
                try:
                    messages = json.load(f)
                except:
                    messages = []
        
        messages.append(data)
        
        # Save back
        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages, f, indent=4)
            
        return jsonify({"success": True, "message": "Message received"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401
    
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, 'r') as f:
                return jsonify(json.load(f))
        except:
            return jsonify([])
    return jsonify([])

@app.route('/api/messages/<int:msg_id>', methods=['DELETE'])
def delete_message(msg_id):
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401
    
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, 'r') as f:
                messages = json.load(f)
            
            # Filter out the message with the given ID
            new_messages = [m for m in messages if m.get('id') != msg_id]
            
            with open(MESSAGES_FILE, 'w') as f:
                json.dump(new_messages, f, indent=4)
                
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    print("Starting server on http://localhost:8092")
    app.run(port=8092, debug=True)
