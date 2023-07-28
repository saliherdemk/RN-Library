import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAppSelector } from "../redux/hooks";
import { AppliedFilterType } from "../types/filters";
import Checkbox from "./CheckBox";

function FilterExpandable({
  classes,
  setAppliedFilter,
}: {
  classes: string;
  setAppliedFilter: React.Dispatch<React.SetStateAction<AppliedFilterType>>;
}) {
  const typesArray = useAppSelector((state) => state.filtersData.types);
  const authorsArray = useAppSelector((state) => state.filtersData.authors);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [types, setTypes] = useState<Array<string>>([]);
  const [authors, setAuthors] = useState<Array<string>>([]);
  const [collapsed, setCollapsed] = useState(true);

  const [maxHeight, setMaxHeight] = useState(40);

  const applyFilter = () => {
    setAppliedFilter({
      title,
      isbn,
      publisher,
      types,
      authors,
    });
  };

  const config = {
    duration: 300,
    easing: Easing.ease,
  };

  const style = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(maxHeight, config),
    };
  });

  return (
    <Animated.View
      style={style}
      className={`overflow-hidden border-2 border-gray-200  px-3 bg-white max-h`}
    >
      <View className="h-8 flex flex-row justify-between items-center px-2">
        <View>
          <Text>Sort</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setCollapsed((curr) => !curr);
            if (collapsed) {
              setMaxHeight(600);
            } else {
              setMaxHeight(40);
            }
          }}
          className="border-gray-200 bg-white rounded-lg border-2"
        >
          {collapsed ? (
            <MaterialIcons name="expand-less" size={24} color="black" />
          ) : (
            <MaterialIcons name="expand-more" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

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
      <View className="bg-white my-3">
        <Text className="text-center text-lg border-b-2 border-gray-400">
          Types
        </Text>
        <ScrollView className="max-h-24 border-b-2 border-gray-300">
          <View className="flex flex-row flex-wrap">
            {typesArray.map((typeEl) => (
              <Checkbox
                title={typeEl.name}
                key={typeEl.name}
                setValues={setTypes}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <View className="bg-white mb-3 rounded shadow">
        <Text className="text-center text-lg border-gray-400 border-b-2">
          Authors
        </Text>

        <ScrollView className="max-h-24 border-b-2 border-gray-300">
          <View className="flex flex-row flex-wrap">
            {authorsArray.map((authorEl) => (
              <Checkbox
                title={authorEl.name}
                key={authorEl.name}
                setValues={setAuthors}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        className="w-full bg-green-500 rounded py-2 my-2"
        onPress={applyFilter}
      >
        <Text className="text-center text-white text-semi-bold text-md">
          Apply
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default FilterExpandable;
