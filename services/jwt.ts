import { Request } from "express";

const getToken = (req: Request) => {
  let token = "";
  const auth = req.header("authorization");
  const parts = auth?.split(" ");
  if (auth && parts?.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    } else {
      return { error: "Invalid authorization header format." };
    }
  } else {
    return { error: "No authorization header was found" };
  }

  return token;
};

module.exports = {
  getToken,
};
