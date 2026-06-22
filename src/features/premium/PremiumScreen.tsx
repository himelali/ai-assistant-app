import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppCard} from '../../shared/components/AppCard';
import {AppIcon} from '../../shared/components/AppIcon';
import {GradientButton} from '../../shared/components/GradientButton';
import {useToast} from '../../shared/components/Toast';
import {plans} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

export function PremiumScreen() {
  const [selected, setSelected] = useState('pro');
  const [processing, setProcessing] = useState(false);
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const navigation = useNavigation<any>();
  function upgrade() {
    setProcessing(true);
    setTimeout(() => {setProcessing(false); showToast('Subscription processing mocked');}, 1200);
  }
  return (
    <AppScreen style={styles.safe}>
      <View style={styles.hero}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          onPress={() => navigation.navigate('Main', {screen: 'Home'})}
          style={styles.heroBack}>
          <AppIcon name="chevron-left" size={24} color={colors.surface} />
        </Pressable>
        <Text style={styles.kicker}>TYPEAI PRO</Text>
        <Text style={styles.heroTitle}>Unlock unlimited AI communication</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {plans.map(plan => <Pressable key={plan.id} onPress={() => setSelected(plan.id)}><AppCard style={[styles.plan, selected === plan.id ? styles.planActive : undefined]}><View><Text style={[typography.title, {color: theme.text}]}>{plan.name}</Text><Text style={[typography.small, {color: theme.textFaint}]}>{plan.note}</Text></View><Text style={styles.price}>{plan.price}</Text></AppCard></Pressable>)}
        <Text style={[typography.eyebrow, {color: theme.textFaint}]}>Included</Text>
        {['Unlimited AI replies & rewrites', 'Voice note summaries', 'Advanced writing styles', 'No ads'].map(item => <Text key={item} style={[styles.feature, {color: theme.text}]}>✓ {item}</Text>)}
        <GradientButton title={processing ? 'Processing...' : 'Upgrade'} block loading={processing} onPress={upgrade} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  hero: {backgroundColor: colors.ink, paddingHorizontal: 30, paddingTop: 54, paddingBottom: 34, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center'},
  heroBack: {position: 'absolute', left: 18, top: 18, width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)'},
  kicker: {color: colors.accent, fontWeight: '600', letterSpacing: 1, fontSize: 10, marginBottom: 8},
  heroTitle: {color: colors.surface, fontWeight: '500', fontSize: 22, textAlign: 'center', lineHeight: 29},
  content: {padding: 20, gap: 10},
  plan: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowOpacity: 0},
  planActive: {borderColor: colors.primaryStart, backgroundColor: colors.softPurple},
  price: {fontWeight: '600', color: colors.primaryStart, fontSize: 13},
  feature: {fontSize: 13, color: colors.ink, marginVertical: 3},
});
