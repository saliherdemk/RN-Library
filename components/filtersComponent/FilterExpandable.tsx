import { MaterialIcons } from "@expo/vector-icons";
import { memo, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import FilterSection from "./FilterSection";
import SortSection from "./SortSection";

const FilterExpandable = () => {
  const [collapsed, setCollapsed] = useState(true);

  const [maxHeight, setMaxHeight] = useState(30);

  const [isFilterShown, setIsFilterShown] = useState(true);

  const style = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(maxHeight, {
        duration: 300,
        easing: Easing.ease,
      }),
    };
  });

  return (
    <Animated.View style={style} className="overflow-hidden max-h">
      <View className="h-8 flex justify-between items-end ">
        <TouchableOpacity
          onPress={() => {
            setCollapsed((curr) => !curr);
            if (collapsed) {
              setMaxHeight(600);
              return;
            }
            setMaxHeight(30);
          }}
          className="bg-white rounded-lg border-2"
        >
          {collapsed ? (
            <MaterialIcons name="expand-more" size={24} color="black" />
          ) : (
            <MaterialIcons name="expand-less" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
      {!collapsed && (
        <View className="rounded-b-lg">
          <View className="flex-row justify-around">
            <Pressable
              onPress={() => {
                setIsFilterShown(false);
              }}
              className={`py-2 flex-1 rounded-t-lg ${
                !isFilterShown && "bg-white"
              }`}
            >
              <Text
                className={`font-semibold text-center text-zinc-400 ${
                  !isFilterShown && "text-black"
                }`}
              >
                Sort
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsFilterShown(true);
              }}
              className={`py-2 flex-1 rounded-t-lg ${
                isFilterShown && "bg-white"
              }`}
            >
              <Text
                className={`font-semibold text-center text-zinc-400 ${
                  isFilterShown && "text-black"
                }`}
              >
                Filter
              </Text>
            </Pressable>
          </View>
          <View className="bg-white px-3">
            {isFilterShown ? <FilterSection /> : <SortSection />}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default memo(FilterExpandable);
