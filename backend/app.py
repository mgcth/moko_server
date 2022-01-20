import asyncio
import time
from io import BytesIO
from threading import Condition

from sanic import Sanic
from sanic import response

from picamera import PiCamera

app = Sanic(__name__)


class Camera():
    """Using Camera as stream"""

    def __init__(self):
        self.video_source = 0

    async def frames(self):
        camera = PiCamera(resolution=(640, 480))

        stream = BytesIO()

        # Use the video-port for captures...
        for foo in camera.capture_continuous(stream, "jpeg", use_video_port=True):
            stream.seek(0)
            yield stream.read()
            stream.truncate()
            stream.seek(0)
            await asyncio.sleep(1/120)

    async def stream(self, rsp):
        async for frame in self.frames():
            await rsp.write(
               b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
            )



# class Camera:
#     """
#     """

#     def __init__(self, resolution=(640, 480), quality=23):
#         """
#         """

#         self.camera_map = {
#             "ov5647": "V1 module",
#             "imx219": "V2 module"
#         }
#         self.camera = PiCamera(resolution=resolution)

#     def get_camera(self):
#         """
#         """

#         module = self.camera.revision
#         model = self.camera_map.get(module, "none")

#         return model

#     def video(self):
#         """
#         """

#         stream = StreamingOutput()
#         time.sleep(5)
#         self.camera.start_recording(stream, format="mjpeg")
#         # camera.wait_recording(15)
#         # camera.stop_recording()
#         return stream


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
    app.run(port=5000, host="0.0.0.0", debug=False)