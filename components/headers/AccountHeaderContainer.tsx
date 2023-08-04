import React from "react";
import { Text } from "react-native";

export default function AccountHeaderContainer({ title }: { title: string }) {
  return (
    <Text className="text-xl font-semibold my-1  text-center">{title}</Text>
  );
}
