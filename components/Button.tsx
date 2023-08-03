import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  title: string;
  onPress: any;
  classList?: string;
  isLoading?: boolean;
}

export default function Button({
  title,
  onPress,
  classList,
  isLoading = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full bg-blue-500 rounded py-2 ${classList}`}
    >
      {isLoading ? (
        <ActivityIndicator className="h-6" color="#f2f2f2" size={30} />
      ) : (
        <Text className="text-center text-white font-semibold text-base">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
