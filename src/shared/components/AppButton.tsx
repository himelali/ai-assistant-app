import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native';
import {colors} from '../theme/colors';
import {radius} from '../theme/radius';
import {useAppTheme} from '../theme/ThemeContext';
import {AppIcon} from './AppIcon';

type Variant = 'primary' | 'ghost' | 'dark' | 'danger';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  block?: boolean;
  small?: boolean;
  loading?: boolean;
  icon?: string;
  iconName?: string;
  iconColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  variant = 'primary',
  block,
  small,
  loading,
  icon,
  iconName,
  iconColor,
  textColor,
  style,
  disabled,
  ...props
}: Props) {
  const {theme} = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({pressed}) => [
        styles.base,
        styles[variant],
        variant === 'ghost' && {backgroundColor: theme.surface, borderColor: theme.line},
        block && styles.block,
        small && styles.small,
        (pressed || disabled || loading) && styles.pressed,
        style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? theme.text : colors.surface} />
      ) : (
        <>
          {iconName ? (
            <AppIcon
              name={iconName}
              size={small ? 15 : 17}
              color={iconColor ?? (variant === 'ghost' ? theme.text : colors.surface)}
            />
          ) : icon ? (
            <Text style={[styles.icon, variant === 'ghost' && {color: theme.text}, iconColor && {color: iconColor}]}>{icon}</Text>
          ) : null}
          <Text style={[styles.text, variant === 'ghost' && {color: theme.text}, textColor && {color: textColor}]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 43,
    borderRadius: radius.sm,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: colors.primaryStart,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
  },
  primary: {
    backgroundColor: colors.primaryStart,
  },
  ghost: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    shadowOpacity: 0.05,
  },
  dark: {
    backgroundColor: colors.ink,
  },
  danger: {
    backgroundColor: colors.error,
  },
  block: {
    width: '100%',
  },
  small: {
    minHeight: 34,
    paddingHorizontal: 11,
  },
  pressed: {
    opacity: 0.72,
    transform: [{scale: 0.99}],
  },
  text: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 13,
  },
  icon: {
    fontSize: 14,
    color: colors.surface,
  },
});
