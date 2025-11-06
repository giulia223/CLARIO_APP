import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function Card({ style, children }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card
  }
});


