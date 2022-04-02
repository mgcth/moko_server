import sys
from unittest.mock import Mock

sys.modules["picamera"] = Mock()

from moko_server.user import User
from moko_server.camera_settings import CameraHardware, CameraSettings
from moko_server.camera import CameraManager

user_id = 0
username = "username"
password = "pass"


def test_unit_user():
    """Test user class, initialisation and methods."""
    user = User(user_id, username, password)

    assert user.user_id == user_id
    assert user.username == username
    assert user.password == password

    assert repr(user) == "User(id='{0}')".format(user_id)

    assert user.to_dict() == {"user_id": user_id, "username": username}


module = {"ov5647": "V1", "imx219": "V2"}
modes = {
    "V1": [
        CameraHardware(0, (2492, 1944), (0.1666, 15), True, True, "Full"),
        CameraHardware(1, (1920, 1080), (1, 30), True, False, "Partial"),
        CameraHardware(2, (1296, 972), (1, 42), True, False, "Full"),
        CameraHardware(3, (1296, 730), (1, 49), True, False, "Full"),
        CameraHardware(4, (640, 480), (42.1, 90), True, False, "Full"),
    ],
    "V2": [
        CameraHardware(0, (3280, 2464), (0.1, 15), True, True, "Full"),
        CameraHardware(1, (1640, 1232), (0.1, 40), True, False, "Full"),
        CameraHardware(2, (1920, 1080), (0.1, 30), True, False, "Partial"),
        CameraHardware(3, (1640, 922), (0.1, 40), True, False, "Full"),
        CameraHardware(4, (1280, 720), (40, 90), True, False, "Partial"),
        CameraHardware(5, (640, 480), (40, 90), True, False, "Partial"),
    ],
}


def test_unit_camera_settings():
    """Test camera settings class."""
    camera_settings = CameraSettings()

    assert camera_settings.module == {"ov5647": "V1", "imx219": "V2"}

    assert all([x == modes["V1"][i] for i, x in enumerate(camera_settings.modes["V1"])])
    assert all([x == modes["V2"][i] for i, x in enumerate(camera_settings.modes["V2"])])


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


def test_camera_manager_init():
    """
    Test the init method of camera manager class.
    """
    cm = CameraManager()
    assert cm._backend == []
    assert cm._usable == None
    assert cm._selected == None
    assert cm.camera == None
    assert cm._record_thread == None

    fake_class_list = ["FakeClass"]
    cm = CameraManager(fake_class_list)
    assert cm._backend == fake_class_list
    assert cm._usable == None
    assert cm._selected == None
    assert cm.camera == None
    assert cm._record_thread == None


def test_camera_manager_scan():
    """
    Test the scan method of camera manager class.
    """
    fake_class_list = [MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()
    assert len(cm._usable) == 1

    fake_class_list = [MockCamera1, MockCamera1]
    cm = CameraManager(fake_class_list)
    cm.scan()
    assert len(cm._usable) == 1

    fake_class_list = [MockCamera1, MockCamera2]
    cm = CameraManager(fake_class_list)
    cm.scan()
    assert len(cm._usable) == 2


def test_camera_manager_select():
    """
    Test the select method of camera manager class.
    """
    fake_class_list = [MockCamera1, MockCamera2]
    cm = CameraManager(fake_class_list)
    cm.scan()

    cm.select("NoCam")
    assert cm._selected == None

    cm.select("Cam1")
    assert cm._selected == MockCamera1

    cm.select("Cam2")
    assert cm._selected == MockCamera2
