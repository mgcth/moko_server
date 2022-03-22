from moko_server.user import User

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
