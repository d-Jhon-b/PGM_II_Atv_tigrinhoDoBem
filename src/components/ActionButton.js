import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ActionButton({ title, onPress, disabled, style, textStyle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled ? styles.disabledButton : styles.activeButton,
        style,
      ]}
    >
      <Text style={[styles.text, disabled ? styles.disabledText : styles.activeText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  activeButton: {
    backgroundColor: '#2563EB',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#E5E7EB',
  },
  activeText: {
    color: '#FFFFFF',
  },
});