from dataclasses import dataclass
from collections import namedtuple

CameraHardware = namedtuple("CameraHardware", ["Id", "Resolution", "Framerates", "Video", "Image", "FoV"])

@dataclass
class CameraSettings:
    """
    """

    def __init__(self):
        """
        """

        self.module = {
            "ov5647": ["V1"],
            "imx219": ["V2"]
        }

        self.modes = {
            "V1": [
                CameraHardware(1, (1920, 1080), (1, 30), True, False, "Partial"),
                CameraHardware(2, (2492, 1944), (0.1666, 15), True, True, "Full"),
                CameraHardware(3, (1296, 972), (1, 42), True, False, "Full"),
                CameraHardware(4, (1296, 730), (1, 49), True, False, "Full"),
                CameraHardware(5, (640, 480), (42.1, 90), True, False, "Full")
            ],
            "V2": [
                CameraHardware(1, (1920, 1080), (0.1, 30), True, False, "Partial"),
                CameraHardware(2, (3280, 2464), (0.1, 15), True, True, "Full"),
                CameraHardware(3, (1640, 1232), (0.1, 40), True, False, "Full"),
                CameraHardware(4, (1640, 922), (0.1, 40), True, False, "Full"),
                CameraHardware(5, (1280, 720), (40, 90), True, False, "Partial"),
                CameraHardware(6, (640, 480), (40, 90), True, False, "Partial")
            ]
        }
