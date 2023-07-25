import { View, Text } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router/src/LocationProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const ShowProfile = () => {
  const { username } = useSearchParams();

  return (
    <SafeAreaView>
      <Text>Profile: {username}</Text>
    </SafeAreaView>
  );
};

export default ShowProfile;
