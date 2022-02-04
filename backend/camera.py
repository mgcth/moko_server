from PIL import Image
from io import BytesIO
from datetime import datetime
from picamera import PiCamera, PiCameraCircularIO
from camera_settings import CameraSettings


class CameraManager:
    """
    Camera manager, managing different types of camera hardware.
    Note that, a class for that paritcular camera must be implemented.
    So, this manager will only scan and make available cameras that have
    a class implemented.
    """

    def __init__(self, camera_classes=[]):
        """

        """
        self._backend = camera_classes
        self._usable = None
        self._selected = None

    def scan(self):
        """
        Scan hardware for available cameras from defined calsses. Or rather,
        use the implemented camera classes to check if any camera is found. Let
        the user select which class to use if several find the same camera.
        Class mush support contex managers.
        """
        camera_set = set()
        for camera_class in self._backend:
            with camera_class() as camera_instance:
                if camera_instance.exist():
                    camera_set.add(camera_class)

        self._usable = list(camera_set)

    def select(self, camera):
        """
        Select an available camera, make that camera unavailable if set.
        """
        self._selected = [usable for usable in self._usable if repr(usable()) == camera][0]

    def deselect(self, camera):
        """
        Mark the selected camera as free again.
        """
        self._selected = None

    @property
    def usable(self):
        """
        Return usable camera backends as string.
        """
        return [repr(camera()) for camera in self._usable]
    
    @property
    def selected(self):
        """
        Return ...
        """
        return self._selected
    

class RaspberryPiCamera:
    """
    Raspberry Pi Camera class, for now only supporting the Raspberry Pi Official
    cameras V1 and V2.
    """

    def __init__(
        self,
        name="A camera has no name",
        resolution_id=1,
        rotation=0,
        quality=10
    ):
        """
        Initialise the camera with a name, resolution (mode), rotation and stream
        quality settings.

        Input:
            name: camera name
            resolution_id: camera mode identifier
            rotation: camera rotation
            quality: stream feed quality
        """
        self._type = "PiCamera"
        self.name = name
        self.settings = CameraSettings()
        self.camera = PiCamera()

        self.camera.rotation = rotation
        self.quality = quality

        model = self._model()
        self.resolution = self.settings.modes[model][resolution_id][1]
        self.camera.resolution = self.resolution
        self._frame = None

    def __del__(self):
        """
        Delete camera object, close camera.
        """
        self.close()

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

    def __repr__(self):
        """
        Return object string representation.
        """
        return self._type

    def __eq__(self, x):
        """
        Check object equality to a string x.
        """
        return x == self._type

    def close(self):
        """
        Close camera function.
        """
        self.camera.close()

    def exist(self):
        """
        Scan to see if class can read hardware.
        """
        return True if self._model() else False

    def _model(self):
        """
        Get the connected model from module.
        """
        module = self.camera.revision
        model = self.settings.module.get(module, None)

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
        modes = self.settings.modes.get(self._model(), None)

        return modes

    @property
    def frame(self):
        """
        Get the current frame.
        """
        return self._frame

    def next_frame(self):
        """
        Get next frame in feed.
        """
        stream = BytesIO()
        for _ in self.camera.capture_continuous(
            stream,
            "jpeg",
            use_video_port=True,
            quality=self.quality
        ):
            stream.seek(0)
            self._frame = stream.read()
            yield self._frame
            stream.truncate()
            stream.seek(0)

    def save_frame(self, path):
        """
        Save frame to path.
        """
        path =  path if path[-1] == "/" else path + "/"
        date = datetime.now().strftime("%Y%m%d%G%M%S")
        image = Image.open(BytesIO(self._frame))
        image.save(path + date + ".jpg")
