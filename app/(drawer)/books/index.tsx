import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";

import { ScrollView } from "react-native-gesture-handler";
import FilterExpandable from "../../../components/FilterExpandable";
import { filterBooks, sortBooks } from "../../../helper/filterSortHelpers";
import { BookType } from "../../../types/bookTypes";
import { AppliedFilterType } from "../../../types/filters";

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

  useEffect(() => {
    setShownBooks(sortBooks(shownBooks, sortBy, sortOrder));
  }, [sortBy, sortOrder]);

  useEffect(() => {
    setShownBooks(filterBooks(books, appliedFilter));
  }, [appliedFilter]);

  return (
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>

      <FilterExpandable
        setAppliedFilter={setAppliedFilter}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
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
