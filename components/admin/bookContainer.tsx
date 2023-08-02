import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { removeBookFromBooks } from "../../redux/slicers/bookSlicer";
import BookService from "../../services/bookService";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { removeBookFromUserBooks } from "../../redux/slicers/userSlicer";
import { formatDate } from "../../helper/formatDate";

const BookContainer = ({
  book,
}: {
  book: {
    isbn: string;
    title: string;
    publisher: string;
    cover_url_suffix: string;
    created_at: string;
  };
}) => {
  const user = useAppSelector((state) => state.userData.user);

  const dispatch = useDispatch();

  const handleDeletion = () => {
    Alert.alert("Delete Book", "You can not undo this action", [
      {
        text: "Cancel",
        onPress: () => {
          return;
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const err = await BookService.deleteBook(
            book.isbn,
            book.cover_url_suffix
          );
          if (!err) {
            dispatch(removeBookFromBooks(book.isbn));
            book.publisher == user?.user_metadata.username &&
              dispatch(removeBookFromUserBooks(book.isbn));
          }
        },
      },
    ]);
  };
  return (
    <View className="bg-white p-4 mb-4">
      <Text className="text-center text-lg">{book.title}</Text>

      <Text className="text-center ">{book.isbn}</Text>
      <Text className="text-right ">published by {book.publisher}</Text>
      <Text className="text-right ">at {formatDate(book.created_at)}</Text>

      <TouchableOpacity
        onPress={handleDeletion}
        className="flex-1 bg-rose-500 p-3 rounded my-3"
      >
        <Text className="text-center text-white">Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookContainer;
