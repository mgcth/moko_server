from moko_server.user import User

user_id = 0
username = "username"
password = "pass"


def test_unit_user_init():
    """Test user initialisation."""

    user = User(user_id, username, password)

    assert user.user_id == user_id
    assert user.username == username
    assert user.password == password
