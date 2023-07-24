import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Profile = () => {
  return (
    <View>
      <Link href="/profile/1">1</Link>
      <Link href="/profile/2">2</Link>
      <Link href="/profile/3">3</Link>
    </View>
  );
};

export default Profile;
