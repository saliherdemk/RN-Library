import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { formatDate } from "../helper/formatDate";
import { Button } from "react-native-elements";
import BookService from "../services/bookService";
import { BookType, AuthBook } from "../types/bookTypes";

const BookComponent = ({ book }: { book: BookType }) => {
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
        onPress: () => {
          BookService.deleteBook(book.isbn);
        },
      },
    ]);
  };
  return (
    <View className="w-full mb-4 flex items-center bg-white shadow rounded ">
      <View className="w-28 h-28 rounded-full overflow-hidden mt-2 ">
        <Image
          source={require("../assets/cover_placeholder.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="absolute left-2 top-2">
        <Text className="text-xs italic text-gray-500">
          {formatDate(book.created_at)}
        </Text>
      </View>
      <View className="text-center  flex items-center w-full">
        <Text className="font-semibold text-lg">{book.title}</Text>
        <Text className="italic text-gray-500">{book.type}</Text>
        <View className="flex flex-row">
          <Text className="text-gray-600">by </Text>
          <View>
            {book.AuthorBook.map((el: AuthBook, index: number) => (
              <Text key={el.id}>
                {el.author}
                {index !== book.AuthorBook.length - 2 && <Text>,</Text>}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <Text className="self-end text-gray-600 m-2">
        published by {book.users.username}
      </Text>
      <View className="flex flex-row w-full justify-center ">
        <TouchableOpacity
          onPress={handleDeletion}
          className="flex-1 bg-rose-500 rounded-bl py-2"
        >
          <Text className="text-center text-white font-semibold text-base">
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-blue-500 rounded-br py-2">
          <Text className="text-center text-white font-semibold text-base">
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookComponent;
