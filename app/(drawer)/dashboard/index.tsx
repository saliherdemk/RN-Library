import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import BookComponent from "../../../components/BookComponent";
import { useAppSelector } from "../../../redux/hooks";
import { removeBookFromBooks } from "../../../redux/slicers/bookSlicer";
import { removeBookFromUserBooks } from "../../../redux/slicers/userSlicer";
import BookService from "../../../services/bookService";

const Dashboard = () => {
  const books = useAppSelector((state) => state.userData.data.userBooks);
  const router = useRouter();
  const dispatch = useDispatch();

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
    <SafeAreaView className="flex-1 px-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Your Books</Text>
      <FlatList
        data={books}
        className="px-3"
        renderItem={({ item }) => (
          <View key={item.isbn} className="pb-2">
            <BookComponent book={item} />
            <View className="flex flex-row w-full justify-center ">
              <TouchableOpacity
                onPress={() => {
                  handleDeletion(item.isbn, item.cover_url_suffix);
                }}
                className="flex-1 bg-rose-500 rounded-bl py-2"
              >
                <Text className="text-center text-white font-semibold text-base">
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleEdit(item.isbn);
                }}
                className="flex-1 bg-blue-500 rounded-br py-2"
              >
                <Text className="text-center text-white font-semibold text-base">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.isbn}
      />
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
    </SafeAreaView>
  );
};

export default Dashboard;
