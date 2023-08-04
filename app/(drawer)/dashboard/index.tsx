import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import BookComponent from "../../../components/BookComponent";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import NoBooks from "../../../components/NoBooks";
import Header from "../../../components/headers/Header";
import { useAppSelector } from "../../../redux/hooks";
import { removeBookFromBooks } from "../../../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../../../redux/slicers/filterSlicer";
import {
  removeBookFromFavBooks,
  removeBookFromUserBooks,
} from "../../../redux/slicers/userSlicer";
import BookService from "../../../services/bookService";
import FilterService from "../../../services/filterService";
import { BookType } from "../../../types/bookTypes";

const Dashboard = () => {
  const books = useAppSelector((state) => state.userData.data.userBooks);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1);
  }, []);

  const renderItem = ({ item }: { item: BookType }) => (
    <View key={item.isbn} className="pb-2">
      <BookComponent book={item} />
      <View className="flex flex-row w-full justify-center ">
        <Button
          title="Delete"
          onPress={() => {
            handleDeletion(item.isbn, item.cover_url_suffix);
          }}
          classList="bg-rose-500 flex-1"
        />

        <Button
          title="Edit"
          onPress={() => {
            handleEdit(item.isbn);
          }}
          classList=" flex-1"
        />
      </View>
    </View>
  );

  const keyExtractor = (item: BookType) => item.isbn;

  const handleDeletion = (isbn: string, cover_url_suffix: string) => {
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
          const result = await BookService.deleteBook(isbn, cover_url_suffix);
          if (result.err) {
            Alert.alert("Sonething Went Wrong");
            return;
          }
          dispatch(removeBookFromBooks(isbn));
          dispatch(removeBookFromUserBooks(isbn));
          dispatch(removeBookFromFavBooks(isbn));

          if (result?.type_needs_update) {
            dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
          }

          if (result?.author_needs_update) {
            dispatch(
              setAuthorsFilter(await FilterService.getAllAuthorFilters())
            );
          }
        },
      },
    ]);
  };

  const handleEdit = (isbn: string) => {
    router.push({
      pathname: "dashboard/editBook/[isbn]",
      params: { isbn },
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View className="flex-1 px-4">
            <Header title="Your Books" />
            <FlatList
              data={books}
              className="px-3"
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={() => (
                <NoBooks text="You Haven't Published Any Books Yet" />
              )}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              router.push("/dashboard/addBook");
            }}
          >
            <AntDesign
              style={{
                position: "absolute",
                right: 15,
                bottom: 15,
                backgroundColor: "white",
                borderRadius: 100,
              }}
              name="pluscircle"
              size={40}
              color="lightgreen"
            />
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default Dashboard;
