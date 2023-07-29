import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";

import { ScrollView } from "react-native-gesture-handler";
import FilterExpandable from "../../../components/FilterExpandable";
import { filterBooks, sortBooks } from "../../../helper/filterSortHelpers";
import { BookType } from "../../../types/bookTypes";
import { AppliedFilterType } from "../../../types/filters";
import { AntDesign } from "@expo/vector-icons";

const Books = () => {
  const books = useAppSelector((state) => state.bookData.books);
  const [shownBooks, setShownBooks] = useState(books);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilterType>({
    title: "",
    isbn: "",
    publisher: "",
    types: [],
    authors: [],
  });

  const [sortBy, setSortBy] = useState<keyof BookType | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [activeSort, setActiveSort] = useState("");
  const [activeFilters, setActiveFilters] = useState<Array<string>>([]);
  const [removeFilter, setRemoveFilter] = useState("");

  useEffect(() => {
    setShownBooks(sortBooks(shownBooks, sortBy, sortOrder));
    if (sortBy) {
      setActiveSort(sortBy + "(" + sortOrder + ")");
    }
  }, [sortBy, sortOrder]);

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

  const removeSort = () => {
    setSortBy(null);
    setSortOrder(null);
    setActiveSort("");
  };
  return (
    <SafeAreaView className="flex-1 px-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>
      <View className="px-5 flex-1">
        <FilterExpandable
          setAppliedFilter={setAppliedFilter}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          removeFilter={removeFilter}
        />
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
                  setRemoveFilter(el);
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
            <BookComponent book={book} key={book.isbn} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Books;
