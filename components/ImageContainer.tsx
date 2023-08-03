import { View, Text, Image } from "react-native";
import React from "react";

export default function ImageContainer({ uri }: { uri: string }) {
  return (
    <View className="w-28 h-28 rounded overflow-hidden mt-8 ">
      <Image
        source={{
          uri,
        }}
        className="w-full h-full  rounded"
        resizeMode="cover"
      />
    </View>
  );
}
