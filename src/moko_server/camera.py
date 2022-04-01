import io
import queue
from PIL import Image
from io import BytesIO
from threading import Thread
from datetime import datetime
from picamera import PiCamera
from moko_server.camera_settings import CameraSettings

save_frame_queue = queue.Queue(25)
stream_frame_queue = queue.Queue()

stream_queue = queue.Queue()
record_queue = queue.Queue()


def record(camera, save_frame_queue, stream_queue):
    """
    Record thread.
    """
    print("Record thread started.")
    if camera:
        try:
            save_stream = SplitFrames(camera.path)
            camera.camera.start_recording(save_stream, "mjpeg", quality=100)

            while record_queue.empty():
                camera.camera.wait_recording(1)
        finally:
            camera.camera.stop_recording()
            print("Record stopped.")
    else:
        print("No camera selected.")


def stream(camera, stream_frame_queue, stream_queue):
    """
    Stream thread.
    """
    print("Stream thread started.")
    if camera:
        try:
            stream = Stream()
            camera.camera.start_recording(
                stream,
                "mjpeg",
                quality=camera.quality,
                resize=camera.stream_resolution,
                splitter_port=2,
            )
            print(stream_queue.empty())
            print(stream_queue.empty())
            while stream_queue.empty():
                print(stream_queue.empty())
                print("1")
                camera.camera.wait_recording(1)
        finally:
            camera.camera.stop_recording(splitter_port=2)
            print("Stream stopped.")
    else:
        print("No camera selected.")


class Stream:
    def __init__(self):
        """ """
        pass

    def write(self, buf):
        """ """
        if buf.startswith(b"\xff\xd8"):
            stream_frame_queue.put(BytesIO(buf))


class SplitFrames:
    def __init__(self, path):
        """ """
        # self.output = None
        self.timestamp = None
        self.frame_num = 0
        self.path = path

    def write(self, buf):
        """
        Write frame to buffer, or queue.
        """
        if buf.startswith(b"\xff\xd8"):
            self.update_time()

            file = "{0}/image{1}_{2}.jpg".format(
                self.path, self.timestamp, self.frame_num
            )

            if save_frame_queue.full() is True:
                for (frame, file) in iter(save_frame_queue.get, None):
                    output = io.open(file, "wb")
                    output.write(frame)
                    output.close()

            save_frame_queue.put((buf, file))

    def update_time(self):
        """
        Update timestamp.
        """
        date = datetime.now().strftime("%Y%m%d%G%M%S")
        if self.timestamp != date:
            self.timestamp = date
            self.frame_num = 0
        else:
            self.frame_num += 1


class CameraManager:
    """
    Camera manager, managing different types of camera hardware.
    Note that, a class for that particular camera must be implemented.
    So, this manager will only scan and make available cameras that have
    a class implemented.
    """

    def __init__(self, camera_classes=[]):
        """
        Initialise the CameraManager class.
        """
        self._backend = camera_classes
        self._usable = None
        self._selected = None
        self.camera = None
        self._record_thread = None

    def scan(self):
        """
        Scan hardware for available cameras from defined classes. Or rather,
        use the implemented camera classes to check if any camera is found. Let
        the user select which class to use if several find the same camera.
        Class must support contex managers.
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
        self._selected = [
            usable for usable in self._usable if repr(usable()) == camera
        ][0]

    def deselect(self):
        """
        Mark the selected camera as free again.
        """
        self._selected = None

    def start_streaming(self):
        """
        Start streaming process.
        """
        self._stream_thread = Thread(
            target=stream,
            args=(
                self.camera,
                stream_frame_queue,
                stream_queue,
            ),
        )
        self._stream_thread.daemon = True
        self._stream_thread.start()

    def stop_streaming(self):
        """
        Stop streaming process.
        """
        if self._selected:
            stream_queue.put(False)
            self._stream_thread.join()
            stream_queue.get()
        else:
            print("No camera selected.")

    def start_recording(self):
        """
        Start camera recording.
        """
        self._record_thread = Thread(
            target=record,
            args=(
                self.camera,
                save_frame_queue,
                record_queue,
            ),
        )
        self._record_thread.daemon = True
        self._record_thread.start()

    def stop_recording(self):
        """
        Stop camera recording.
        """
        if self._selected:
            record_queue.put(False)
            self._record_thread.join()
            record_queue.get()
        else:
            print("No camera selected.")

    @property
    def usable(self):
        """
        Return usable camera backends as string.
        """
        return [repr(camera()) for camera in self._usable]

    @property
    def selected(self):
        """
        Return the selected camera.
        """
        return self._selected


class RaspberryPiCamera:
    """
    Raspberry Pi Camera class, for now only supporting the Raspberry Pi Official
    cameras V1 and V2.
    """

    def __init__(
        self,
        path=None,
        name="A camera has no name",
        resolution_id=1,
        rotation=0,
        quality=10,
        framerate=10,
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
        self.path = path
        self.name = name
        self.settings = CameraSettings()
        self.camera = PiCamera()

        self.camera.rotation = rotation
        self.quality = quality
        self.camera.framerate = framerate

        model = self._model()
        self.resolution = self.settings.modes[model][resolution_id][1]
        self.camera.resolution = self.resolution
        self.stream_resolution = (800, 400)
        self._frame = None

        self.frame_num = 0
        self.output = None

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
            stream, "jpeg", use_video_port=True, quality=self.quality
        ):
            stream.seek(0)
            self._frame = stream.read()
            stream.truncate()
            stream.seek(0)

            yield self._frame

    def record(self):
        """ """
        self.camera.start_recording(stream, "mjpeg", quality=self.quality)

    def save_frame(self, path):
        """
        Save frame to path.
        """
        path = path if path[-1] == "/" else path + "/"
        date = datetime.now().strftime("%Y%m%d%G%M%S")
        image = Image.open(BytesIO(self._frame))
        image.save(path + date + ".jpg")
