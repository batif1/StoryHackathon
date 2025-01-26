#Code from flaks official site
from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def root_handler():
    return "200 OK"

UPLOAD_PATH = "./upload"

# Endpoint for upload video
@app.route("/upload", methods=["POST"])
def upload_video():
    print(request)
    file = request.files['file']
    file.save(UPLOAD_PATH)
    return "200 OK"
# Endpoint for getting a video which is clipped
