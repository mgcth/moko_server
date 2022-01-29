# moko
Moko is a separate client (frontend) and server (backend) component to manage camera feeds over the web. Its aims are:
- Be simple and hackable.
- Decouple the client and server as much as possible, i.e. you should be able to start a server with connected camera(s) that can accept requests and send responses to a clients that can run anywhere (as long as it can connect to the server).
- This means, a simple client app that, in theory, can be hosted on the web and serve any number of users running separate servers. That hosted client should not store any user info. Rather, the user will proved an endpoint to their server and any configurations loaded from there. No need for authentication.
- Support Raspberry Pi camera modules (V1 and V2).
- Support basic motion detection and object detection.