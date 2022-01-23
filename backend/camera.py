from picamera import PiCamera, PiCameraCircularIO
from io import BytesIO
from camera_settings import CameraSettings


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

        modes = self.settings.modes.get(self.module[0], "none")

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

