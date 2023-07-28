import { useSearchParams } from "expo-router/src/LocationProvider";
import React from "react";
import { Text } from "react-native";
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
