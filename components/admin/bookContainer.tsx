import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { formatDate } from "../../helper/formatDate";
import { removeBookFromBooks } from "../../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../../redux/slicers/filterSlicer";
import {
  removeBookFromFavBooks,
  removeBookFromUserBooks,
} from "../../redux/slicers/userSlicer";
import BookService from "../../services/bookService";
import FilterService from "../../services/filterService";
import Button from "../Button";

const BookContainer = ({
  book,
}: {
  book: {
    isbn: string;
    title: string;
    publisher: string;
    cover_url_suffix: string;
    created_at: string;
  };
}) => {
  const dispatch = useDispatch();
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const handleDeletion = () => {
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
          const isbn = book.isbn;
          setIsBtnLoading(true);
          const result = await BookService.deleteBook(
            isbn,
            book.cover_url_suffix
          );
          if (result.err) {
            Alert.alert("Sonething Went Wrong");
            setIsBtnLoading(false);
            return;
          }
          dispatch(removeBookFromBooks(isbn));
          dispatch(removeBookFromUserBooks(isbn));
          dispatch(removeBookFromFavBooks(isbn));

          if (result?.type_needs_update) {
            dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
          }

          if (result?.author_needs_update) {
            dispatch(
              setAuthorsFilter(await FilterService.getAllAuthorFilters())
            );
          }
          setIsBtnLoading(false);
        },
      },
    ]);
  };
  return (
    <View className="bg-white p-4 mb-4">
      <Text className="text-center text-lg">{book.title}</Text>

      <Text className="text-center ">{book.isbn}</Text>
      <Text className="text-right ">published by {book.publisher}</Text>
      <Text className="text-right ">at {formatDate(book.created_at)}</Text>

      <Button
        onPress={handleDeletion}
        title="Delete"
        classList="bg-rose-500"
        isLoading={isBtnLoading}
      />
    </View>
  );
};

export default BookContainer;
