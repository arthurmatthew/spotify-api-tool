import { useEffect, useState } from "react";
import { TokenObject } from "../types";

export const AuthenticationPane = () => {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenObject | undefined>();

  useEffect(() => {
    const storedToken = localStorage.getItem("token-object");

    if (storedToken) {
      setTokens(JSON.parse(storedToken));
    }
  }, []);

  const authHandler = async () => {
    setLoading(true);
    const authRequest = await fetch("http://localhost:3000/auth").catch(() => {
      setLoading(false);
    });

    if (!authRequest) return setLoading(false);
    if (!authRequest.ok) return setLoading(false);

    const tokenObject = (await authRequest.json()) as TokenObject;

    if (tokenObject.accessTokenData === undefined) return setLoading(false);
    if (tokenObject.clientTokenData === undefined) return setLoading(false);

    console.log(tokenObject);

    setTokens(tokenObject);

    localStorage.setItem("token-object", JSON.stringify(tokenObject));

    setLoading(false);
  };

  const tokenRemoveHandler = () => {
    setTokens(undefined);
    localStorage.removeItem("token-object");
  };

  return (
    <div>
      <form className="flex items-center gap-2">
        <h1>
          {tokens?.accessTokenData.accessToken &&
          tokens.clientTokenData.granted_token.token
            ? "Tokens Loaded"
            : "Tokens Unloaded"}
        </h1>
        <button
          className="bg-gray-200 px-4 py-2"
          onClick={(e) => {
            e.preventDefault();
            authHandler();
          }}
        >
          {loading ? "Loading" : "Get Tokens"}
        </button>
        <button
          className="bg-gray-200 px-4 py-2"
          onClick={(e) => {
            e.preventDefault();
            tokenRemoveHandler();
          }}
        >
          {"Remove Tokens"}
        </button>
      </form>
    </div>
  );
};
