export type DealerObject = {
  dealer: [string, string, string, string];
  spclient: [string, string, string, string];
};
export type ClientTokenObject = {
  response_type: string;
  granted_token: {
    token: string;
    expires_after_seconds: number;
    refresh_after_seconds: number;
    domains: [
      {
        domain: "spotify.com";
      },
      {
        domain: "spotify.net";
      }
    ];
  };
};
export type AccessTokenObject = {
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
  clientId: string;
};
export type Followers = {
  profiles: Profile[];
};
export type Profile = {
  uri: string;
  name: string;
  image_url: string;
  followers_count: number;
  color: string;
};
export type DetailedProfile = Profile & {
  following_count: number;
  recently_played_artists: [];
  public_playlists: [];
  total_public_playlists_count: number;
  has_spotify_name: boolean;
  allow_follows: boolean;
  show_follows: boolean;
};
