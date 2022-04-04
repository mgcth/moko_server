import sys
import pytest
from unittest.mock import Mock

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
