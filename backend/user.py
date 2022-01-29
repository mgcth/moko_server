class User:
    """
    """

    def __init__(self, id, username, password):
        """
        """

        self.user_id = id
        self.username = username
        self.password = password

    def __repr__(self):
        """
        """

        return "User(id='{0}')".format(self.user_id)

    def to_dict(self):
        """
        """

        return {"user_id": self.user_id, "username": self.username}