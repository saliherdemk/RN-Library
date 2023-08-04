import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Text } from "react-native";
import Container from "./Container";

interface NoBooksProps {
  text: string;
  icon?: ReactNode;
}

export default function NoBooks({ text, icon }: NoBooksProps) {
  return (
    <Container classList="items-center">
      {icon ? (
        icon
      ) : (
        <MaterialCommunityIcons name="bookshelf" size={100} color="black" />
      )}
      <Text className="text-lg text-center">{text}</Text>
    </Container>
  );
}
