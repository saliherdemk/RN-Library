import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CheckBox from "../CheckBox";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { setAppliedFilter } from "../../redux/slicers/filterSlicer";

const FilterSection = () => {
  const typesArray = useAppSelector((state) => state.filtersData.types);
  const authorsArray = useAppSelector((state) => state.filtersData.authors);

  const appliedFilter = useAppSelector(
    (state) => state.filtersData.appliedFilters
  );

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

  return (
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
              <CheckBox
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
              <CheckBox
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
  );
};

export default FilterSection;
