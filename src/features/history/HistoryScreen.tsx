import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppScreen} from '../../shared/components/AppScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../app/config/routes';
import {AppCard} from '../../shared/components/AppCard';
import {AppIcon} from '../../shared/components/AppIcon';
import {useToast} from '../../shared/components/Toast';
import {history} from '../../shared/mock/mockData';
import {colors} from '../../shared/theme/colors';
import {useAppTheme} from '../../shared/theme/ThemeContext';
import {typography} from '../../shared/theme/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const filters = ['All', 'Replies', 'Translate', 'Writing', 'Voice'];

export function HistoryScreen() {
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation<Nav>();
  const {showToast} = useToast();
  const {theme} = useAppTheme();
  const items = useMemo(() => history.filter(item => filter === 'All' || item.type === filter), [filter]);
  const groups = ['Today', 'Yesterday'];
  return (
    <AppScreen style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.spacer} />
        <Text style={[typography.title, {color: theme.text}]}>AI History</Text>
        <Pressable onPress={() => showToast('History cleared')} style={[styles.trash, {backgroundColor: theme.surface, borderColor: theme.line}]}>
          <AppIcon name="trash-can-outline" size={20} color={theme.text} />
        </Pressable>
      </View>
      <View style={styles.filters}>
        {filters.map(item => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.chip,
              {backgroundColor: theme.surface, borderColor: theme.line},
              filter === item && styles.activeChip,
            ]}>
            <Text style={[styles.chipText, {color: theme.text}, filter === item && styles.activeChipText]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><AppIcon name="archive-outline" size={30} color={colors.primaryStart} /></View>
            <Text style={[typography.title, {color: theme.text}]}>No activity in this category</Text>
            <Text style={[typography.body, {color: theme.textSoft}]}>Try a different filter above.</Text>
          </View>
        ) : groups.map(group => {
          const groupItems = items.filter(item => item.group === group);
          if (!groupItems.length) return null;
          return (
            <View key={group} style={styles.group}>
              <Text style={[typography.eyebrow, styles.groupTitle]}>{group}</Text>
              {groupItems.map(item => (
                <Pressable key={`${item.title}-${item.time}`} onPress={() => navigation.navigate(item.route as never)}>
                  <AppCard style={styles.item}>
                    <View style={styles.itemIcon}><AppIcon name={item.icon} size={18} color={colors.primaryStart} /></View>
                    <View style={styles.itemBody}>
                      <View style={styles.itemTop}>
                        <Text style={[styles.itemTitle, {color: theme.text}]}>{item.title}</Text>
                        <Text style={[styles.time, {color: theme.textFaint}]}>{item.time}</Text>
                      </View>
                      <Text style={[styles.desc, {color: theme.textSoft}]}>{item.description}</Text>
                    </View>
                  </AppCard>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.canvas},
  header: {height: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  spacer: {width: 38},
  trash: {width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line},
  filters: {flexDirection: 'row', gap: 8, paddingHorizontal: 18, paddingBottom: 14},
  chip: {height: 38, paddingHorizontal: 13, borderRadius: 10, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  activeChip: {backgroundColor: colors.ink, borderColor: colors.ink},
  chipText: {fontSize: 12, color: colors.ink, fontWeight: '600'},
  activeChipText: {color: colors.surface},
  content: {paddingHorizontal: 18, paddingBottom: 28},
  group: {marginBottom: 18},
  groupTitle: {marginBottom: 10},
  item: {flexDirection: 'row', gap: 10, padding: 13, marginBottom: 8, shadowOpacity: 0},
  itemIcon: {width: 32, height: 32, borderRadius: 9, backgroundColor: colors.softPurple, alignItems: 'center', justifyContent: 'center'},
  itemBody: {flex: 1},
  itemTop: {flexDirection: 'row', justifyContent: 'space-between', gap: 8},
  itemTitle: {fontWeight: '600', color: colors.ink, fontSize: 13},
  time: {fontSize: 10.5, color: colors.inkFaint},
  desc: {fontSize: 12, color: colors.inkSoft, marginTop: 3},
  empty: {alignItems: 'center', justifyContent: 'center', paddingTop: 80},
  emptyIcon: {width: 58, height: 58, borderRadius: 18, backgroundColor: colors.softPurple, alignItems: 'center', justifyContent: 'center', marginBottom: 12},
});
