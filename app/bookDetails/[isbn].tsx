import { Stack } from "expo-router";
import { useSearchParams } from "expo-router/src/LocationProvider";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookService from "../../services/bookService";
import { BookType } from "../../types/bookTypes";
import { COVER_URL_PREFIX } from "../../helper/coverUrlPrefix";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "../../helper/formatDate";

const BookDetails = () => {
  const { isbn } = useSearchParams();
  const [book, setBook] = useState<BookType | null>(null);

  const fetchBook = async (isbn: string) => {
    const bookData = await BookService.getBookByISBN(isbn);
    setBook(bookData);
    console.log(book);
  };

  useEffect(() => {
    // @ts-expect-error
    isbn && fetchBook(isbn);
  }, [isbn]);

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerTitle: isbn as string,
          headerShown: true,
          presentation: "modal",
        }}
      />
      {book && (
        <View className="flex-1 items-center px-8">
          <View className="w-28 h-28">
            <Image
              source={{
                uri: COVER_URL_PREFIX + book.cover_url_suffix,
              }}
              className="w-full h-full  rounded"
              resizeMode="cover"
            />
          </View>
          <Text className="text-xl font-semibold my-1">{book.title}</Text>
          <Text className="text-md text-gray-600 ">{book.type}</Text>

          <View className="w-full bg-white p-5 pt-2 mt-2 rounded-lg">
            <Text className="text-center text-xl border-gray-400 border-b-2">
              Author(s)
            </Text>
            <View className="flex-row flex-wrap gap-4 pt-2">
              {book.authors?.map((author: string, index: number) => (
                <Text key={author} className="p-2">
                  {author}
                </Text>
              ))}
            </View>
          </View>

          <View className="w-full bg-white p-2 pt-4 mt-2 rounded-lg">
            <Text className="text-center">
              Published by{" "}
              <Text className="text-sky-500">{book.publisher}</Text>
            </Text>
            <Text className="text-xs text-right italic text-gray-600">
              at {formatDate(book.created_at)}
            </Text>
          </View>
        </View>
      )}
      {/* <Button onPress={singOut} title="Sign Out"></Button> */}
    </SafeAreaView>
  );
};

export default BookDetails;
