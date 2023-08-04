import React from "react";
import { Text } from "react-native";

export default function ShowError({ err }: { err: string }) {
  return <Text className="text-rose-500 text-center">{err}</Text>;
}
