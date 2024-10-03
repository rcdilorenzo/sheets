import json
import os
from pathlib import Path

from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from src.generator import generate_html, generate_pdf

app = Flask(__name__, static_folder="../web/out", static_url_path="")
CORS(app)

# Set up rate limiting
limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])


@app.route("/api/config", methods=["GET"])
@limiter.limit("10 per minute")
def config_endpoint():
    config_path = Path(__file__).parents[1] / "data" / "chordpro.json"

    if request.method == "GET":
        with open(config_path, "r") as config_file:
            return jsonify(json.load(config_file))


@app.route("/api/generate", methods=["POST"])
@limiter.limit("10 per minute")
def generate_endpoint():
    data = request.json
    if not data or "content" not in data or "transpose" not in data or "type" not in data:
        return jsonify({"error": "Invalid request. 'content', 'transpose', and 'type' are required."}), 400

    chord_pro_content = data["content"]
    transpose = data["transpose"]
    generate_type = data["type"]
    custom_config = data.get("config")

    if generate_type == "html":
        result = generate_html(chord_pro_content, transpose, custom_config)
        return jsonify(result)
    elif generate_type == "pdf":
        with generate_pdf(chord_pro_content, transpose, custom_config) as result:
            return send_file(result["pdf"], mimetype="application/pdf", as_attachment=True, download_name="sheet.pdf")
    else:
        return jsonify({"error": "Invalid 'type'. Must be 'html' or 'pdf'."}), 400


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8081))
    app.run(host="0.0.0.0", port=port)
