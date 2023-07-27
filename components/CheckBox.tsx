import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Checkbox({ title }: { title: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <View className="flex flex-row justify-center items-center m-3">
      <Text>{title}</Text>
      <Pressable
        className={`w-6 h-6 justify-center items-center border-2 ${
          checked ? "bg-sky-300" : "bg-white"
        } rounded`}
        onPress={() => setChecked(!checked)}
      >
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </Pressable>
    </View>
  );
}

export default Checkbox;
