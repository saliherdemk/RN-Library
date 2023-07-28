import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "./CheckBox";
import { Button } from "react-native-elements";
import { useAppSelector } from "../redux/hooks";

function FilterExpandable({ classes }: { classes: string }) {
  const typesArray = useAppSelector((state) => state.filtersData.types);
  const authorsArray = useAppSelector((state) => state.filtersData.authors);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [types, setTypes] = useState([]);
  const [authors, setAuthors] = useState([]);

  return (
    <View className={`overflow-hidden ${classes}  `}>
      <TextInput
        className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
        placeholderTextColor="#808080"
        placeholder="title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
        placeholderTextColor="#808080"
        placeholder="ISBN"
        value={isbn}
        onChangeText={(text) => setIsbn(text)}
      />
      <TextInput
        className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
        placeholderTextColor="#808080"
        placeholder="publisher"
        value={publisher}
        onChangeText={(text) => setPublisher(text)}
      />

      <ScrollView className="w-full my-3 rounded bg-white h-[550px]">
        <View className="flex flex-row flex-wrap">
          {typesArray.map((typeEl) => (
            <Checkbox title={typeEl.name} key={typeEl.name} />
          ))}
        </View>
      </ScrollView>

      <ScrollView className="w-full  my-3 rounded bg-white h-[550px]">
        <View className="flex flex-row flex-wrap">
          {authorsArray.map((authorEl) => (
            <Checkbox title={authorEl.name} key={authorEl.name} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default FilterExpandable;
