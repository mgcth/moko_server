import base64
import asyncio
from io import BytesIO
from sanic import Sanic
from sanic import response
from sanic.response import json
from picamera import PiCamera

app = Sanic(__name__)


class CameraManager:
    """
    """

    def __init__(self):
        """
        """

        self.camera = None

    def start(self):

        try:
            print(self.camera)
            self.camera.close()
        except:
            self.camera = Camera()

    def close(self):
        """
        """

        self.camera.close()


class Camera():
    """
    """

    def __init__(self, resolution=(640, 480)):
        """
        """

        self.camera_map = {
            "ov5647": "V1 module",
            "imx219": "V2 module"
        }
        self.camera = PiCamera(resolution=resolution)

    def __del__():
        """
        """

        self.camera.close()

    def __enter__(self):
        """
        """

        return self

    def __exit__(self, type, value, traceback):
        """
        """

        self.camera.close()

    def close(self):
        """
        """

        self.camera.close()

    def get_camera(self):
        """
        """

        module = self.camera.revision
        model = self.camera_map.get(module, "none")

        return model

    def frames(self):
        """
        """

        stream = BytesIO()

        for _ in self.camera.capture_continuous(stream, "jpeg", use_video_port=True):
            stream.seek(0)
            yield stream.read()
            stream.truncate()
            stream.seek(0)
            #await asyncio.sleep(1/30)

    # async def stream(self, response):
    #     """
    #     """

    #     async for frame in self.frames():
    #         await response.write(
    #            b"--frame\r\n"
    #            b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
    #         )

@app.route("/cameras")
async def camera(request):
    """
    """

    with Camera() as camera:
        return json({"camera": camera.get_camera()})

@app.route("/")
async def index(request):
    """
    """

    return response.html('''<img src="/stream">''')


@app.websocket("/stream")
async def stream(request, ws):
    """
    """

    # async def stream(response):
    #     """
    #     """

    #     async for frame in camera.frames():
    #         await response.write(
    #            b"--frame\r\n"
    #            b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
    #         )



    camera = Camera()
    
    while True:
        frames = camera.frames()
        frame = next(frames)
        await ws.send(
           f"data:image/jpeg;base64, {base64.b64encode(frame).decode()}"
        )

    #return response.stream(
    #    stream,
    #    content_type="multipart/x-mixed-replace; boundary=frame"
    #)


if __name__ == "__main__":
    #cm = CameraManager()
    app.run(host="0.0.0.0", port=5000, debug=True)