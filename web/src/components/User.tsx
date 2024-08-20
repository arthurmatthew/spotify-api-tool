import { useState } from "react";
import { Profile } from "../types";

interface IUser extends Profile {
  getFollowers: (profile: Profile) => Promise<void>;
}

export const User = ({
  uri,
  image_url,
  name,
  followers_count,
  getFollowers,
  followerOf,
  color,
  checked,
}: IUser) => {
  const username = uri.slice(13); // cut off spotify:user:
  const link = `https://open.spotify.com/user/${username}`;

  const [showTrail, setShowTrail] = useState(false);

  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-2">
      <div className="flex flex-col gap-1 text-xs">
        <p onClick={() => setShowTrail((showing) => !showing)}>
          {!followerOf?.length ? "" : "Follower of..."}
        </p>
        {showTrail &&
          followerOf?.map((user) => (
            <a href={`https://open.spotify.com/user/${user.uri.slice(13)}`}>
              {user.name}
            </a>
          ))}
      </div>

      <div className="flex items-center gap-2">
        <div>
          {image_url ? (
            <img
              className="aspect-square w-6 overflow-hidden rounded-full"
              src={image_url}
            />
          ) : (
            <div className="flex aspect-square w-6 items-center justify-center rounded-full bg-gray-500">
              <span className="font-black">?</span>
            </div>
          )}
        </div>
        <a href={link}>{name}</a>
      </div>
      <p
        className={`cursor-pointer ${checked ? "opacity-50" : "underline"}`}
        onClick={() => {
          if (!checked)
            getFollowers({
              ...{
                uri,
                image_url,
                name,
                followers_count,
                followerOf,
                color,
                checked,
              },
            });
        }}
      >
        Followers: {followers_count}
      </p>
    </div>
  );
};
