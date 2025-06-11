import { Platform } from "react-native";

export const API_BASE_URL = Platform.select({
  web: "http://localhost:5001", // for web preview
  ios: "http://192.168.1.101:5001", // replace with your local IP
  android: "http://192.168.1.101:5001", // same here
  default: "http://192.168.1.101:5001",
});
