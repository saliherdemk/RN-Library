import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useRouter } from "expo-router";

const Logout = () => {
  const router = useRouter();
  const singOut = async () => {
    const { error } = await supabase.auth.signOut();
  };
  useEffect(() => {
    singOut();
    router.replace("/login");
  });

  return (
    <View>
      <Text>Logout</Text>
    </View>
  );
};

export default Logout;
