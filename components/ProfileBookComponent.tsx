import { Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { COVER_URL_PREFIX } from "../helper/coverUrlPrefix";

export default function ProfileBookComponent({
  isbn,
  cover_url_suffix,
}: {
  isbn: string;
  cover_url_suffix: string;
}) {
  const router = useRouter();

  const handleGoDetails = () => {
    router.push({
      pathname: "bookDetails/[isbn]",
      params: { isbn },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleGoDetails}
      className="w-[33%] p-1 aspect-square"
    >
      <Image
        source={{
          uri: COVER_URL_PREFIX + cover_url_suffix,
        }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}
