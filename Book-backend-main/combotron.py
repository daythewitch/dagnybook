from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import requests
import os
import uuid

app = Flask(__name__)
CORS(app)

@app.route('/process_files', methods=['POST'])
def process_files():
    url = request.json.get('url')
    
    if not url:
        return jsonify({"error": "URL not provided"}), 400

    # Download the image
    response = requests.get(url)
    file_name = f"{uuid.uuid4()}.jpg"
    file_path = os.path.join(os.getcwd(), file_name)
    with open(file_path, 'wb') as file:
        file.write(response.content)

    # Run explosives.py
    subprocess.run(['python3', 'explosives.py', file_path])
    # Run explosivedetector.py
    subprocess.run(['python3', 'explosivedetector.py'])

    # Run duplicateexploder.py
    subprocess.run(['python3', 'duplicateexploder.py'])

    try:
        # Read and return the content of response.txt
        with open('openai_response.txt', 'r') as file:
            response_content = file.read()
        # Assuming response.txt contains valid JSON
        response_data = eval(response_content)  # Or use json.loads
        return jsonify(response_data)
    except FileNotFoundError:
        return jsonify({"error": "openai_response.txt not found"}), 500
    except SyntaxError:
        return jsonify({"error": "Invalid format in openai_response.txt"}), 500

if __name__ == '__main__':
    app.run(debug=True)
