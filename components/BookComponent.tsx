import React from "react";
import { Image, Text, View } from "react-native";
import { formatDate } from "../helper/formatDate";
import { BookType } from "../types/bookTypes";

const BookComponent = ({ book }: { book: BookType }) => {
  return (
    <View className="w-full mt-4 flex items-center bg-white shadow rounded-lg ">
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
            {book.authors.map((author: string, index: number) => (
              <Text key={author}>
                {author}
                {index !== book.authors.length - 2 && <Text>,</Text>}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <Text className="self-end text-gray-600 m-2">
        published by {book.publisher}
      </Text>
    </View>
  );
};

export default BookComponent;
