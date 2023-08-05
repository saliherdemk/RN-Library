import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/src/LocationProvider";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import Container from "../../components/Container";
import ImageContainer from "../../components/ImageContainer";
import Loading from "../../components/Loading";
import Header from "../../components/headers/Header";
import { COVER_URL_PREFIX } from "../../helper/coverUrlPrefix";
import { formatDate } from "../../helper/formatDate";
import { useAppSelector } from "../../redux/hooks";
import {
  addBookToFavBooks,
  removeBookFromFavBooks,
} from "../../redux/slicers/userSlicer";
import BookService from "../../services/bookService";
import { BookType } from "../../types/bookTypes";

const BookDetails = () => {
  const { isbn } = useSearchParams();
  const [book, setBook] = useState<BookType | null>(null);
  const favBooks = useAppSelector((state) => state.userData.data.favBooks);
  const user = useAppSelector((state) => state.userData.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchBook = async (isbn: string) => {
    const bookData = await BookService.getBookByISBN(isbn);
    setBook(bookData);
    setIsFavorite(favBooks.some((b) => b.isbn == isbn));
    setIsLoading(false);
  };

  const toggleFavorite = () => {
    setIsFavorite((curr) => !curr);
  };

  const goToPublisher = (username: string) => {
    if (username == user?.user_metadata.username) {
      router.push("account");
      return;
    }
    router.push({
      pathname: "/profile/[username]",
      params: { username },
    });
  };

  const updateDbAdd = async () => {
    user &&
      isbn &&
      (await BookService.addBookToUserFavBooks(isbn as string, user?.id));
  };

  const updateDbDel = async () => {
    user &&
      isbn &&
      (await BookService.removeBookFromUserFavBooks(isbn as string, user?.id));
    setIsLoading(false);
  };

  useEffect(() => {
    if (book && !isLoading) {
      if (isFavorite) {
        dispatch(
          addBookToFavBooks({
            isbn: isbn,
            cover_url_suffix: book?.cover_url_suffix,
          })
        );
        updateDbAdd();
      } else {
        dispatch(removeBookFromFavBooks(isbn));
        updateDbDel();
      }
    }
  }, [isFavorite]);

  useEffect(() => {
    // @ts-expect-error
    isbn && fetchBook(isbn);
  }, [isbn]);

  return (
    <Container>
      <Stack.Screen
        options={{
          headerTitle: isbn as string,
          headerShown: true,
          presentation: "modal",
        }}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView className="flex-1">
          {!book ? (
            <Text>This book might be deleted</Text>
          ) : (
            <View className="flex-1 items-center px-8">
              <ImageContainer uri={COVER_URL_PREFIX + book.cover_url_suffix} />
              <Text className="text-xl font-semibold my-1">{book.title}</Text>
              <Text className="text-md text-gray-600 ">{book.type}</Text>
              <TouchableOpacity onPress={toggleFavorite}>
                {isFavorite ? (
                  <MaterialIcons name="favorite" size={36} color="red" />
                ) : (
                  <MaterialIcons name="favorite-border" size={36} color="red" />
                )}
              </TouchableOpacity>
              <View className="w-full bg-white p-5 pt-2 mt-2 rounded-lg">
                <Header
                  title="Author(s)"
                  classList=" text-xl border-gray-400"
                />
                <View className="flex-row flex-wrap gap-4 pt-2">
                  {book.authors?.map((author: string, index: number) => (
                    <Text key={author} className="p-2">
                      {author}
                    </Text>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  goToPublisher(book.publisher);
                }}
                className="w-full bg-white p-2 pt-4 my-2 rounded-lg"
              >
                <Text className="text-center">
                  Published by{" "}
                  <Text className="text-sky-500">{book.publisher}</Text>
                </Text>
                <Text className="text-xs text-right italic text-gray-600">
                  at {formatDate(book.created_at)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </Container>
  );
};

export default BookDetails;
