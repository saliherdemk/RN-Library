import React from "react";
import { Text } from "react-native";

interface HeaderProps {
  title: string;
  classList?: string;
}

export default function Header({ title, classList }: HeaderProps) {
  return (
    <Text className={`text-center text-2xl my-4 border-b-2 ${classList}`}>
      {title}
    </Text>
  );
}
