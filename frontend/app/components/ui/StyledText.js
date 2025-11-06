import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Subtitle({ children, style }) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

export function Body({ children, style }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}
export default function __NonRouteStyledText() { return null }
const styles = StyleSheet.create({
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700'
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600'
  },
  body: {
    color: theme.colors.textPrimary,
    fontSize: 14
  }
});


