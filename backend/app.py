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
        for foo in camera.capture_continuous(stream, 'jpeg', use_video_port=True):
            stream.truncate()
            stream.seek(0)
            yield stream.read()
            await asyncio.sleep(1/30)

    async def stream(self, rsp):
        async for frame in self.frames():
            print(2)
            await rsp.write(
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n'
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
#         self.camera.start_recording(stream, format='mjpeg')
#         # camera.wait_recording(15)
#         # camera.stop_recording()
#         return stream


@app.route('/')
async def index(request):
    return response.html('''<img src="/camera-stream/">''')


@app.route('/camera-stream/')
async def camera_stream(request):
    camera = Camera()

    return response.stream(
        camera.stream,
        content_type='multipart/x-mixed-replace; boundary=frame'
    )


if __name__ == '__main__':
    app.run(port=5000, host="0.0.0.0", debug=False)

# @app.route('/cameras')
# def get_cameras():

#     model = camera.get_camera()
#     #camera.camera.close()

#     return jsonify({"camera_model": model})

# # @app.route('/video')
# # def get_cameras():

# #     camera = PiCamera()
# #     module = camera.revision
# #     CAMERA_MAP.get(module, "none")
# #     camera.close()

# #     return jsonify({"camera": CAMERA_MAP[module]})

# if __name__ == "__main__":
#     camera = Camera()
#     app.run(debug=False, host="0.0.0.0", port=5000)



# @sockets.route('/media')
# def echo(ws):
#     app.logger.info("Connection accepted")
#     # A lot of messages will be sent rapidly. We'll stop showing after the first one.
#     has_seen_media = False
#     message_count = 0
#     while not ws.closed:
#         message = ws.receive()
#         if message is None:
#             app.logger.info("No message received...")
#             continue

#         # Messages are a JSON encoded string
#         data = json.loads(message)

#         # Using the event type you can determine what type of message you are receiving
#         if data['event'] == "connected":
#             app.logger.info("Connected Message received: {}".format(message))
#         if data['event'] == "start":
#             app.logger.info("Start Message received: {}".format(message))
#         if data['event'] == "media":
#             if not has_seen_media:
#                 app.logger.info("Media message: {}".format(message))
#                 payload = data['media']['payload']
#                 app.logger.info("Payload is: {}".format(payload))
#                 chunk = base64.b64decode(payload)
#                 app.logger.info("That's {} bytes".format(len(chunk)))
#                 app.logger.info("Additional media messages from WebSocket are being suppressed....")
#                 has_seen_media = True
#         if data['event'] == "closed":
#             app.logger.info("Closed Message received: {}".format(message))
#             break
#         message_count += 1

#     app.logger.info("Connection closed. Received a total of {} messages".format(message_count))


# if __name__ == '__main__':
#     app.logger.setLevel(logging.DEBUG)
#     from gevent import pywsgi
#     from geventwebsocket.handler import WebSocketHandler

#     server = pywsgi.WSGIServer(('', HTTP_SERVER_PORT), app, handler_class=WebSocketHandler)
#     print("Server listening on: http://localhost:" + str(HTTP_SERVER_PORT))
#     server.serve_forever()