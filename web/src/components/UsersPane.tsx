import { useState } from "react";
import { Profile, TokenObject } from "../types";
import { User } from "./User";

export const UsersPane = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const getUser = async (username: string) => {
    setLoading(true);
    const tokenObject = JSON.parse(
      localStorage.getItem("token-object") || "null",
    ) as TokenObject | null;

    if (tokenObject) {
      const accessToken = tokenObject.accessTokenData.accessToken;
      const clientToken = tokenObject.clientTokenData.granted_token.token;

      const userRequest = await fetch(
        `http://localhost:3000/user?username=${username}`,
        {
          headers: {
            "access-token": accessToken,
            "client-token": clientToken,
          },
        },
      ).catch(() => {
        setLoading(false);
      });

      if (!userRequest) return setLoading(false);
      if (!userRequest.ok) return setLoading(false);

      const parsedUser = (await userRequest.json()) as Profile;

      setUsers((previousUsers) => [
        ...previousUsers,
        { ...parsedUser, checked: false },
      ]);
      setLoading(false);
    }

    setLoading(false);
  };

  const getFollowers = async (profile: Profile) => {
    setLoading(true);
    const tokenObject = JSON.parse(
      localStorage.getItem("token-object") || "null",
    ) as TokenObject | null;

    const username = profile.uri.slice(13);

    if (tokenObject) {
      const accessToken = tokenObject.accessTokenData.accessToken;
      const clientToken = tokenObject.clientTokenData.granted_token.token;

      const followersRequest = await fetch(
        `http://localhost:3000/followers?username=${username}`,
        {
          headers: {
            "access-token": accessToken,
            "client-token": clientToken,
          },
        },
      ).catch(() => {
        setLoading(false);
      });

      if (!followersRequest) return setLoading(false);
      if (!followersRequest.ok) return setLoading(false);

      const parsedUsers = (await followersRequest.json()) as {
        profiles: Profile[];
      };

      const usersWithTrailAndChecked: Profile[] = parsedUsers.profiles.map(
        (p) => {
          return {
            ...p,
            checked: false,
            followerOf: [...(p.followerOf || []), profile],
          };
        },
      );

      const updatedCheckedProfile = {
        ...profile,
        checked: true,
      };

      setUsers((previousUsers) => [
        ...previousUsers.filter((u) => u.uri !== profile.uri),
        updatedCheckedProfile,
        ...usersWithTrailAndChecked,
      ]);
      setLoading(false);
    }

    setLoading(false);
  };

  const clearUsers = () => {
    setUsers([]);
  };

  const flattenUsers = (users: Profile[]) => {
    const uris = new Map<string, Profile>();

    users.forEach((user) => {
      if (uris.has(user.uri)) {
        const existingProfile = uris.get(user.uri)!;
        const combinedFollowerOf = Array.from(
          new Map(
            [
              ...(existingProfile.followerOf || []),
              ...(user.followerOf || []),
            ].map((user) => [user.uri, user]),
          ).values(),
        );

        const isUserChecked = existingProfile.checked || user.checked;

        uris.set(user.uri, {
          ...existingProfile,
          followerOf: combinedFollowerOf,
          checked: isUserChecked,
        });
      } else {
        uris.set(user.uri, { ...user });
      }
    });

    return Array.from(uris.values());
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-200 p-6">
      <form className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          type="text"
          placeholder="Spotify Username"
          className="bg-gray-100 px-4 py-2"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            getUser(username);
          }}
          className="bg-gray-100 px-4 py-2"
        >
          {loading ? "Loading" : "Get User"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            clearUsers();
          }}
          className="bg-gray-100 px-4 py-2"
        >
          Clear Users
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {users.length === 0
          ? "Nothing yet"
          : flattenUsers(users)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((user) => (
                <User {...user} key={user.uri} getFollowers={getFollowers} />
              ))}
      </div>
    </div>
  );
};
