import express, { Express, Request, Response } from "express";
import { PORT } from "./config";
import { getAccessTokenObject } from "./spotify/auth/getAccessTokenObject";
import { getClientToken } from "./spotify/auth/getClientToken";
import { getFollowers } from "./spotify/user/getFollowers";
import cors from "cors";
import { getUser } from "./spotify/user/getUser";

const app: Express = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("spotify-api-tool");
});

app.get("/auth", (req: Request, res: Response) => {
  getAccessTokenObject().then((tokenObjectData) => {
    if (tokenObjectData === undefined)
      return res.status(500).send("Unable to get access token");

    getClientToken(tokenObjectData).then((clientTokenObject) => {
      if (clientTokenObject === undefined)
        return res.status(500).send("Unable to get client token");

      return res.status(200).json({
        clientTokenData: clientTokenObject,
        accessTokenData: tokenObjectData,
      });
    });
  });
});

app.get("/followers", (req: Request, res: Response) => {
  const username = req.query.username;
  const accessToken = req.headers["access-token"];
  const clientToken = req.headers["client-token"];

  if (typeof username !== "string") return res.status(400).send("Bad username");
  if (typeof accessToken !== "string")
    return res.status(400).send("Bad access token");
  if (typeof clientToken !== "string")
    return res.status(400).send("Bad client token");

  getFollowers(username, accessToken, clientToken).then((followers) => {
    if (followers === undefined)
      return res.status(500).send("Unable to get followers");
    return res.status(200).json(followers);
  });
});

app.get("/user", (req: Request, res: Response) => {
  const username = req.query.username;
  const accessToken = req.headers["access-token"];
  const clientToken = req.headers["client-token"];

  if (typeof username !== "string") return res.status(400).send("Bad username");
  if (typeof accessToken !== "string")
    return res.status(400).send("Bad access token");
  if (typeof clientToken !== "string")
    return res.status(400).send("Bad client token");

  getUser(username, accessToken, clientToken).then((profile) => {
    if (profile === undefined)
      return res.status(500).send("Unable to get profile");
    return res.status(200).json(profile);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
