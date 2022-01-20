import asyncio
from io import BytesIO
from sanic import Sanic
from sanic import response
from picamera import PiCamera

app = Sanic(__name__)


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

        def get_camera(self):
            """
            """

            module = self.camera.revision
            model = self.camera_map.get(module, "none")

            return model

    async def frames(self):
        """
        """

        stream = BytesIO()

        for _ in self.camera.capture_continuous(stream, "jpeg", use_video_port=True):
            stream.seek(0)
            yield stream.read()
            stream.truncate()
            stream.seek(0)
            await asyncio.sleep(1/30)

    async def stream(self, response):
        """
        """

        async for frame in self.frames():
            await response.write(
               b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
            )

@app.route("/")
async def index(request):
    return response.html('''<img src="/camera-stream/">''')


@app.route("/camera-stream/")
async def camera_stream(request):
    camera = Camera()

    return response.stream(
        camera.stream,
        content_type="multipart/x-mixed-replace; boundary=frame"
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)