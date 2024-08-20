import { Followers } from "../../types";
import { log2 } from "../../util/log2";
import { headers } from "../headers";

export const getFollowers = async (
  username: string,
  token: string,
  clientToken: string
) => {
  const followersData = await fetch(
    `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${username}/followers?market=US`,
    {
      headers: {
        ...headers,
        accept: "application/json",
        "accept-language": "en",
        "app-platform": "WebPlayer",
        authorization: `Bearer ${token}`,
        "client-token": clientToken,
        "spotify-app-version": "1.2.45.254.g74c8e3c5",
      },
      body: null,
      method: "GET",
    }
  );

  if (!followersData.ok) return undefined;
  log2("Successfully retrieved followers");

  const followers = await followersData.json();

  return followers as Followers;
};

/*

{
  "profiles": [{
    "uri": "spotify:user:stevepineapple",
    "name": "Steve Pineapple",
    "image_url": "https://i.scdn.co/image/xxx",
    "followers_count": 99,
    "color": 5282805
  }]
}

*/
