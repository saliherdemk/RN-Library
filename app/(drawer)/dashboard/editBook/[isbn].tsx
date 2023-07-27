import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "expo-router/src/LocationProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import BookService from "../../../../services/bookService";
import { TextInput } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { editBookFromUserBooks } from "../../../../redux/slicers/userSlicer";

const EditBook = () => {
  const { isbn } = useSearchParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [authors, setAuthors] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleEdit = async () => {
    const isbnValue = typeof isbn === "string" ? isbn : "";

    setIsBtnLoading(true);
    const Obj = await BookService.editBook(isbnValue, type, title, "", authors);
    if (Obj?.err) {
      setError(Obj?.err);
      setIsBtnLoading(false);
      return;
    }
    Obj.data && dispatch(editBookFromUserBooks(Obj.data));
    router.back();
  };

  const fetchBook = async (isbn: string) => {
    const book = await BookService.getBookByISBN(isbn);
    setTitle(book?.title);
    setType(book?.type);
    let authors: Array<string> = [];
    book?.AuthorBook.map((b) => {
      authors.push(b.author);
    });
    setAuthors(authors.join("-").toString());
  };

  useEffect(() => {
    // @ts-expect-error
    fetchBook(isbn);
  }, []);

  return (
    <SafeAreaView className="flex-1 pt-[5%] items-center px-8 gap-3">
      <Stack.Screen
        options={{
          headerTitle: "Edit " + isbn,
          headerShown: true,
          presentation: "modal",
        }}
      />

      <TouchableOpacity
        className="rounded-full overflow-hidden w-40 h-40 bg-white shadow "
        // onPress={pickImage}
      >
        {
          <Image
            source={require("../../../../assets/cover_placeholder.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        }
      </TouchableOpacity>
      {error && <Text className="text-rose-500">{error}</Text>}
      <View className="w-full ">
        <Text className="text-lg">Title</Text>
        <TextInput
          className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholderTextColor="#808080"
          value={title}
          onChangeText={(title) => setTitle(title)}
        />
      </View>
      <View className="w-full">
        <Text className="text-lg">ISBN</Text>
        <Text className="w-full bg-gray-50 text-lg pt-2.5 text-center text-black mt-2.5 border border-gray-200 rounded">
          {isbn}
        </Text>
      </View>
      <View className="w-full ">
        <Text className="text-lg">Type</Text>
        <TextInput
          className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholderTextColor="#808080"
          value={type}
          onChangeText={(type) => setType(type)}
        />
      </View>
      <View className="w-full ">
        <Text className="text-lg">Author(s)</Text>
        <TextInput
          className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholderTextColor="#808080"
          placeholder="Author1 - Author2 - Author3 "
          value={authors}
          onChangeText={(authors) => setAuthors(authors)}
        />
      </View>
      <TouchableOpacity
        onPress={handleEdit}
        className="w-full bg-blue-500 rounded py-2"
      >
        {isBtnLoading ? (
          <ActivityIndicator className="h-6" color="#f2f2f2" size={30} />
        ) : (
          <Text className="text-center text-white font-semibold text-base">
            Edit
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditBook;
