import pytest
from unittest.mock import patch
from sanic_jwt import exceptions
from moko_server.user import User, authenticate

user_id = 0
username = "username"
password = "pass"


def test_unit_user():
    """
    Test user class, initialisation and methods.
    """
    user = User(user_id, username, password)

    assert user.user_id == user_id
    assert user.username == username
    assert user.password == password

    assert repr(user) == "User(id='{0}')".format(user_id)

    assert user.to_dict() == {"user_id": user_id, "username": username}


class Request:
    def __init__(self, json):
        self.json = json


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "input, mock_table, expected",
    [
        ({}, {}, None),
        ({"username": ""}, {}, None),
        ({"password": ""}, {}, None),
        (
            {"username": "user", "password": "pass"},
            {u.username: u for u in [User(1, "", "")]},
            None,
        ),
        (
            {"username": "user", "password": "wrongpass"},
            {u.username: u for u in [User(1, "user", "pass")]},
            None,
        ),
        (
            {"username": "user", "password": "pass"},
            {u.username: u for u in [User(1, "user", "pass")]},
            User(1, "user", "pass"),
        ),
    ],
)
async def test_unit_authenticate(input, mock_table, expected):
    """
    Test user authentication code.
    """
    with patch.dict("moko_server.user.username_table", mock_table, clear=True):
        request = Request(input)
        if expected is not None:
            user = await authenticate(request)
            assert user.user_id == 1
            assert user.username == "user"
            assert user.password == "pass"
            return None

        with pytest.raises(exceptions.AuthenticationFailed):
            await authenticate(request)
