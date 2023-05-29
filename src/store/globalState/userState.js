import React, { useState } from "react";
import useLocalStorage from "../../helpers/useLocalStorage";

export const UserState = () => {
  const [profile, setProfile] = useLocalStorage("@userKey", {});
  return {
    profile,
    setProfile,
  };
};
