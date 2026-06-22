import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, View} from 'react-native';
import {AppIcon} from '../../shared/components/AppIcon';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {TranslationKey} from '../../shared/localization/translations';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {MainTabParamList} from '../config/routes';
import {HomeScreen} from '../../features/home/HomeScreen';
import {AiHubScreen} from '../../features/aiHub/AiHubScreen';
import {HistoryScreen} from '../../features/history/HistoryScreen';
import {KeyboardSetupScreen} from '../../features/keyboard/KeyboardSetupScreen';
import {ProfileScreen} from '../../features/profile/ProfileScreen';
import {tabTransitionOptions} from './transitions';

const Tab = createBottomTabNavigator<MainTabParamList>();
const inactiveNavColor = colors.inkFaint;

const tabMeta: Record<keyof MainTabParamList, {labelKey: TranslationKey; icon: string}> = {
  Home: {labelKey: 'navHome', icon: 'home-variant'},
  Keyboard: {labelKey: 'navKeyboard', icon: 'keyboard-outline'},
  AiHub: {labelKey: 'navAskAi', icon: 'robot-excited-outline'},
  History: {labelKey: 'navHistory', icon: 'history'},
  Profile: {labelKey: 'navProfile', icon: 'account-circle-outline'},
};

function makeTabIcon(routeName: keyof MainTabParamList) {
  return function TabIcon({focused}: {focused: boolean}) {
    const meta = tabMeta[routeName];
    const isCenter = routeName === 'AiHub';
    const {t} = useLocalization();

    if (isCenter) {
      return (
        <View style={styles.centerItem}>
          <View style={styles.centerHalo}>
            <View style={styles.centerButton}>
              <AppIcon name={meta.icon} size={11} color={colors.primaryStart} />
            </View>
          </View>
          <Text style={[styles.label, styles.centerLabel]}>{t(meta.labelKey)}</Text>
        </View>
      );
    }

    return (
      <View style={styles.item}>
        <AppIcon
          name={meta.icon}
          size={routeName === 'Profile' ? 25 : 24}
          color={focused ? colors.primaryStart : inactiveNavColor}
        />
        <Text style={[styles.label, focused ? styles.activeLabel : styles.inactiveLabel, focused && styles.labelActive]}>
          {t(meta.labelKey)}
        </Text>
      </View>
    );
  };
}

export function MainTabNavigator() {
  const {theme, isDark} = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        ...tabTransitionOptions,
        tabBarActiveTintColor: colors.primaryStart,
        tabBarInactiveTintColor: inactiveNavColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopColor: isDark ? theme.line : 'rgba(17,24,39,0.10)',
          borderTopWidth: 1,
          backgroundColor: theme.tabBar,
          shadowColor: colors.ink,
          shadowOpacity: 0.07,
          shadowRadius: 18,
          shadowOffset: {width: 0, height: -8},
          elevation: 16,
        },
        tabBarItemStyle: route.name === 'AiHub' ? styles.centerTabItem : styles.tabItem,
        tabBarIcon: makeTabIcon(route.name),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Keyboard" component={KeyboardSetupScreen} />
      <Tab.Screen name="AiHub" component={AiHubScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    height: 64,
  },
  centerTabItem: {
    height: 82,
  },
  item: {
    width: 72,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLabel: {
    color: colors.primaryStart,
  },
  inactiveLabel: {
    color: inactiveNavColor,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '600',
  },
  centerItem: {
    width: 96,
    height: 78,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -24,
  },
  centerHalo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
    elevation: 10,
  },
  centerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    marginTop: 5,
    color: inactiveNavColor,
    fontWeight: '500',
  },
});
