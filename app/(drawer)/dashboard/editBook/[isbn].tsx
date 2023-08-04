import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Stack, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/src/LocationProvider";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import Button from "../../../../components/Button";
import Container from "../../../../components/Container";
import FormTextInput from "../../../../components/FormTextInput";
import Loading from "../../../../components/Loading";
import { COVER_URL_PREFIX } from "../../../../helper/coverUrlPrefix";
import { trimString } from "../../../../helper/trim";
import { editBookFromBooks } from "../../../../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../../../../redux/slicers/filterSlicer";
import { editBookFromUserBooks } from "../../../../redux/slicers/userSlicer";
import BookService from "../../../../services/bookService";
import FilterService from "../../../../services/filterService";
import { ImageFileType } from "../../../../types/bookTypes";
import ShowError from "../../../../components/ShowError";

const EditBook = () => {
  const { isbn } = useSearchParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [authors, setAuthors] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [coverUrlSuffix, setCoverUrlSuffix] = useState<string>("placeholder");
  const [selectedImage, setSelectedImage] = useState<
    ImageFileType | "placeholder" | null
  >(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    if (result.type == "success") {
      const file = {
        uri: result.uri,
        name: (isbn as string) + Date.now(),
        type: "image/*",
      };

      setSelectedImage(file);
      return;
    }
  };

  const handleEdit = async () => {
    const isbnValue = typeof isbn === "string" ? isbn : "";
    if (!title || !isbn || !type || !authors) {
      alert("All Text Fields Required");
      setIsBtnLoading(false);
      return;
    }

    setIsBtnLoading(true);
    const Obj = await BookService.editBook(
      isbnValue,
      trimString(type),
      title,
      selectedImage,
      coverUrlSuffix,
      trimString(authors)
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
    if (Obj.data?.typeNeedsUpdate) {
      dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
    }

    if (Obj.data?.authorNeedsUpdate) {
      dispatch(setAuthorsFilter(await FilterService.getAllAuthorFilters()));
    }

    Alert.alert(
      "Completed!",
      "Book edited successfully",
      [{ text: "Okay", onPress: () => router.back() }],
      { cancelable: false }
    );
    setIsBtnLoading(false);
  };

  const fetchBook = async (isbn: string) => {
    const book = await BookService.getBookByISBN(isbn);
    if (book) {
      setTitle(book.title);
      setType(book.type);
      setCoverUrlSuffix(book.cover_url_suffix);
      setAuthors(book?.authors.join("-"));
    }
    setIsLoading(false);
  };

  const clearImage = () => {
    if (!selectedImage) {
      setSelectedImage("placeholder");
      return;
    }
    setSelectedImage(null);
  };

  useEffect(() => {
    isbn && fetchBook(isbn as string);
  }, [isbn]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView className="flex-1 px-8">
          <Stack.Screen
            options={{
              headerTitle: "Edit " + isbn,
              headerShown: true,
              presentation: "modal",
            }}
          />
          <Container classList="justify-center items-center pt-8">
            <View>
              <TouchableOpacity
                className="rounded overflow-hidden w-40 h-40 bg-white shadow"
                onPress={pickImage}
              >
                {
                  <Image
                    source={{
                      uri: selectedImage
                        ? selectedImage != "placeholder"
                          ? selectedImage.uri
                          : COVER_URL_PREFIX + selectedImage
                        : COVER_URL_PREFIX + coverUrlSuffix,
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                }
              </TouchableOpacity>
              {selectedImage !== "placeholder" && (
                <View className="absolute right-0 -m-2 bg-white rounded-full">
                  <AntDesign
                    onPress={clearImage}
                    name="closecircle"
                    size={24}
                    color="black"
                  />
                </View>
              )}
            </View>
          </Container>

          {error && <ShowError err={error} />}

          <FormTextInput label="Title" value={title} setValue={setTitle} />

          <FormTextInput label="ISBN" value={isbn as string} readOnly={true} />

          <FormTextInput label="Type" value={type} setValue={setType} />
          <FormTextInput
            label="Author(s)"
            value={authors}
            setValue={setAuthors}
            placeHolder="Author1 - Author2 - Author3"
          />

          <Button
            title={"Edit"}
            isLoading={isBtnLoading}
            onPress={handleEdit}
          />
        </ScrollView>
      )}
    </>
  );
};

export default EditBook;
