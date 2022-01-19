from flask import Flask, jsonify
from picamera import PiCamera

app = Flask(__name__)

CAMERA_MAP = {
    "ov5647": "V1 module",
    "imx219": "V2 module"
}

@app.route('/cameras')
def get_cameras():

    camera = PiCamera()
    module = camera.revision
    camera.close()

    return jsonify({"camera": CAMERA_MAP[module]})