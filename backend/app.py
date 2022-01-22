import sys
import base64
import asyncio
from io import BytesIO
from sanic import Sanic
from sanic import response
from websockets.exceptions import ConnectionClosed
from sanic.response import json
from picamera import PiCamera, PiCameraCircularIO

from camera_settings import CameraSettings

app = Sanic(__name__)

app.config.WEBSOCKET_MAX_SIZE = 2 ** 20  # 20
app.config.WEBSOCKET_MAX_QUEUE = 32  # 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16 # 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16 # 16

class Camera():
    """
    """

    def __init__(self, resolution=(1280, 720)):
        """
        """

        #self.module = None
        #self.mode = None

        self.settings = CameraSettings()
        self.camera_map = {
            "ov5647": "V1 module",
            "imx219": "V2 module"
        }
        self.camera = PiCamera(resolution=resolution,framerate=30)
        self.camera.rotation = 180

    def __del__(self):
        """
        """

        #try:
        self.camera.close()
        #except:
        #    pass  # avoid and fix, just testing

    def __enter__(self):
        """
        """

        return self

    def __exit__(self, type, value, traceback):
        """
        """

        self.close()

    def close(self):
        """
        """

        self.camera.close()

    @property
    def module(self):
        """
        """

        module = self.camera.revision
        model = self.settings.module.get(module, "none")

        return model

    @property
    def modes(self):
        """
        """

        modes = self.settings.modes.get(self.module, "none")

        return modes

    def frames(self):
        """
        """

        stream = BytesIO()
        for _ in self.camera.capture_continuous(stream, "jpeg", use_video_port=True, quality=20):
            stream.seek(0)
            yield stream.read()
            stream.truncate()
            stream.seek(0)


@app.route("/cameras")
async def camera(request):
    """
    """

    with Camera() as camera:
        response = json({
            "module": camera.module,
            "modes": camera.modes
            })
        return response

@app.route("/")
async def index(request):
    """
    """

    return response.html('''Hi''')

@app.websocket("/stream")
async def stream(request, ws):
    """
    """

    camera = Camera()
    try:
        while True:
            await asyncio.sleep(0.01)
            frame = next(camera.frames())
            print(sys.getsizeof(frame))
            await ws.send(
               f"data:image/jpeg;base64, {base64.b64encode(frame).decode()}"
            )
    except:
        print("Closing connection.")
    finally:
        camera.close()
        

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
