import {Easing} from 'react-native';
import type {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';

export const stackTransitionOptions: NativeStackNavigationOptions = {
  animation: 'fade',
  animationDuration: 260,
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
};

export const tabTransitionOptions: Pick<
  BottomTabNavigationOptions,
  'animation' | 'transitionSpec'
> = {
  animation: 'fade',
  transitionSpec: {
    animation: 'timing',
    config: {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    },
  },
};
