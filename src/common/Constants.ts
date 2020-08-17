import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const Constants = {
    Dimension: {
        ScreenWidth(percent = 1) {
            return Dimensions.get("window").width * percent;
        },
        ScreenHeight(percent = 1) {
            return Dimensions.get("window").height * percent;
        },
    },
    Storage: {
      URL: '@API_URL',
      KEY: '@API_KEY'
    },
    Window: {
        width,
        height,
        headerHeight: (65 * height) / 100,
        headerBannerAndroid: (55 * height) / 100,
        profileHeight: (45 * height) / 100,
    },
}


export default Constants;
