import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addBookToBooks } from "../../../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../../../redux/slicers/filterSlicer";
import { addBookToUserBooks } from "../../../redux/slicers/userSlicer";
import BookService from "../../../services/bookService";
import FilterService from "../../../services/filterService";

const AddBook = () => {
  const [title, setTitle] = useState("asd");
  const [isbn, setIsbn] = useState("qwe");
  const [type, setType] = useState("asd");
  const [authors, setAuthors] = useState("asdqwe");
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state) => state.userData.user);
  const dispatch = useAppDispatch();

  const [image, setImage] = useState<string | null>(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const router = useRouter();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const checkErrors = (): boolean => {
    setError(null);
    if (!title || !isbn || !type || !authors) {
      alert("All Text Fields Required");
      setIsBtnLoading(false);
      return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    setIsBtnLoading(true);
    if (checkErrors()) return;

    const response = await BookService.addBook(
      isbn,
      user?.id,
      type,
      title,
      "",
      authors
    );
    if (response?.err) {
      setError(response.err);
      setIsBtnLoading(false);
      return;
    }

    dispatch(addBookToUserBooks(response.data));
    dispatch(addBookToBooks(response.data));

    if (response.typeNeedsUpdate) {
      dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
    }

    if (response.authorNeedsUpdate) {
      dispatch(setAuthorsFilter(await FilterService.getAllAuthorFilters()));
    }

    Alert.alert(
      "Completed!",
      "Book successfully added",
      [{ text: "Okay", onPress: () => router.back() }],
      { cancelable: false }
    );
    setIsBtnLoading(false);
  };

  return (
    <>
      <SafeAreaView className="flex-1 pt-[5%] items-center px-8 gap-3">
        <TouchableOpacity
          className="rounded-full overflow-hidden w-40 h-40 bg-white shadow "
          onPress={pickImage}
        >
          {
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../../assets/cover_placeholder.png")
              }
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

        <View className="w-full ">
          <Text className="text-lg">ISBN</Text>
          <TextInput
            className="w-full bg-white h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
            placeholderTextColor="#808080"
            value={isbn}
            onChangeText={(isbn) => setIsbn(isbn)}
          />
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
          onPress={handleSubmit}
          className="w-full bg-green-500 rounded py-2"
        >
          {isBtnLoading ? (
            <ActivityIndicator className="h-6" color="#f2f2f2" size={30} />
          ) : (
            <Text className="text-center text-white font-semibold text-base">
              Add
            </Text>
          )}
        </TouchableOpacity>
        {/* <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-full bg-rose-500 rounded py-2 "
        >
          <Text className="text-center text-white font-semibold text-base">
            Cancel
          </Text>
        </Pressable> */}
      </SafeAreaView>
    </>
  );
};

export default AddBook;
