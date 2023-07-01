import React, { useState, useEffect } from "react";
import assets from "./assets";
import "./LanyardProfile.css";

const API_URL = "https://api.lanyard.rest/v1";
const USERID = "1025214794766221384";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  bot: boolean;
  global_name: string | null;
  avatar_decoration: null | string; // Update the type accordingly
  display_name: string | null;
  public_flags: number;
}

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  created_at?: number;
}

interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  album: string;
  album_art_url: string;
  artist: string;
  song: string;
}

interface LanyardData {
  spotify: SpotifyData | null;
  discord_user: DiscordUser;
  activities: Activity[];
  discord_status: string;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
}

interface ProfileData {
  avatar: string;
  discordStatus: string;
  username: string;
  status: string;
  activity: {
    hidden: boolean;
    bigImage?: string;
    bigImageTitle?: string;
    smallImage?: string;
    name?: string;
    state?: string;
    details?: string;
  };
}

const LanyardProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: assets.loader,
    discordStatus: "",
    username: "",
    status: "",
    activity: {
      hidden: true,
      bigImage: "",
      smallImage: "",
      name: "",
      state: "",
      details: "",
    },
  });

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${USERID}`);
      const { data }: { data: LanyardData } = await res.json();

      const { discord_user, discord_status, activities, spotify } = data;
      const currentActivity = activities.find(
        (activity) => activity.type !== 4
      );

      const currentData: ProfileData = {
        avatar: `https://cdn.discordapp.com/avatars/${USERID}/${discord_user.avatar}`,
        discordStatus: discord_status,
        username: `@${discord_user.username}`,
        status:
          discord_status !== "offline"
            ? `Status: "${currentActivity?.state || ""}"`
            : "",
        activity: {
          hidden: discord_status === "offline",
          bigImage: currentActivity?.assets?.large_image?.includes("spotify") ? spotify?.album_art_url! :  "",
          bigImageTitle: currentActivity?.assets?.large_image?.includes("spotify") ? spotify?.album : "",
          smallImage: "",
          name: currentActivity?.name || "doing yo moma",
          state: currentActivity?.state || "",
          details: currentActivity?.details || "",
        }
      }
      if (currentActivity?.assets?.large_image && !currentActivity?.assets?.large_image?.includes("spotify"))
        currentData.activity.bigImage = currentActivity?.assets?.large_image.includes("external")
          ? `https://media.discordapp.net/external/${currentActivity?.assets?.large_image.split(
            "mp:external/"
          )[1]
          }`
          : `https://cdn.discordapp.com/app-assets/${currentActivity?.application_id}/${currentActivity?.assets?.large_image}.png`;
      if (currentActivity?.assets?.small_image || !currentActivity?.assets?.large_image?.includes("spotify"))
        currentData.activity.smallImage = currentActivity?.assets?.small_image?.includes("external")
          ? `https://media.discordapp.net/external/${currentActivity?.assets?.small_image?.split(
            "mp:external/"
          )[1]
          }`
          : `https://cdn.discordapp.com/app-assets/${currentActivity?.application_id}/${currentActivity?.assets?.small_image}.png`
      setProfileData((prevData) => ({
        ...prevData,
        ...currentData
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(fetchUserData, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getStatusStyles = () => {
    const { discordStatus } = profileData;
    switch (discordStatus) {
      case "online":
        return {
          background: "#3ba45d",
          title: "Online",
          color: "#3ba45d",
          opacity: 1,
        };
      case "dnd":
        return {
          background: "#ed4245",
          title: "Do not disturb",
          color: "#ed4245",
          opacity: 1,
        };
      case "idle":
        return {
          background: "#faa81a",
          title: "Idle",
          color: "#faa81a",
          opacity: 1,
        };
      case "offline":
        return {
          background: "#747e8c",
          title: "Offline",
          color: "unset",
          opacity: 0.5,
        };
      default:
        return {};
    }
  };

  const { avatar, discordStatus, username, status, activity } = profileData;

  return (
    <div className="wrapper">
      <div className="card">
        <div className="card-title">@loneweeb &gt; home</div>
        <div className="user-profile">
          <div className="profile-pic">
            <img id="pfp" src={avatar} alt="" />
            <div
              id="status-dot"
              aria-label={discordStatus}
              style={getStatusStyles()}
            ></div>
          </div>
          <div className="user-info">
            <div id="username">{username}</div>
            <div id="status">{status}</div>
            <div id="status2">
              {discordStatus !== "offline" ? discordStatus : "unknown"}
            </div>
            <div className="connections">{/* Connections */}</div>
          </div>
        </div>
      </div>
      <div className={`activity card ${activity.hidden ? "hidden" : ""}`}>
        <div className="card-title">@loneweeb &gt; activity</div>
        <div className="activity-wrapper">
          <div className="activity-images">
            <img id="activity-big-image" className={`${!activity.bigImage ? "hidden" : ""}`} src={activity.bigImage} alt="" />
            <img id="activity-small-image" className={`${!activity.smallImage ? "hidden" : ""}`} src={activity.smallImage} alt="" />
          </div>
          <div className="activity-info">
            <div id="activity-name" className={`${!activity.name ? "hidden" : ""}`}>{activity.name}</div>
            <div id="activity-state" className={`${!activity.state ? "hidden" : ""}`}>{activity.state}</div>
            <div id="activity-detail" className={`${!activity.details ? "hidden" : ""}`}>{activity.details}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">@loneweeb &gt; about me</div>
        <div className="about-me">
          <header className="heading">about me</header>
          <div className="bio">
            <ul>
              <li>ϡ 17 years old</li>
              <li>ϡ straight male</li>
              <li>ϡ looking for my soulmate</li>
              <li>ϡ indian</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanyardProfile;