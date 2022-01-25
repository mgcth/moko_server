import sys
import base64
import asyncio
from io import BytesIO
from json import dumps, dump, loads
from sanic import Sanic
from sanic import response
from sanic_cors import CORS, cross_origin
from websockets.exceptions import ConnectionClosed
from sanic.response import json

from camera import Camera


app = Sanic(__name__)

app.config.WEBSOCKET_MAX_SIZE = 2 ** 20  # 20
app.config.WEBSOCKET_MAX_QUEUE = 32  # 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16 # 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16 # 16

CORS(app)

CAMERA_LIST_FILE = "../../camera_list.json"

@app.route("/camera-config")
async def camera(request):
    """
    """

    with Camera() as camera:
        response = json({
            "name": None,
            "module": camera.module,
            "modes": camera.modes,
            "save_folder": None
            })
        return response


@app.route("/read-cameras")
async def camera(request):
    """
    """

    with open(CAMERA_LIST_FILE, "r") as file:
        response = json(loads(file.read()))
        return response


@app.route("/save-camera", methods=["POST"])
async def camera(request):
    """
    """

    client_data = request.json

    data = {}
    with open(CAMERA_LIST_FILE, "r") as file:
        try:
            data = loads(file.read())
            print(data)
        except Exception as e:
            print(e)
            data = {}

    with open(CAMERA_LIST_FILE, "w", encoding="utf-8") as file:
        if client_data is not None:
            data[client_data["name"]] = client_data
            dump(data, file)

    return json({"OK": True})


@app.websocket("/stream")
async def stream(request, ws):
    """
    """

    camera_name = await ws.recv()

    data = {}
    with open(CAMERA_LIST_FILE, "r") as file:
        f = loads(file.read())
        data = f[camera_name]

    resolution_id = data["mode"][0]

    camera = Camera(camera_name, resolution_id)
    try:
        while True:
            await asyncio.sleep(0.01)
            frame = next(camera.frames())
            #print(sys.getsizeof(frame))
            await ws.send(
               f"data:image/jpeg;base64, {base64.b64encode(frame).decode()}"
            )
    except:
        print("Closing connection.")
    finally:
        camera.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
