import { Stack, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/src/LocationProvider";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { COVER_URL_PREFIX } from "../../helper/coverUrlPrefix";
import BookService from "../../services/bookService";
import UserService from "../../services/userService";
import { BookType } from "../../types/bookTypes";
import Loading from "../../components/Loading";
import Container from "../../components/Container";
import AccountHeaderContainer from "../../components/AccountHeaderContainer";
import ProfileBookComponent from "../../components/ProfileBookComponent";

const Profile = () => {
  const { username } = useSearchParams();
  const [books, setBooks] = useState<Array<BookType>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const idData = await UserService.getUserByUsername(username as string);
    const books = await BookService.getUsersBooks(idData?.id);
    books?.length && setBooks(books);
    setIsLoading(false);
  };

  useEffect(() => {
    username && fetchUser();
  }, [username]);

  const renderItem = ({ item }: { item: BookType }) => (
    <ProfileBookComponent
      isbn={item.isbn}
      cover_url_suffix={item.cover_url_suffix}
    />
  );

  const keyExtractor = (item: BookType) => item.isbn;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Stack.Screen options={{ headerTitle: "" }} />

          <Container classList="bg-white items-center pt-4">
            <AccountHeaderContainer
              title={(username as string).toUpperCase()}
            />
            {books.length > 0 && (
              <>
                <FlatList
                  data={books}
                  numColumns={3}
                  className="w-full"
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                />
              </>
            )}
          </Container>
        </>
      )}
    </>
  );
};

export default Profile;
