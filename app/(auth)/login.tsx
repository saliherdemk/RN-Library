import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Button } from "react-native-elements";
import Logo from "../../components/Logo";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slicers/userSlicer";
import { supabase } from "../../services/supabase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogIn = async () => {
    setError(null);
    if (!email || !password) {
      alert("All Fields Required");
      return;
    }
    setIsBtnLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error?.status) {
      setEmail("");
      setPassword("");
      setError("Invalid credentials");
      return;
    }
    if (data.user) {
      dispatch(setUser(data.user));
      return;
    }
    setIsBtnLoading(false);
  };

  return (
    <View className="flex-1 items-center justify-center ">
      <StatusBar style="auto" />

      <View className="w-5/6 px-8 py-5 flex bg-white rounded-md shadow items-center">
        <Logo />
        {error && <Text className="text-rose-500">{error}</Text>}
        <TextInput
          keyboardType="email-address"
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Email"
          placeholderTextColor="#808080"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          className="w-full h-12 p-2.5 text-black mt-2.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Password"
          placeholderTextColor="#808080"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity className="w-full my-3">
          <Text className="text-right text-blue-500">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full">
          <Button onPress={handleLogIn} title={"Sign in"}></Button>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("register");
          }}
          className="w-full my-2 flex flex-row justify-center gap-x-1"
        >
          <Text className="">Don't you have an account?</Text>
          <Text className="text-blue-500">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
