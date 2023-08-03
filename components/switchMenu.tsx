import { View, Pressable } from "react-native";
import React, { ReactNode } from "react";
import { Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";

interface MenuProps {
  switchValue: boolean;
  setSwitchValue: React.Dispatch<React.SetStateAction<boolean>>;
  iconLeft: ReactNode;
  iconRight: ReactNode;
  iconLeftDisabled?: boolean;
  iconRightDisabled?: boolean;
}

export default function SwitchMenu({
  switchValue,
  setSwitchValue,
  iconLeft,
  iconRight,
  iconLeftDisabled = false,
  iconRightDisabled = false,
}: MenuProps) {
  return (
    <View className="flex-row px-3 pt-0 my-2">
      <Pressable
        disabled={iconLeftDisabled}
        className={`${!switchValue && "border-t-2 "} flex-1 items-center pt-2`}
        onPress={() => setSwitchValue(false)}
      >
        {iconLeft}
      </Pressable>
      <Pressable
        disabled={iconRightDisabled}
        className={`${switchValue && "border-t-2 "} flex-1 items-center pt-2`}
        onPress={() => setSwitchValue(true)}
      >
        {iconRight}
      </Pressable>
    </View>
  );
}
