//https://dereckquock.com/react-native-looping-opacity-animation

import { Image } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
function Loading() {
  const opacity = useSharedValue(0);

  opacity.value = withRepeat(
    withTiming(1, { duration: 1000, easing: Easing.ease }),
    -1,
    true
  );

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);

  return (
    <Animated.View
      style={style}
      className="flex items-center w-full h-full justify-center"
    >
      <Image
        source={require("../assets/arkuci-logo.png")}
        className="w-36 h-36"
        style={{ resizeMode: "contain" }}
      />
    </Animated.View>
  );
}

export default Loading;
