import * as DocumentPicker from "expo-document-picker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import Container from "../../../components/Container";
import FormTextInput from "../../../components/FormTextInput";
import { COVER_URL_PREFIX } from "../../../helper/coverUrlPrefix";
import { trimString } from "../../../helper/trim";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addBookToBooks } from "../../../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../../../redux/slicers/filterSlicer";
import { addBookToUserBooks } from "../../../redux/slicers/userSlicer";
import BookService from "../../../services/bookService";
import FilterService from "../../../services/filterService";
import { ImageFileType } from "../../../types/bookTypes";
import Button from "../../../components/Button";

const AddBook = () => {
  const [title, setTitle] = useState("asd");
  const [isbn, setIsbn] = useState("qwe");
  const [type, setType] = useState("asd");
  const [authors, setAuthors] = useState("asdqwe");
  const [coverFile, setCoverFile] = useState<ImageFileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state) => state.userData.user);
  const dispatch = useAppDispatch();

  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const router = useRouter();
  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    if (result.type == "success") {
      const file = {
        uri: result.uri,
        name: isbn + Date.now(),
        type: "image/*",
      };

      setCoverFile(file);
      return;
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
    var updatedFile = coverFile
      ? { ...coverFile, name: isbn + Date.now() }
      : null;
    const response = await BookService.addBook(
      isbn,
      user?.id,
      trimString(type),
      title,
      updatedFile,
      trimString(authors)
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
      <ScrollView className="flex-1 px-8">
        <Stack.Screen
          options={{
            headerTitle: "Add Book",
            headerShown: true,
            presentation: "modal",
          }}
        />

        <Container classList="justify-center items-center pt-8">
          <TouchableOpacity
            className="rounded overflow-hidden w-40 h-40 bg-white shadow "
            onPress={pickImage}
          >
            {
              <Image
                source={{
                  uri: coverFile
                    ? coverFile.uri
                    : COVER_URL_PREFIX + "placeholder",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            }
          </TouchableOpacity>
        </Container>

        {error && <Text className="text-rose-500">{error}</Text>}

        <FormTextInput
          label="Title"
          value={title}
          setValue={setTitle}
          placeHolder=""
          readOnly={false}
        />

        <FormTextInput
          label="ISBN"
          value={isbn as string}
          setValue={setIsbn}
          placeHolder=""
          readOnly={false}
        />

        <FormTextInput
          label="Type"
          value={type}
          setValue={setType}
          placeHolder=""
          readOnly={false}
        />
        <FormTextInput
          label="Author(s)"
          value={authors}
          setValue={setAuthors}
          placeHolder="Author1 - Author2 - Author3"
          readOnly={false}
        />

        <Button
          title={"Add"}
          isLoading={isBtnLoading}
          onPress={handleSubmit}
          classList="bg-green-500"
        />
      </ScrollView>
    </>
  );
};

export default AddBook;
