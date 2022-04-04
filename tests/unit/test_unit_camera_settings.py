from moko_server.camera_settings import CameraHardware, CameraSettings


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
    """
    Test camera settings class.
    """
    camera_settings = CameraSettings()

    assert camera_settings.module == {"ov5647": "V1", "imx219": "V2"}

    assert all([x == modes["V1"][i] for i, x in enumerate(camera_settings.modes["V1"])])
    assert all([x == modes["V2"][i] for i, x in enumerate(camera_settings.modes["V2"])])
