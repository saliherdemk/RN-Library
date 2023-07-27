import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../redux/hooks";
import BookComponent from "../../../components/BookComponent";
import BookService from "../../../services/bookService";
import { removeBookFromBooks } from "../../../redux/slicers/bookSlicer";
import { useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

const Books = () => {
  const books = useAppSelector((state) => state.bookData.books);

  return (
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>
      <ScrollView className=" p-5">
        {books.map((book) => (
          <BookComponent book={book} key={book.isbn} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Books;
