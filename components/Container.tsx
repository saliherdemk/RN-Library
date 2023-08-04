import React, { ReactNode } from "react";
import { View } from "react-native";

interface ContainerProps {
  children: ReactNode;
  classList?: string;
}

export default function Container({ children, classList }: ContainerProps) {
  return <View className={`flex-1 ${classList}`}>{children}</View>;
}
