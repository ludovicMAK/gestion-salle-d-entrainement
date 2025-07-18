db = db.getSiblingDB("tness");

db.createUser({
  user: "appuser",
  pwd: "apppassword",
  roles: [
    {
      role: "readWrite",
      db: "tness",
    },
  ],
});
