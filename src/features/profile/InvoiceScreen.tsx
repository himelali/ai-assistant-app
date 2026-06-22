import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppHeader} from '../../shared/components/AppHeader';
import {AppScreen} from '../../shared/components/AppScreen';
import {AppCard} from '../../shared/components/AppCard';
import {AppButton} from '../../shared/components/AppButton';
import {useToast} from '../../shared/components/Toast';
import {RootStackParamList} from '../../app/config/routes';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Invoice'>;

const invoices: Record<string, {title: string; invoice: string; date: string; amount: string; plan: string; method: string}> = {
  'INV-2024-001': {
    title: 'Pro Plan Annual',
    invoice: 'INV-2024-001',
    date: 'January 12, 2024',
    amount: '$99.99',
    plan: 'Annual Pro subscription',
    method: 'Apple Pay',
  },
  'INV-2024-002': {
    title: 'Pro Plan Monthly',
    invoice: 'INV-2024-002',
    date: 'February 12, 2024',
    amount: '$12.99',
    plan: 'Monthly Pro subscription',
    method: 'Google Pay',
  },
};

export function InvoiceScreen({navigation, route}: Props) {
  const {theme} = useAppTheme();
  const {showToast} = useToast();
  const invoice = invoices[route.params.invoiceId] ?? invoices['INV-2024-001'];

  return (
    <AppScreen style={styles.safe}>
      <AppHeader title="Invoice" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.hero}>
          <Text style={[typography.sectionHeader, {color: theme.text}]}>Paid invoice</Text>
          <Text style={[typography.h1, styles.amount, {color: theme.text}]}>{invoice.amount}</Text>
          <Text style={[typography.body, {color: theme.textSoft}]}>{invoice.title}</Text>
        </AppCard>

        <AppCard style={styles.card}>
          {[
            ['Invoice number', invoice.invoice],
            ['Billing date', invoice.date],
            ['Plan', invoice.plan],
            ['Payment method', invoice.method],
            ['Status', 'Paid'],
          ].map(([label, value]) => (
            <View key={label} style={[styles.row, {borderBottomColor: theme.line}]}>
              <Text style={[typography.small, {color: theme.textFaint}]}>{label}</Text>
              <Text style={[styles.value, {color: theme.text}]}>{value}</Text>
            </View>
          ))}
        </AppCard>

        <AppButton title="Download invoice" iconName="download-outline" block onPress={() => showToast('Invoice download mocked')} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  content: {padding: 18, gap: 12, paddingBottom: 28},
  hero: {alignItems: 'center', gap: 6},
  amount: {marginTop: 4},
  card: {padding: 0, overflow: 'hidden', shadowOpacity: 0.03},
  row: {paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1},
  value: {fontSize: 14, fontWeight: '600', marginTop: 3},
});
