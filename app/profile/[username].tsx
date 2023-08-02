import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { useSearchParams } from "expo-router/src/LocationProvider";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { COVER_URL_PREFIX } from "../../helper/coverUrlPrefix";
import BookService from "../../services/bookService";
import { Stack, useRouter } from "expo-router";
import { BookType } from "../../types/bookTypes";
import UserService from "../../services/userService";

const Profile = () => {
  const { username } = useSearchParams();
  const [books, setBooks] = useState<Array<BookType>>([]);
  const router = useRouter();

  const fetchUser = async () => {
    const idData = await UserService.getUserByUsername(username as string);
    const books = await BookService.getUsersBooks(idData?.id);
    books?.length && setBooks(books);
  };

  useEffect(() => {
    username && fetchUser();
  }, [username]);

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ headerTitle: "" }} />
      <View className="flex-1 bg-white items-center pt-8">
        {username && (
          <Text className="text-xl font-semibold my-1">
            {(username as string).toUpperCase()}
          </Text>
        )}
        {books.length > 0 && (
          <>
            <FlatList
              data={books}
              numColumns={3}
              className="w-full"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "bookDetails/[isbn]",
                      params: { isbn: item.isbn },
                    })
                  }
                  className="w-[33%] p-1 aspect-square"
                >
                  <Image
                    source={{
                      uri: COVER_URL_PREFIX + item.cover_url_suffix,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </Pressable>
              )}
              keyExtractor={(item) => item.isbn}
            />
          </>
        )}
      </View>
      {/* <Button onPress={singOut} title="Sign Out"></Button> */}
    </SafeAreaView>
  );
};

export default Profile;
