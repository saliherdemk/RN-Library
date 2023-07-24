import { View, Text } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router/src/LocationProvider";

const ShowProfile = () => {
  const { username } = useSearchParams();

  return (
    <View>
      <Text>Profile: {username}</Text>
    </View>
  );
};

export default ShowProfile;
