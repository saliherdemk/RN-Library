import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useId } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BookService from "../../../services/bookService";
import BookComponent from "../../../components/BookComponent";

const Dashboard = () => {
  const user = useAppSelector((state) => state.userData.user);
  const router = useRouter();
  const [books, setBooks] = useState<Array<Object> | null>(null);
  const fetchData = async (id: string) => {
    return await BookService.getBooksByPublisher(id);
  };
  useEffect(() => {
    if (!user?.id) return;
    fetchData(user?.id).then((data) => {
      setBooks(data);
    });
  }, []);
  return (
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2 border-b-2">Books</Text>
      <ScrollView className=" p-5">
        {books &&
          books.map((book: any) => (
            <BookComponent book={book} key={book.isbn} />
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
