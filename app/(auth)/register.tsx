import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-elements";
import Logo from "../../components/Logo";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slicers/userSlicer";
import { supabase } from "../../services/supabase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    data.user && dispatch(setUser(data.user));
  };

  return (
    <View className="flex-1 items-center justify-center ">
      <StatusBar style="auto" />

      <View className="w-5/6 px-8 py-5 flex bg-white rounded-md shadow items-center">
        <Logo />
        <TextInput
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity className="w-full mt-2">
          <Button onPress={handleRegister} title={"Sign Up"}></Button>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("login");
          }}
          className="w-full my-2 flex flex-row justify-center gap-x-1"
        >
          <Text className="">Do you have an account?</Text>
          <Text className="text-blue-500">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
