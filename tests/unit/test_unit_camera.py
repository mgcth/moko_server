import sys
import pytest
import unittest.mock
from unittest.mock import Mock, patch

sys.modules["picamera"] = Mock()

from moko_server.camera import CameraManager


class MockCamera(Mock):
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
