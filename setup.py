from setuptools import setup
import platform

base = (
    [
        "aiofiles==0.8.0",
        "httptools==0.3.0",
        "multidict==5.2.0",
        "numpy==1.21.4",
        "PyYAML==6.0",
        "sanic==21.12.1",
        "Sanic-Cors==2.0.0",
        "sanic-routing==0.7.2",
        "sanic-jwt==1.7.0",
        "ujson==5.1.0",
        "uvloop==0.16.0",
        "websockets==10.1",
    ],
)

base = (
    base + "picamera==1.13"
    if platform.system == "Linux" and platform.machine == "armv7l"
    else base
)

setup(name="moko_server", install_requires=base)
