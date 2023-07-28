import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";

import { Button } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import FilterExpandable from "../../../components/FilterExpandable";
import { AppDispatch } from "../../../redux/store";
import { BookType } from "../../../types/bookTypes";
import { AppliedFilterType } from "../../../types/filters";
import { MaterialIcons } from "@expo/vector-icons";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const { isbn, title, publisher, types, authors } = appliedFilter;

    if (!(isbn || title || publisher || types.length || authors.length)) {
      setShownBooks(books);
      return;
    }
    console.log(authors);
    if (isbn) {
      setShownBooks(books.filter((book) => book.isbn == isbn));
    }

    if (title) {
      setShownBooks(books.filter((book) => book.title.includes(title)));
    }

    if (publisher) {
      setShownBooks(books.filter((book) => book.publisher == publisher));
    }

    if (types.length) {
      setShownBooks(
        books.filter((book) => {
          if (types.includes(book.type)) {
            return book;
          }
        })
      );
    }

    if (authors.length) {
      setShownBooks(
        books.filter((book) => {
          if (authors.every((author) => book.authors.includes(author))) {
            return book;
          }
        })
      );
    }
  }, [appliedFilter]);

  return (
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>

      <FilterExpandable
        classes={isFilterOpen ? "max-h-[500px]" : "max-h-0"}
        setAppliedFilter={setAppliedFilter}
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
