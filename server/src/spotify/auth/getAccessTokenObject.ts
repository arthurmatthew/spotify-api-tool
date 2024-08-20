import { AccessTokenObject } from "../../types";
import { log2 } from "../../util/log2";

export const getAccessTokenObject = async () => {
  const tokenContainingWebpage = await fetch("https://open.spotify.com/");

  if (!tokenContainingWebpage.ok) return undefined;
  log2("Received site data");

  const tokenWebpageHtml = await tokenContainingWebpage.text();

  const tokenRegex =
    /<script id="session" data-testid="session" type="application\/json">(.+?)<\/script>/;
  const sessionObjectMatch = tokenWebpageHtml.match(tokenRegex);

  if (sessionObjectMatch && sessionObjectMatch[1]) {
    log2("Located the session script");
    const sessionObject = JSON.parse(sessionObjectMatch[1]);
    return sessionObject as AccessTokenObject;
  } else {
    log2("Unable to properly read the website's data");
    return undefined;
  }
};
