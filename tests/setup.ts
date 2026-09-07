// Setup and mocks for React Native in Jest Node environment
import React from "react";

jest.mock("react-native", () => {
  const React = require("react");

  const View = (props: any) => React.createElement("View", props, props.children);
  const Text = (props: any) => React.createElement("Text", props, props.children);

  const Pressable = ({ onPress, disabled, style, testID, accessibilityLabel, accessibilityRole, accessibilityState, children }: any) => {
    return React.createElement(
      "Pressable",
      {
        onPress: disabled ? undefined : onPress,
        disabled,
        style,
        testID,
        accessibilityLabel,
        accessibilityRole,
        accessibilityState,
      },
      typeof children === "function" ? children({ pressed: false }) : children,
    );
  };

  const Modal = ({ visible, children, testID }: any) => {
    if (!visible) return null;
    return React.createElement("Modal", { testID }, children);
  };

  const StyleSheet = {
    create: (styles: any) => styles,
    hairlineWidth: 1,
  };

  const ScrollView = (props: any) => React.createElement("ScrollView", props, props.children);
  const TextInput = (props: any) => React.createElement("TextInput", props, props.children);

  return {
    View,
    Text,
    Pressable,
    Modal,
    ScrollView,
    TextInput,
    StyleSheet,
  };
});
