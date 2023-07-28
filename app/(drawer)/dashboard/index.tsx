import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";
import { removeBookFromBooks } from "../../../redux/slicers/bookSlicer";
import { removeBookFromUserBooks } from "../../../redux/slicers/userSlicer";
import BookService from "../../../services/bookService";
import { BookType } from "../../../types/bookTypes";

const Dashboard = () => {
  const books = useAppSelector((state) => state.userData.userBooks);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDeletion = (isbn: string) => {
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
          const err = await BookService.deleteBook(isbn);
          if (!err) {
            dispatch(removeBookFromBooks(isbn));
            dispatch(removeBookFromUserBooks(isbn));
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
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Your Books</Text>
      <ScrollView className=" p-5">
        {books &&
          books.map((book: BookType) => (
            <View key={book.isbn}>
              <BookComponent book={book} />
              <View className="flex flex-row w-full justify-center ">
                <TouchableOpacity
                  onPress={() => {
                    handleDeletion(book.isbn);
                  }}
                  className="flex-1 bg-rose-500 rounded-bl py-2"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleEdit(book.isbn);
                  }}
                  className="flex-1 bg-blue-500 rounded-br py-2"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
      <AntDesign
        onPress={() => {
          router.push("/dashboard/addBook");
        }}
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
    </SafeAreaView>
  );
};

export default Dashboard;
