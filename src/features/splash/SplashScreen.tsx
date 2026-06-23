import React, {useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../app/config/routes';
import {AppIcon} from '../../shared/components/AppIcon';
import {useLocalization} from '../../shared/localization/LocalizationContext';
import {colors} from '../../shared/theme/colors';
import {splashStyles as styles} from '../../shared/utils/screenStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const splashSlides = [
  {
    icon: 'star-four-points-outline',
    title: 'TypeAI',
    subtitle: 'Your AI Communication Assistant',
  },
  {
    icon: 'keyboard-outline',
    title: 'Smart keyboard',
    subtitle: 'Draft replies, rewrite text, and translate without leaving the conversation.',
  },
  {
    icon: 'microphone-outline',
    title: 'Voice and writing tools',
    subtitle: 'Turn voice, email, captions, and proposals into polished messages faster.',
  },
] as const;

export function SplashScreen({navigation}: Props) {
  const {t} = useLocalization();
  const {width: screenWidth} = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth));
  }

  function goToSlide(index: number) {
    if (index >= splashSlides.length) {
      navigation.replace('Onboarding');
      return;
    }

    pagerRef.current?.scrollTo({x: index * screenWidth, animated: true});
    setActiveIndex(index);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={[styles.glow, styles.glowA]} />
      <View style={[styles.glow, styles.glowB]} />
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={styles.pager}>
        {splashSlides.map((slide, index) => (
          <View
            key={slide.title}
            style={[styles.slide, {width: screenWidth}]}>
            <View style={styles.logo}>
              <AppIcon name={slide.icon} size={38} color={colors.surface} />
            </View>
            <Text style={styles.name}>{index === 0 ? t('appName') : slide.title}</Text>
            <Text style={styles.subtitle}>{index === 0 ? t('appSubtitle') : slide.subtitle}</Text>
            {index === splashSlides.length - 1 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="OK, continue"
                onPress={() => goToSlide(index + 1)}
                style={({pressed}) => [styles.okButton, pressed && styles.okPressed]}>
                <Text style={styles.okText}>OK</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {splashSlides.map((slide, index) => (
          <Pressable
            key={slide.title}
            accessibilityRole="button"
            accessibilityLabel={`Show splash page ${index + 1}`}
            onPress={() => goToSlide(index)}
            style={[styles.dot, activeIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}
