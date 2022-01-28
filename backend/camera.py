from picamera import PiCamera, PiCameraCircularIO
from io import BytesIO
from camera_settings import CameraSettings


class Camera():
    """
    Camera class, for now only supporting the Raspberry Pi Official cameras V1 and V2.
    """

    def __init__(
        self,
        name="A camera has no name",
        resolution_id=1,
        rotation=0,
        quality=10
    ):
        """
        Initialise the camera with a name, resolution (mode), rotation and stream quality settings.

        Input:
            name: camera name
            resolution_id: camera mode identifier
            rotation: camera rotation
            quality: stream feed quality
        """

        self.name = name
        self.settings = CameraSettings()
        self.camera = PiCamera()

        self.camera.rotation = rotation
        self.quality = quality

        model = self._model()
        resolution = self.settings.modes[model][resolution_id][1]
        self.camera.resolution = resolution
        
    def __del__(self):
        """
        Delete camera object, close camera.
        """

        self.camera.close()

    def __enter__(self):
        """
        Allow context manager.
        """

        return self

    def __exit__(self, type, value, traceback):
        """
        Exit camera object and close camera.
        """

        self.close()

    def close(self):
        """
        Close camera function.
        """

        self.camera.close()

    def _model(self):
        """
        Get the connected model from module.
        """

        module = self.camera.revision
        model = self.settings.module.get(module, "none")

        return model

    @property
    def model(self):
        """
        Get camera model.
        """

        return self._model()

    @property
    def modes(self):
        """
        Get available camera modes.
        """

        modes = self.settings.modes.get(self._model(), "none")

        return modes

    def next_frame(self):
        """
        Get next frame in feed.
        """

        stream = BytesIO()
        for _ in self.camera.capture_continuous(stream, "jpeg", use_video_port=True, quality=self.quality):
            stream.seek(0)
            yield stream.read()
            stream.truncate()
            stream.seek(0)

