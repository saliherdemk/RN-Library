import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState, useId } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BookService from "../../../services/bookService";
import BookComponent from "../../../components/BookComponent";
import { BookType } from "../../../types/bookTypes";
import { useDispatch } from "react-redux";
import { removeBookFromBooks } from "../../../redux/slicers/bookSlicer";

const Dashboard = () => {
  const [books, setBooks] = useState<Array<BookType> | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchBooks = async () => {
    setBooks(await BookService.getUsersBooks());
  };
  useEffect(() => {
    fetchBooks();
  }, []);

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
          !err && dispatch(removeBookFromBooks(isbn));
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
