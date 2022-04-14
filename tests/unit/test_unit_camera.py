import sys
import pytest
import unittest.mock
from unittest.mock import Mock, patch

sys.modules["picamera"] = Mock()

from moko_server.camera_settings import CameraSettings
from moko_server.camera import CameraManager, RaspberryPiCamera


class MockCamera(Mock):
    revision = "imx219"

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        pass

    def exist(self):
        return True


class MockCamera1(MockCamera):
    def __repr__(self):
        return "Cam1"


class MockCamera2(MockCamera):
    def __repr__(self):
        return "Cam2"


class MockCameraFrame(MockCamera):
    capture_continuous = lambda self, a, b, use_video_port=None, quality=None: [1, 2]


@pytest.mark.parametrize(
    "input, expected", [(None, []), (["FakeClass"], ["FakeClass"])]
)
def test_camera_manager_init(input, expected):
    """
    Test the init method of camera manager class.
    """
    cm = CameraManager() if input is None else CameraManager(input)
    assert cm._backend == expected
    assert cm._usable is None
    assert cm._selected is None
    assert cm.camera is None
    assert cm._record_thread is None


@pytest.mark.parametrize(
    "input, expected",
    [
        ([MockCamera1], 1),
        ([MockCamera1, MockCamera1], 1),
        ([MockCamera1, MockCamera2], 2),
    ],
)
def test_camera_manager_scan(input, expected):
    """
    Test the scan method of camera manager class.
    """
    cm = CameraManager(input)
    cm.scan()
    assert len(cm._usable) == expected


@pytest.mark.parametrize(
    "input, expected",
    [
        ([MockCamera1], {"Cam1"}),
        ([MockCamera1, MockCamera2], {"Cam1", "Cam2"}),
    ],
)
def test_camera_manager_usable(input, expected):
    """
    Test the usable property of camera manager class.
    """
    cm = CameraManager(input)
    cm.scan()
    assert set(cm.usable) == expected


def test_camera_manager_select():
    """
    Test the select method of camera manager class.
    """
    fake_class_list = [MockCamera1, MockCamera2]
    cm = CameraManager(fake_class_list)
    cm.scan()

    cm.select("NoCam")
    assert cm._selected is None

    cm.select("Cam1")
    assert cm._selected == MockCamera1

    cm.select("Cam2")
    assert cm._selected == MockCamera2


def test_camera_manager_selected():
    """
    Test the selected property of camera manager class.
    """
    fake_class_list = [MockCamera1, MockCamera2]
    cm = CameraManager(fake_class_list)
    cm.scan()

    cm.select("NoCam")
    assert cm.selected is None

    cm.select("Cam1")
    assert cm.selected == MockCamera1

    cm.select("Cam2")
    assert cm.selected == MockCamera2


def test_camera_manager_deselect():
    """
    Test the deselect method of camera manager class.
    """
    fake_class_list = [MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()
    assert cm._selected is None

    cm.select("Cam1")
    assert cm._selected == MockCamera1

    cm.deselect()
    assert cm._selected is None


@patch("moko_server.camera.Thread")
def test_camera_manager_start_streaming(mock_thread):
    """
    Test the start_streaming method of camera manager class.
    """
    fake_class_list = [MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()
    cm.select("Cam1")
    cm.start_streaming()

    mock_thread.assert_called_once()
    assert mock_thread.return_value.daemon == True
    mock_thread.return_value.start.assert_called_once()


@patch("moko_server.camera.Thread")
@patch("moko_server.camera.stream_queue")
def test_camera_manager_stop_streaming(mock_stream_queue, mock_thread):
    """
    Test the stop_streaming method of camera manager class.
    """
    fake_class_list = [MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()

    cm.stop_streaming()
    assert not mock_stream_queue.put.called
    assert not mock_thread.return_value.join.called
    assert not mock_stream_queue.get.called

    cm.select("Cam1")
    cm.start_streaming()
    cm.stop_streaming()

    mock_stream_queue.put.assert_called_once()
    mock_thread.return_value.join.assert_called_once()
    mock_stream_queue.get.assert_called_once()


@patch("moko_server.camera.Thread")
def test_camera_manager_start_recording(mock_thread):
    """
    Test the start_recording method of camera manager class.
    """
    fake_class_list = [MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()
    cm.select("Cam1")
    cm.start_recording()

    mock_thread.assert_called_once()
    assert mock_thread.return_value.daemon == True
    mock_thread.return_value.start.assert_called_once()


@patch("moko_server.camera.Thread")
@patch("moko_server.camera.record_queue")
def test_camera_manager_stop_recording(mock_record_queue, mock_thread):
    """
    Test the stop_recording method of camera manager class.
    """
    fake_class_list = [MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()

    cm.stop_recording()
    assert not mock_record_queue.put.called
    assert not mock_thread.return_value.join.called
    assert not mock_record_queue.get.called

    cm.select("Cam1")
    cm.start_recording()
    cm.stop_recording()

    mock_record_queue.put.assert_called_once()
    mock_thread.return_value.join.assert_called_once()
    mock_record_queue.get.assert_called_once()


@patch("moko_server.camera.PiCamera", new_callable=MockCamera)
def test_picamera_init(mock_picamera):
    """
    Test the init method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()

    assert camera._type == "PiCamera"
    assert camera.path is None
    assert camera.name == "A camera has no name"
    assert camera.settings == CameraSettings()
    mock_picamera.assert_called_once()

    assert camera.camera.rotation == 0
    assert camera.quality == 10
    assert camera.camera.framerate == 10

    assert camera.resolution == (1640, 1232)
    assert camera.camera.resolution == camera.resolution
    assert camera.stream_resolution == (800, 400)
    assert camera._frame == None

    assert camera.frame_num == 0
    assert camera.output == None


@patch("moko_server.camera.PiCamera")
def test_picamera_del(mock_picamera):
    """
    Test the del method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    camera.__del__()
    mock_picamera.return_value.close.assert_called_once()


@patch("moko_server.camera.PiCamera")
def test_picamera_enter(mock_picamera):
    """
    Test the enter method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    cam = camera.__enter__()
    assert camera == cam


@patch("moko_server.camera.PiCamera")
def test_picamera_exit(mock_picamera):
    """
    Test the exit method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    camera.__exit__(None, None, None)
    mock_picamera.return_value.close.assert_called_once()


@patch("moko_server.camera.PiCamera")
def test_picamera_repr(mock_picamera):
    """
    Test the repr method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    assert camera.__repr__() == "PiCamera"


@patch("moko_server.camera.PiCamera")
def test_picamera_eq(mock_picamera):
    """
    Test the eq method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    assert camera.__eq__("PiCamera") is True


@patch("moko_server.camera.PiCamera")
def test_picamera_close(mock_picamera):
    """
    Test the close method of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    camera.close()
    mock_picamera.return_value.close.assert_called_once()


@pytest.mark.parametrize("input, expected", [(MockCamera, True), (Mock, False)])
def test_picamera_exist(input, expected):
    """
    Test the exist method of RaspberryPi camera class.
    """
    with patch("moko_server.camera.PiCamera", new_callable=input):
        camera = RaspberryPiCamera()
        assert camera.exist() is expected


@pytest.mark.parametrize("input, expected", [(MockCamera, "V2"), (Mock, None)])
def test_picamera_model(input, expected):
    """
    Test the _model method of RaspberryPi camera class.
    """
    with patch("moko_server.camera.PiCamera", new_callable=input):
        camera = RaspberryPiCamera()
        assert camera._model() is expected


@pytest.mark.parametrize("input, expected", [(MockCamera, "V2"), (Mock, None)])
def test_picamera_model(input, expected):
    """
    Test the model property of RaspberryPi camera class.
    """
    with patch("moko_server.camera.PiCamera", new_callable=input):
        camera = RaspberryPiCamera()
        assert camera.model is expected


@pytest.mark.parametrize(
    "input, expected", [(MockCamera, CameraSettings().modes["V2"]), (Mock, None)]
)
def test_picamera_modes(input, expected):
    """
    Test the modes property of RaspberryPi camera class.
    """
    with patch("moko_server.camera.PiCamera", new_callable=input):
        camera = RaspberryPiCamera()
        assert camera.modes is expected


@patch("moko_server.camera.PiCamera")
def test_picamera_frame(mock_picamera):
    """
    Test the frame property of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    assert camera.frame is None


@patch("moko_server.camera.PiCamera", new_callable=MockCameraFrame)
@patch("moko_server.camera.BytesIO")
def test_picamera_next_frame(mock_bytesio, mock_picamera):
    """
    Test the next_frame property of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    for _ in camera.next_frame():
        continue

    assert mock_bytesio.return_value.seek.call_count == 4
    assert mock_bytesio.return_value.read.call_count == 2
    assert mock_bytesio.return_value.truncate.call_count == 2
    assert mock_bytesio.return_value.seek.call_count == 4


@patch("moko_server.camera.PiCamera")
def test_picamera_record(mock_picamera):
    """
    Test the record property of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    camera.record()
    mock_picamera.return_value.start_recording.assert_called_once()


class MockStrftime(Mock):
    def __init__(self):
        pass

    def strftime(self, format="%Y%m%d%G%M%S"):
        return "20220101000000"


class MockDate(Mock):
    def __init__(self, name="name"):
        pass

    def now(self):
        return MockStrftime()


@pytest.mark.parametrize(
    "path, expected",
    [
        ("path", "path/" + MockDate().now().strftime() + ".jpg"),
        ("path/", "path/" + MockDate().now().strftime() + ".jpg"),
    ],
)
@patch("moko_server.camera.datetime", new_callable=MockDate)
@patch("moko_server.camera.Image.open")
def test_picamera_save_frame(mock_open, mock_time, path, expected):
    """
    Test the record property of RaspberryPi camera class.
    """
    camera = RaspberryPiCamera()
    camera.save_frame(path)
    mock_open.assert_called_once()
    mock_open.return_value.save.assert_called_once()
    mock_open.return_value.save.assert_called_with(expected)
