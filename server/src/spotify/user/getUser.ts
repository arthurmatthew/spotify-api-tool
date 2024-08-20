import { DetailedProfile, Profile } from "../../types";
import { log2 } from "../../util/log2";
import { headers } from "../headers";

export const getUser = async (
  username: string,
  token: string,
  clientToken: string
) => {
  const userData = await fetch(
    `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${username}?playlist_limit=10&artist_limit=10&episode_limit=10&market=US`,
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

  if (!userData.ok) return undefined;
  log2("Successfully retrieved followers");

  const profile = (await userData.json()) as DetailedProfile;
  const trimmedProfile: Profile = {
    uri: profile.uri,
    name: profile.name,
    followers_count: profile.followers_count,
    color: profile.color,
    image_url: profile.image_url,
  };

  return trimmedProfile;
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
