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
