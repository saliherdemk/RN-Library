import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { BookType } from "../../types/bookTypes";
import { useDispatch } from "react-redux";
import { setAppliedSorts } from "../../redux/slicers/filterSlicer";

const SortSection = () => {
  const [selectedSort, setSelectedSort] = useState({
    sortBy: "created_at" as keyof BookType,
    sortOrder: "asc",
  });
  const dispatch = useDispatch();

  const applySort = () => {
    dispatch(setAppliedSorts(selectedSort));
  };

  return (
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
  );
};

export default SortSection;
