from picamera import PiCamera, PiCameraCircularIO
from io import BytesIO
from camera_settings import CameraSettings


class Camera():
    """
    """

    def __init__(
        self,
        name="A camera has no name",
        resolution_id=1,
        rotation=0,
        quality=10
    ):
        """
        """

        #self.module = None
        #self.mode = None

        self.name = name
        self.settings = CameraSettings()
        self.camera_map = {
            "ov5647": "V1 module",
            "imx219": "V2 module"
        }

        self.camera = PiCamera()

        resolution = self.settings.modes[self._module()[0]][resolution_id-1][1]
        self.camera.resolution = resolution
        self.camera.rotation = rotation
        self.quality = quality

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

    def _module(self):
        """
        """

        module = self.camera.revision
        self._model = self.settings.module.get(module, "none")

        return self._model

    @property
    def module(self):
        """
        """

        return self._module()

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
        for _ in self.camera.capture_continuous(stream, "jpeg", use_video_port=True, quality=self.quality):
            stream.seek(0)
            yield stream.read()
            stream.truncate()
            stream.seek(0)

