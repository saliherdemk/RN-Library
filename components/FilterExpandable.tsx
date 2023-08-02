import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { memo, useEffect, useState } from "react";
import {
  Pressable,
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
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import {
  setAppliedFilter,
  setAppliedSorts,
} from "../redux/slicers/filterSlicer";
import { BookType } from "../types/bookTypes";
import Checkbox from "./CheckBox";

export default memo(function FilterExpandable() {
  const typesArray = useAppSelector((state) => state.filtersData.types);
  const authorsArray = useAppSelector((state) => state.filtersData.authors);
  const appliedFilter = useAppSelector(
    (state) => state.filtersData.appliedFilters
  );

  const [selectedSort, setSelectedSort] = useState({
    sortBy: "created_at" as keyof BookType,
    sortOrder: "asc",
  });

  const [selectedFilters, setSelectedFilters] = useState({
    title: appliedFilter.title,
    isbn: appliedFilter.isbn,
    publisher: appliedFilter.publisher,
  });

  const [selectedTypes, setSelectedTypes] = useState<Array<string>>(
    appliedFilter.types
  );
  const [selectedAuthors, setSelectedAuthors] = useState<Array<string>>(
    appliedFilter.authors
  );
  const [collapsed, setCollapsed] = useState(true);

  const [maxHeight, setMaxHeight] = useState(30);

  const [isFilterShown, setIsFilterShown] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedFilters({
      title: appliedFilter.title,
      isbn: appliedFilter.isbn,
      publisher: appliedFilter.publisher,
    });
    setSelectedTypes(appliedFilter.types);
    setSelectedAuthors(appliedFilter.authors);
  }, [appliedFilter]);

  const applyFilter = () => {
    dispatch(
      setAppliedFilter({
        ...selectedFilters,
        authors: selectedAuthors,
        types: selectedTypes,
      })
    );
  };

  const applySort = () => {
    dispatch(setAppliedSorts(selectedSort));
  };

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
          {isFilterShown ? (
            <>
              <TextInput
                className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
                placeholderTextColor="#808080"
                placeholder="title"
                value={selectedFilters.title}
                onChangeText={(text) =>
                  setSelectedFilters((curr) => ({ ...curr, title: text }))
                }
              />
              <TextInput
                className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
                placeholderTextColor="#808080"
                placeholder="ISBN"
                value={selectedFilters.isbn}
                onChangeText={(text) =>
                  setSelectedFilters((curr) => ({ ...curr, isbn: text }))
                }
              />
              <TextInput
                className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
                placeholderTextColor="#808080"
                placeholder="publisher"
                value={selectedFilters.publisher}
                onChangeText={(text) =>
                  setSelectedFilters((curr) => ({ ...curr, publisher: text }))
                }
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
                        setValues={setSelectedTypes}
                        initialValue={selectedTypes.includes(typeEl.name)}
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
                        setValues={setSelectedAuthors}
                        initialValue={selectedAuthors.includes(authorEl.name)}
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
            </>
          ) : (
            <View className="p-3">
              <Text className="text-center text-lg border-b-2 border-gray-400">
                Sort By
              </Text>
              <Picker
                selectedValue={selectedSort.sortBy}
                onValueChange={(itemValue) =>
                  setSelectedSort((prevState) => ({
                    ...prevState,
                    sortBy: itemValue,
                  }))
                }
              >
                <Picker.Item label="Created Date" value="created_at" />
                <Picker.Item label="Title" value="title" />
                <Picker.Item label="ISBN" value="isbn" />
                <Picker.Item label="Publisher" value="publisher" />
              </Picker>
              <Text className="text-center text-lg border-b-2 border-gray-400">
                Sort Order
              </Text>

              <Picker
                selectedValue={selectedSort.sortOrder}
                onValueChange={(itemValue) =>
                  setSelectedSort((prevState) => ({
                    ...prevState,
                    sortOrder: itemValue,
                  }))
                }
              >
                <Picker.Item label="Ascending" value="asc" />
                <Picker.Item label="Descending" value="desc" />
              </Picker>
              <TouchableOpacity
                className="w-full bg-green-500 rounded py-2 my-2"
                onPress={applySort}
              >
                <Text className="text-center text-white text-semi-bold text-md">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});
