import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BookComponent from "../../../components/BookComponent";
import FilterExpandable from "../../../components/FilterExpandable";
import { filterBooks, sortBooks } from "../../../helper/filterSortHelpers";
import { useAppSelector } from "../../../redux/hooks";
import {
  resetAppliedSorts,
  setAppliedFilter,
} from "../../../redux/slicers/filterSlicer";
import { BookType } from "../../../types/bookTypes";

const Books = () => {
  const books = useAppSelector((state) => state.bookData.books);
  const [shownBooks, setShownBooks] = useState<Array<BookType> | null>(null);
  const appliedFilter = useAppSelector(
    (state) => state.filtersData.appliedFilters
  );

  const appliedSorts = useAppSelector(
    (state) => state.filtersData.appliedSorts
  );

  const [activeSort, setActiveSort] = useState("");
  const [activeFilters, setActiveFilters] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const goDetail = (isbn: string) => {
    router.push({
      pathname: "bookDetails/[isbn]",
      params: { isbn },
    });
  };

  const renderItem = ({ item }: { item: BookType }) => (
    <TouchableOpacity
      onPress={() => {
        goDetail(item.isbn);
      }}
    >
      <BookComponent book={item} key={item.isbn} />
    </TouchableOpacity>
  );
  const keyExtractor = (item: BookType) => item.isbn;

  useEffect(() => {
    setShownBooks(books);
    setIsLoading(false);
  }, [books]);

  useEffect(() => {
    shownBooks && setShownBooks(sortBooks(shownBooks, appliedSorts));
    let sortBy = appliedSorts.sortBy as string;

    if (sortBy) {
      setActiveSort(sortBy + "(" + appliedSorts.sortOrder + ")");
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
      value && newActiveFilters.push(key + ":" + value);
    }

    setActiveFilters(newActiveFilters);
  }, [appliedFilter]);

  const removeSort = useCallback(() => {
    dispatch(resetAppliedSorts());
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

    dispatch(setAppliedFilter({ ...appliedFilter, [splitted[0]]: "" }));
  };

  return (
    <SafeAreaView className="flex-1 px-4 pb-0">
      {isLoading ? (
        <View className="w-full h-full justify-center">
          <ActivityIndicator size={36} />
        </View>
      ) : (
        <>
          <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>
          <View className="flex-1">
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
            <FlatList
              data={shownBooks}
              className="px-3"
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Books;
