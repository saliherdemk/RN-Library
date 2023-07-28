import React from "react";
import { Image, View } from "react-native";

const Logo = () => {
  return (
    <View>
      <Image
        source={require("../assets/arkuci.png")}
        className="w-15 h-14 my-4"
        style={{ resizeMode: "contain" }}
      />
    </View>
  );
};

export default Logo;
