import { ViewStyle, View } from "react-native";
import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  classList?: string;
}

export default function Container({ children, classList }: ContainerProps) {
  return <View className={`flex-1 ${classList}`}>{children}</View>;
}
