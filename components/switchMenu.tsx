import React, { ReactNode } from "react";
import { Pressable, View, Alert } from "react-native";

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
  const handleLeftPress = () => {
    iconLeftDisabled
      ? Alert.alert(
          "You don't have permission",
          "You are a moderator and you don't have permission for this."
        )
      : setSwitchValue(false);
  };
  return (
    <View className="flex-row px-3 pt-0 my-2">
      <Pressable
        className={`${!switchValue && "border-t-2 "} flex-1 items-center pt-2`}
        onPress={handleLeftPress}
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
