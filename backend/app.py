import sys
import base64
import asyncio
from io import BytesIO
from json import dumps, loads
from sanic import Sanic
from sanic import response
from sanic.response import json
from sanic_jwt import exceptions
from sanic_jwt import initialize
from sanic_jwt.decorators import protected
from sanic_cors import CORS, cross_origin
from websockets.exceptions import ConnectionClosed

from camera import CameraManager, RaspberryPiCamera
from user import User

camera_manager = CameraManager([RaspberryPiCamera])


users = [User(1, "user", "pass")]

username_table = {u.username: u for u in users}
userid_table = {u.user_id: u for u in users}

async def authenticate(request, *args, **kwargs):
    """
    """
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if not username or not password:
        raise exceptions.AuthenticationFailed()

    user = username_table.get(username, None)
    if user is None:
        raise exceptions.AuthenticationFailed()

    if password != user.password:
        raise exceptions.AuthenticationFailed()

    return user


app = Sanic(__name__)
initialize(app, authenticate=authenticate)

app.config.WEBSOCKET_MAX_SIZE = 2 ** 20  # 20
app.config.WEBSOCKET_MAX_QUEUE = 32  # 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16 # 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16 # 16

CORS(app)

CAMERA_LIST_FILE = "../../camera_list.json"


@app.route("/get-camera-backend")
@protected()
async def get_camera_backend(request):
    """
    Get camera backend options endpoint.
    """
    camera_manager.scan()
    response = json(camera_manager.usable)
        
    return response

@app.route("/set-camera-backend", methods=["POST"])
@protected()
async def set_camera_backend(request):
    """
    Get camera backend options endpoint.
    """
    backend = request.json
    camera_manager.select(backend)
        
    return json(camera)

@app.route("/camera-config")
@protected()
async def camera_config(request):
    """
    Get camera configs endpoint.
    """
    empty = json({"models": ["None"], "modes": ["None"]})

    if camera_manager.selected == None:
        return empty

    with camera_manager.selected() as camera:
        response = json({
            "model": [camera.model],  # send an array, should support several types
            "modes": camera.modes,  # this should be set by camera.model
        })
        
        return response

@app.route("/read-camera")
@protected()
async def read_camera(request):
    """
    Read available cameras endpoint.
    """
    with open(CAMERA_LIST_FILE, "r") as file:  
        try:
            data = loads(file.read())
            response = json(data)
            return response
        except:
            return json({})


@app.route("/save-camera", methods=["POST"])
@protected()
async def save_camera(request):
    """
    Save camera (and write to cameras file) endpoint.
    """
    client_data = request.json

    with open(CAMERA_LIST_FILE, "r") as file:
        try:
            data = loads(file.read())
        except:
            data = {}

    with open(CAMERA_LIST_FILE, "w", encoding="utf-8") as file:
        if client_data is not None:
            data[client_data["name"]] = client_data
        
        file.write(dumps(data))

    return json({})


@app.route("/delete-camera", methods=["POST"])
@protected()
async def delete_camera(request):
    """
    Delete camera (and write to cameras file) endpoint.
    """
    client_data = request.json

    with open(CAMERA_LIST_FILE, "r") as file:
        try:
            data = loads(file.read())
        except:
            data = {}

    with open(CAMERA_LIST_FILE, "w", encoding="utf-8") as file:
        if client_data is not None and data != {}:
            data.pop(client_data)
        
            file.write(dumps(data))

    return json({})


@app.websocket("/stream")#@protected(query_string_set=True)
async def stream(request, ws):
    """
    Websocket camera stream endpoint.
    """
    camera_name = await ws.recv()

    data = {}
    with open(CAMERA_LIST_FILE, "r") as file:
        f = loads(file.read())
        data = f[camera_name]

    camera_manager.scan()
    camera_manager.select(data["backend"])

    resolution_id = data["mode"][0]
    rotation = data["rotation"]
    quality = data["quality"]

    camera = camera_manager.selected(camera_name, resolution_id, rotation, quality)

    camera_manager.start_recording(camera)
    camera.camera.wait_recording(5)
    # try:
    #     while True:
    #         await asyncio.sleep(0.01)

    #         start_recording()
    #         frame = next(camera.next_frame())
    #         #print(sys.getsizeof(frame))
    #         await ws.send(
    #            f"data:image/jpeg;base64, {base64.b64encode(frame).decode()}"
    #         )
    #         camera.save_frame(data["save_folder"])

    # except Exception as e:
    #     print(e)
    #     print("Closing connection.")
    # finally:
    #     camera.close()
    #     camera_manager.deselect()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
