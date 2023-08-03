import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";
import { removeBookFromBooks } from "../../../redux/slicers/bookSlicer";
import {
  removeBookFromFavBooks,
  removeBookFromUserBooks,
} from "../../../redux/slicers/userSlicer";
import BookService from "../../../services/bookService";
import { BookType } from "../../../types/bookTypes";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import Button from "../../../components/Button";

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
          const err = await BookService.deleteBook(isbn, cover_url_suffix);
          if (!err) {
            dispatch(removeBookFromBooks(isbn));
            dispatch(removeBookFromUserBooks(isbn));
            dispatch(removeBookFromFavBooks(isbn));
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
