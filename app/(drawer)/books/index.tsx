import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";

import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import FilterExpandable from "../../../components/FilterExpandable";
import { AppDispatch } from "../../../redux/store";
import { BookType } from "../../../types/bookTypes";

const Books = () => {
  const shownBooks = useAppSelector((state) => state.bookData.books);

  const [sortBy, setSortBy] = useState<keyof BookType | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>
      <FilterExpandable classes={isFilterOpen ? "max-h-96" : "max-h-0"} />
      <Button
        title="toggle"
        onPress={() => {
          setIsFilterOpen((curr) => !curr);
        }}
      />

      <ScrollView className=" p-5">
        {shownBooks.map((book) => (
          <BookComponent book={book} key={book.isbn} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Books;
