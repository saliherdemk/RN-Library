import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import BookComponent from "../../../components/BookComponent";
import Container from "../../../components/Container";
import FilterExpandable from "../../../components/FilterExpandable";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import ShowActiveSortFilter from "../../../components/ShowActiveSortFilter";
import { useAppSelector } from "../../../redux/hooks";
import { BookType } from "../../../types/bookTypes";

const Books = () => {
  const books = useAppSelector((state) => state.bookData.books);
  const [shownBooks, setShownBooks] = useState<Array<BookType> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const goDetail = (isbn: string) => {
    router.push({
      pathname: "bookDetails/[isbn]",
      params: { isbn },
    });
  };

  const getItemLayout = (_: any, index: number) => ({
    length: 100,
    offset: 100 * index,
    index,
  });

  const renderItem = ({ item }: { item: BookType }) => (
    <TouchableOpacity
      onPress={() => {
        goDetail(item.isbn);
      }}
    >
      <BookComponent book={item} key={item.isbn} />
    </TouchableOpacity>
  );
  const keyExtractor = (item: BookType) => item.isbn;

  useEffect(() => {
    setShownBooks(books);
  }, [books]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Container classList="px-4">
          <Header title="Books" />
          <Container>
            <FilterExpandable />
            <ShowActiveSortFilter
              shownBooks={shownBooks}
              setShownBooks={setShownBooks}
            />
            <FlatList
              data={shownBooks}
              className="px-3"
              renderItem={renderItem}
              ListEmptyComponent={() => <Text>No upcoming trips to show.</Text>}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
            />
          </Container>
        </Container>
      )}
    </>
  );
};

export default Books;
