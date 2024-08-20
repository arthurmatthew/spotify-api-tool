export type TokenObject = {
  clientTokenData: {
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
        },
      ];
    };
  };
  accessTokenData: {
    accessToken: string;
    accessTokenExpirationTimestampMs: number;
    isAnonymous: boolean;
    clientId: string;
  };
};
export type Profile = {
  uri: string;
  name: string;
  image_url: string;
  followers_count: number;
  color: string;
  checked: boolean;
  followerOf?: Profile[];
};
