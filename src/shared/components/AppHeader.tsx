import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {radius} from '../theme/radius';
import {AppIcon} from './AppIcon';
import {useAppTheme} from '../theme/ThemeContext';

type Props = {
  title: string;
  right?: React.ReactNode;
  back?: boolean;
  onBack?: () => void;
};

export function AppHeader({title, right, back = true, onBack}: Props) {
  const navigation = useNavigation<any>();
  const {theme} = useAppTheme();

  function handleBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Main', {screen: 'Home'});
  }

  return (
    <View style={styles.header}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack ?? handleBack}
          style={[styles.iconBtn, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <AppIcon name="chevron-left" size={25} color={theme.text} />
        </Pressable>
      ) : (
        <View style={styles.iconBtnBlank} />
      )}
      <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.navTitle,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnBlank: {
    width: 38,
  },
  right: {
    minWidth: 38,
    alignItems: 'flex-end',
  },
});
