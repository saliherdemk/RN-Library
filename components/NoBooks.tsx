import { View, Text } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import Container from "./Container";
export default function NoBooks({ text }: { text: string }) {
  return (
    <Container classList="items-center">
      <FontAwesome name="book" size={100} color="black" />
      <Text className="text-lg text-center">{text}</Text>
    </Container>
  );
}
