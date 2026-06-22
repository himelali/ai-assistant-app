import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../config/routes';
import {SplashScreen} from '../../features/splash/SplashScreen';
import {OnboardingScreen} from '../../features/onboarding/OnboardingScreen';
import {LoginScreen} from '../../features/auth/LoginScreen';
import {SignUpScreen} from '../../features/auth/SignUpScreen';
import {stackTransitionOptions} from './transitions';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, ...stackTransitionOptions}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
