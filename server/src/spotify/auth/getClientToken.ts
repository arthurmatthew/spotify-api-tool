import { AccessTokenObject, ClientTokenObject } from "../../types";
import { genRandomAlphanumeric } from "../../util/genRandomAlphanumeric";
import { log2 } from "../../util/log2";
import { headers } from "../headers";

export const getClientToken = async (accessTokenObject: AccessTokenObject) => {
  const clientTokenEndpoint = "https://clienttoken.spotify.com/v1/clienttoken";
  const deviceId = genRandomAlphanumeric(32);
  const clientId = accessTokenObject.clientId;

  const clientTokenData = await fetch(clientTokenEndpoint, {
    headers: {
      ...headers,
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
    },
    body: `{"client_data":{"client_version":"1.2.45.254.g74c8e3c5","client_id":"${clientId}","js_sdk_data":{"device_brand":"unknown","device_model":"unknown","os":"windows","os_version":"NT 10.0","device_id":"${deviceId}","device_type":"computer"}}}`,
    method: "POST",
  });

  if (!clientTokenData.ok) return undefined;

  log2("Successfully retrieved client token");

  const clientTokenObject = (await clientTokenData.json()) as ClientTokenObject;

  if (clientTokenObject.granted_token === undefined) return undefined;
  if (clientTokenObject.response_type === undefined) return undefined;

  if (clientTokenObject) return clientTokenObject;
};
