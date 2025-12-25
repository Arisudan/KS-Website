import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import shutil

app = Flask(__name__, static_folder='.')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'assets/uploads'
DATA_FILE = 'data/content.json'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

if __name__ == '__main__':
    print("Starting server on http://localhost:8092")
    app.run(port=8092, debug=True)
