from flask import Flask, request, jsonify, send_file
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from src.generator import generate_html, generate_pdf
from pathlib import Path
import tempfile
import os

app = Flask(__name__)

# Set up rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/generate', methods=['POST'])
@limiter.limit("10 per minute")
def generate_endpoint():
    data = request.json
    if not data or 'content' not in data or 'transpose' not in data or 'type' not in data:
        return jsonify({"error": "Invalid request. 'content', 'transpose', and 'type' are required."}), 400

    chord_pro_content = data['content']
    transpose = data['transpose']
    generate_type = data['type']

    if generate_type == 'html':
        result = generate_html(chord_pro_content, transpose)
        return jsonify(result)
    elif generate_type == 'pdf':
        with generate_pdf(chord_pro_content, transpose) as result:
            return send_file(result['pdf'], mimetype='application/pdf', as_attachment=True, download_name="sheet.pdf")
    else:
        return jsonify({"error": "Invalid 'type'. Must be 'html' or 'pdf'."}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    app.run(host='0.0.0.0', port=port)
