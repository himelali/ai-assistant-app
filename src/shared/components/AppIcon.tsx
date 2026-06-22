import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  name: string;
  size?: number;
  color?: string;
};

export function AppIcon({name, size = 22, color = '#111827'}: Props) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
