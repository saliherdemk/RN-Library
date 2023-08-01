import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";

import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import FilterExpandable from "../../../components/FilterExpandable";
import { filterBooks, sortBooks } from "../../../helper/filterSortHelpers";
import {
  resetAppliedFilter,
  setAppliedFilter,
} from "../../../redux/slicers/filterSlicer";
import { useRouter } from "expo-router";

const Books = () => {
  const books = useAppSelector((state) => state.bookData.books);
  const [shownBooks, setShownBooks] = useState(books);
  const appliedFilter = useAppSelector(
    (state) => state.filtersData.appliedFilters
  );

  const appliedSorts = useAppSelector(
    (state) => state.filtersData.appliedSorts
  );

  const [activeSort, setActiveSort] = useState("");
  const [activeFilters, setActiveFilters] = useState<Array<string>>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setShownBooks(books);
  }, [books]);

  useEffect(() => {
    setShownBooks(sortBooks(shownBooks, appliedSorts));
    let sortBy = appliedSorts.sortBy as string;
    let sortOrder = appliedSorts.sortOrder as string;

    if (sortBy) {
      setActiveSort(sortBy + "(" + sortOrder + ")");
    }
  }, [appliedSorts]);

  useEffect(() => {
    setShownBooks(filterBooks(books, appliedFilter));
    let newActiveFilters = [];
    for (let [key, value] of Object.entries(appliedFilter)) {
      if (value instanceof Array) {
        value.map((v) => {
          newActiveFilters.push(key + ":" + v);
        });
        continue;
      }
      if (value) {
        newActiveFilters.push(key + ":" + value);
      }
    }

    setActiveFilters(newActiveFilters);
  }, [appliedFilter]);

  const removeSort = useCallback(() => {
    dispatch(resetAppliedFilter());
    setActiveSort("");
  }, []);

  const removeFilter = (value: string) => {
    let splitted = value.split(":");
    const filterType = splitted[0];
    if (filterType == "types" || filterType == "authors") {
      dispatch(
        setAppliedFilter({
          ...appliedFilter,
          [splitted[0]]: appliedFilter[filterType].filter(
            (el) => el != splitted[1]
          ),
        })
      );
      return;
    }

    dispatch(
      setAppliedFilter({ ...appliedFilter, [splitted[0]]: splitted[1] })
    );
  };

  return (
    <SafeAreaView className="flex-1 px-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>
      <View className="px-5 flex-1">
        <FilterExpandable />
        <View className="flex flex-row flex-wrap gap-2 mt-1">
          {activeSort && (
            <TouchableOpacity
              onPress={removeSort}
              className="p-2 bg-white rounded flex-row items-end shadow-lg"
            >
              <Text className="mr-2">{activeSort}</Text>
              <AntDesign name="closecircleo" size={16} color="black" />
            </TouchableOpacity>
          )}

          {activeFilters.length &&
            activeFilters.map((el) => (
              <TouchableOpacity
                onPress={() => {
                  removeFilter(el);
                }}
                key={el}
                className="p-2 bg-white rounded flex-row items-end shadow-lg"
              >
                <Text className="mr-2">{el}</Text>
                <AntDesign name="closecircleo" size={16} color="black" />
              </TouchableOpacity>
            ))}
        </View>
        <ScrollView>
          {shownBooks.map((book) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "bookDetails/[isbn]",
                  params: { isbn: book.isbn },
                });
              }}
            >
              <BookComponent book={book} key={book.isbn} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Books;
