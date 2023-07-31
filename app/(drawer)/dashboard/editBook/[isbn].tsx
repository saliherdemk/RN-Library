import { Stack, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/src/LocationProvider";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { editBookFromBooks } from "../../../../redux/slicers/bookSlicer";
import { setTypesFilter } from "../../../../redux/slicers/filterSlicer";
import { editBookFromUserBooks } from "../../../../redux/slicers/userSlicer";
import BookService from "../../../../services/bookService";
import FilterService from "../../../../services/filterService";
import { COVER_URL_PREFIX } from "../../../../helper/coverUrlPrefix";
import * as DocumentPicker from "expo-document-picker";
import { ImageFileType } from "../../../../types/bookTypes";
import { AntDesign } from '@expo/vector-icons'; 

const EditBook = () => {
  const { isbn } = useSearchParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [authors, setAuthors] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [coverUrlSuffix, setCoverUrlSuffix] = useState<string>("placeholder");
  const [selectedImage, setSelectedImage] = useState<ImageFileType | "placeholder" | null>(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    if (result.type == "success") {
      const file = {
        uri: result.uri,
        name: isbn as string + Date.now(),
        type: "image/*",
      };

      setSelectedImage(file);
      return;
    }
  };

  const handleEdit = async () => {
    const isbnValue = typeof isbn === "string" ? isbn : "";

    setIsBtnLoading(true);
    const Obj = await BookService.editBook(
      isbnValue,
      type,
      title,
      selectedImage,
      coverUrlSuffix,
      authors
    );
    if (Obj?.err) {
      setError(Obj?.err);
      setIsBtnLoading(false);
      return;
    }
    if (Obj.data) {
      dispatch(editBookFromUserBooks(Obj.data));
      dispatch(editBookFromBooks(Obj.data));
    }
    if (Obj.typeNeedsUpdate) {
      dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
    }

    if (Obj.authorNeedsUpdate) {
      dispatch(setTypesFilter(await FilterService.getAllAuthorFilters()));
    }
    router.back();
  };

  const fetchBook = async (isbn: string) => {
    const book = await BookService.getBookByISBN(isbn);
    if (book) {
      setTitle(book.title);
      setType(book.type);
      setCoverUrlSuffix(book.cover_url_suffix);
      setAuthors(book?.authors.join("-"));
    }
  };

  const clearImage = () =>{
    if(selectedImage !== "placeholder" && !selectedImage){
      setSelectedImage("placeholder")
      return
    }
    setSelectedImage(null)

  }

  useEffect(() => {
    // @ts-expect-error
    isbn && fetchBook(isbn);
  }, [isbn]);

  return (
    <SafeAreaView className="flex-1 pt-[5%] items-center px-8 gap-3">
      <Stack.Screen
        options={{
          headerTitle: "Edit " + isbn,
          headerShown: true,
          presentation: "modal",
        }}
      />
  <View>
      <TouchableOpacity
        className="rounded overflow-hidden w-40 h-40 bg-white shadow"
        onPress={pickImage}
      >
        {
          <Image
            source={{
              uri: selectedImage
                ? selectedImage != "placeholder"? selectedImage.uri: COVER_URL_PREFIX + selectedImage
                : COVER_URL_PREFIX + coverUrlSuffix,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        }
      </TouchableOpacity>
      {(coverUrlSuffix != "placeholder" &&  selectedImage !== "placeholder") &&
      <View className="absolute right-0 -m-2 bg-white rounded-full">
      <AntDesign onPress={clearImage} name="closecircle" size={24} color="black"  />
      </View>
      }</View>
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
