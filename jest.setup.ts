import "@testing-library/jest-native/extend-expect";

// ---------- Mocks: AsyncStorage ----------
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// ---------- Mocks: expo-router ----------
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  Redirect: ({ href }: any) => null,
}));

// ---------- Mocks: expo-linking ----------
jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
}));

// ---------- Mocks: expo-location ----------
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: { latitude: 52.2297, longitude: 21.0122 },
  })),
}));

// ---------- Mocks: react-native-maps ----------
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockMapView = (props: any) => React.createElement(View, props, props.children);
  const MockMarker = (props: any) => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// ---------- Mocks: react-native-calendars ----------
jest.mock("react-native-calendars", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Calendar: (props: any) => React.createElement(View, props, props.children),
  };
});
