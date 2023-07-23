import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import Logo from "../../components/Logo";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slicers/userSlicer";
import { supabase } from "../../services/supabase";
import { isEmailValid } from "../../helper/validateEmail";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const clear = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsBtnLoading(false);
  };

  const checkErrors = () => {
    setError(null);
    if (!email || !password || !confirmPassword) {
      alert("All Fields Required");
      setIsBtnLoading(false);
      return true;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email.");
      setIsBtnLoading(false);
      return true;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      setIsBtnLoading(false);
      return true;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setIsBtnLoading(false);
      return true;
    }

    return false;
  };

  const handleRegister = async () => {
    setIsBtnLoading(true);
    if (checkErrors()) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error?.status == 400) {
      setError("User Already Exists");
      clear();
      return;
    }

    if (data.user) {
      dispatch(setUser(data.user));
      return;
    }
    setError("Unexpected error");
    setIsBtnLoading(false);
  };

  return (
    <View className="flex-1 items-center justify-center ">
      <StatusBar style="auto" />

      <View className="w-5/6 px-8 py-5 flex bg-white rounded-md shadow items-center">
        <Logo />
        {error && <Text className="text-rose-500">{error}</Text>}

        <TextInput
          className="w-full h-12 p-2.5 text-black my-1.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          className="w-full h-12 p-2.5 text-black my-1.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          className="w-full h-12 p-2.5 text-black my-1.5 border border-gray-200 rounded focus:border-sky-300"
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
        />

        <TouchableOpacity
          onPress={handleRegister}
          className="w-full bg-blue-500 rounded py-2 mt-2"
        >
          {isBtnLoading ? (
            <ActivityIndicator className="h-6" color="#f2f2f2" size={30} />
          ) : (
            <Text className="text-center text-white font-semibold text-base">
              Sign In
            </Text>
          )}
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
