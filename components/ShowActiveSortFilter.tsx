import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { filterBooks, sortBooks } from "../helper/filterSortHelpers";
import { useAppSelector } from "../redux/hooks";
import {
  resetAppliedSorts,
  setAppliedFilter,
} from "../redux/slicers/filterSlicer";
import { BookType } from "../types/bookTypes";

export default function ShowActiveSortFilter({
  shownBooks,
  setShownBooks,
}: {
  shownBooks: Array<BookType> | null;
  setShownBooks: React.Dispatch<React.SetStateAction<BookType[] | null>>;
}) {
  const books = useAppSelector((state) => state.bookData.books);

  const [activeSort, setActiveSort] = useState("");
  const [activeFilters, setActiveFilters] = useState<Array<string>>([]);
  const dispatch = useDispatch();
  const appliedFilter = useAppSelector(
    (state) => state.filtersData.appliedFilters
  );

  const appliedSorts = useAppSelector(
    (state) => state.filtersData.appliedSorts
  );

  const removeSort = useCallback(() => {
    dispatch(resetAppliedSorts());
    setActiveSort("");
  }, []);

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
  );
}
