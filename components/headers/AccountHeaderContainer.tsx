import { View, Text } from "react-native";
import React from "react";

export default function AccountHeaderContainer({ title }: { title: string }) {
  return (
    <Text className="text-xl font-semibold my-1  text-center">{title}</Text>
  );
}
