import { useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "./CheckBox";
import { Button } from "react-native-elements";

function FilterExpandable({ classes }: { classes: string }) {
  return (
    <View className={`overflow-hidden ${classes}  `}>
      <TextInput
        className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
        placeholderTextColor="#808080"
        placeholder="title"
      />
      <TextInput
        className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
        placeholderTextColor="#808080"
        placeholder="ISBN"
      />

      <View className="w-full flex flex-row flex-wrap my-3 rounded bg-white justify-center">
        <Checkbox title="Type1" />
        <Checkbox title="Type1" />
        <Checkbox title="Type1" />
        <Checkbox title="Type1" />
        <Checkbox title="Type1" />
        <Checkbox title="Type1" />
      </View>

      <View className="w-full flex flex-row flex-wrap bg-white rounded justify-center">
        <Checkbox title="Author1" />
        <Checkbox title="Author1" />
        <Checkbox title="Author1" />
        <Checkbox title="Author1" />
        <Checkbox title="Author1" />

        <Checkbox title="Author1" />
      </View>
    </View>
  );
}

export default FilterExpandable;
