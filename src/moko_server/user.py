from sanic_jwt import exceptions


class User:
    """
    User class.
    """

    def __init__(self, id, username, password):
        """
        Construction user object.
        """
        self.user_id = id
        self.username = username
        self.password = password

    def __repr__(self):
        """
        Represent object as string.
        """
        return "User(id='{0}')".format(self.user_id)

    def to_dict(self):
        """
        Create dict from object.
        """
        return {"user_id": self.user_id, "username": self.username}


USER_FILE = "../../user.json"
users = [User(1, "user", "pass")]
username_table = {u.username: u for u in users}


async def authenticate(request, *args, **kwargs):
    """
    User authentication.
    """
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    print("HERE")
    print(username)
    print(password)
    if not username or not password:
        raise exceptions.AuthenticationFailed()

    print("HERE2")
    print(username)
    user = username_table.get(username, None)
    print(user)
    if user is None:
        raise exceptions.AuthenticationFailed()

    if password != user.password:
        raise exceptions.AuthenticationFailed()

    return user
