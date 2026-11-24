// Qaydalar tab (approved mockup v6, 21 Nov 2026): every Müəllim izahı from the lessons as a question-style rule, grouped by section
// (newest first), with a “needs repeating” card, reference tables and saved rules. No topics are shown to the learner.
import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import { useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon, { type IconName } from '../design/Icons';
import { HomeIcon } from '../home/HomeIcon';
import { AlphabetBoard } from '../design/AlphabetBoard';
import { Reading, TeacherView } from '../design/TaskScreens';
import { d, font, shadow } from '../design/theme';
import { lessonOfCard, RULE_TOPICS, RULES, ruleSearchText, TABLES, type Rule, type RuleTopic, type Table } from '../../data/rules';
import { strengthOf, useRulesStore, type RuleStrength } from '../../store/rulesStore';
import { useUserStore } from '../../store/userStore';

type Tab = 'rules' | 'tables' | 'saved';
const TABS: { id: Tab; label: string }[] = [{ id: 'rules', label: 'Qaydalar' }, { id: 'tables', label: 'Cədvəllər' }, { id: 'saved', label: 'Saxlanılan' }];
const STRENGTH: Record<RuleStrength, { label: string; color: string; dots: number }> = {
  new: { label: 'Hələ məşq olunmayıb', color: '#B79CF0', dots: 0 },
  weak: { label: 'Təkrar istəyir', color: d.orange, dots: 1 },
  learning: { label: 'Öyrənilir', color: d.orange, dots: 2 },
  strong: { label: 'Möhkəm', color: d.green, dots: 3 },
};
/** Code-drawn icon of a rule (by its internal topic; the topic name itself is never shown). */
const TOPIC_ICON: Record<RuleTopic, IconName> = { questions: 'chat', short: 'tag', order: 'layers', polite: 'bye', sound: 'speaker', numbers: 'chart', letters: 'doc', country: 'flag' };
const topicOf = (id: RuleTopic) => RULE_TOPICS.find(t => t.id === id)!;
/** English example without the [ad]-style slots, for speech. */
const spoken = (text: string) => text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();
function Bookmark({ on }: { on: boolean }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M6 3h12v18l-6-4.5L6 21z" stroke={on ? d.orange : d.lavenderText} strokeWidth={2} strokeLinejoin="round" fill={on ? d.orange : 'none'} /></Svg>;
}
const say = (text: string, rate = 0.85) => {
  void Speech.stop().then(() => setAudioModeAsync({ playsInSilentMode: true }).catch(() => {})).then(() => Speech.speak(text, { language: 'en-US', rate }));
};

export function RulesScreen({ topInset, bottomSpace, onOpenLesson }: { topInset: number; bottomSpace: number; onOpenLesson: (lessonId: string, unit: number) => void }) {
  const { seen, starred, stats, load, toggleStar } = useRulesStore();
  const completed = useUserStore(s => s.completedLessons);
  const partial = useUserStore(s => s.lessonPartial) ?? {};
  useEffect(() => { void load(); }, [load]);
  const [tab, setTab] = useState<Tab>('rules');
  const [rule, setRule] = useState<Rule | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [query, setQuery] = useState('');

  // Android back closes the open page before leaving the tab.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (rule) { setRule(null); return true; } if (table) { setTable(null); return true; } return false;
    });
    return () => sub.remove();
  }, [rule, table]);

  const opened = (r: Rule) => Boolean(seen[r.id]) || completed.includes(r.lessonId);
  const started = (lessonId?: string) => Boolean(lessonId && (completed.includes(lessonId) || (partial[lessonId] ?? 0) > 0));
  const strength = (r: Rule) => strengthOf(stats[r.id]);
  const weakRules = useMemo(() => RULES.filter(r => opened(r) && strength(r) === 'weak').sort((a, b) => (stats[b.id]?.wrong ?? 0) - (stats[a.id]?.wrong ?? 0)),
    [seen, stats, completed]); // eslint-disable-line react-hooks/exhaustive-deps

  const Row = ({ r, last }: { r: Rule; last?: boolean }) => {
    const on = opened(r), st = STRENGTH[strength(r)], tp = topicOf(r.topic);
    return <Pressable accessibilityRole="button" disabled={!on} onPress={() => setRule(r)}
      accessibilityLabel={`${r.title}. ${r.eg}${on ? `. ${st.label}` : '. Hələ açılmayıb'}`}
      style={({ pressed }) => [s.row, !last && s.rowLine, !on && { opacity: .5 }, pressed && { backgroundColor: d.bg }]}>
      <View style={[s.tileIcon, { backgroundColor: on ? tp.tint : d.surface }]}><Icon name={TOPIC_ICON[r.topic]} size={20} color={on ? tp.ink : d.lavenderText} /></View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.rowTitle} numberOfLines={2}>{r.title}</Text>
        <Text style={s.rowEg} numberOfLines={1}>{r.eg}</Text>
      </View>
      {on ? <View style={{ flexDirection: 'row', gap: 3 }}>{[0, 1, 2].map(i => <View key={i} style={[s.dot, i < st.dots && { backgroundColor: st.color }]} />)}</View>
        : <HomeIcon name="lock" size={16} color={d.lavenderText} />}
      {starred[r.id] ? <Bookmark on /> : null}
    </Pressable>;
  };
  const Group = ({ list }: { list: Rule[] }) => <View style={[s.group, shadow]}>{list.map((r, i) => <Row key={r.id} r={r} last={i === list.length - 1} />)}</View>;

  // ── One rule ──
  if (rule) {
    const st = STRENGTH[strength(rule)], stat = stats[rule.id], tp = topicOf(rule.topic);
    return <ScrollView contentContainerStyle={[s.page, { paddingTop: topInset + 8, paddingBottom: bottomSpace + 16 }]}>
      <View style={[s.topRow, { paddingRight: 56 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => setRule(null)} style={s.round}><Icon name="back" size={18} color={d.purple} /></Pressable>
        <Text style={s.pill}>Bölmə {rule.unit} · Dərs {rule.lessonNumber}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={starred[rule.id] ? 'Saxlanılandan çıxar' : 'Saxla'} onPress={() => toggleStar(rule.id)} style={s.round}><Bookmark on={Boolean(starred[rule.id])} /></Pressable>
      </View>
      <View style={[s.tileIcon, { backgroundColor: tp.tint, width: 44, height: 44, borderRadius: 14 }]}><Icon name={TOPIC_ICON[rule.topic]} size={24} color={tp.ink} /></View>
      <Text accessibilityRole="header" style={s.ruleTitle}>{rule.title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Dinlə: ${rule.eg}`} onPress={() => say(spoken(rule.eg))} style={s.egStrip}>
        <View style={s.play}><Icon name="play" size={14} color={d.purple} /></View>
        <Text style={s.egText}>{rule.eg}</Text>
      </Pressable>
      <Text style={[s.status, { color: strength(rule) === 'strong' ? d.greenText : strength(rule) === 'new' ? d.lavenderText : d.orangeText }]}>
        ● {st.label}{stat?.wrong ? ` · ${stat.wrong} səhv` : ''}</Text>
      <TeacherView card={rule.card} onPlay={t => say(t)} />
      <Pressable accessibilityRole="button" onPress={() => onOpenLesson(rule.lessonId, rule.unit)} style={({ pressed }) => [s.mainBtn, pressed && { opacity: .9 }]}>
        <Text style={s.mainBtnText}>Dərsə keç</Text><Icon name="arrow" size={16} color="#fff" />
      </Pressable>
    </ScrollView>;
  }

  // ── One table ──
  if (table) return <ScrollView contentContainerStyle={[s.page, { paddingTop: topInset + 8, paddingBottom: bottomSpace + 16 }]}>
    <View style={[s.topRow, { justifyContent: 'flex-start', gap: 10, paddingRight: 56 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => setTable(null)} style={s.round}><Icon name="back" size={18} color={d.purple} /></Pressable>
      <Text accessibilityRole="header" style={s.h2}>{table.title}</Text>
    </View>
    {table.id === 'letters' ? <AlphabetBoard /> : table.groups.map(g => <View key={g.title} style={{ gap: 6 }}>
      {table.groups.length > 1 ? <Text style={s.groupTitle}>{g.title}</Text> : null}
      <View style={[s.tableCard, shadow]}>
        {g.rows.map((r, i) => {
          const open = started(lessonOfCard(r.card)?.id), lesson = lessonOfCard(r.card);
          return <Pressable key={r.key} accessibilityRole="button" disabled={!open} onPress={() => say(r.say)} accessibilityLabel={open ? `${r.big}, ${r.en}` : `${r.big}, bağlıdır`}
            style={[s.tRow, i > 0 && s.tLine, !open && { opacity: .45 }]}>
            <Text style={[s.tBig, { color: table.ink }]} numberOfLines={1}>{r.big}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.tEn}>{open ? r.en : '•••'}</Text>
              {open && r.reading ? <Reading text={r.reading} left /> : null}
              {open && r.note ? <Text style={s.tNote}>{r.note}</Text> : null}
              {!open && lesson ? <Text style={s.tNote}>Bölmə {lesson.unit ?? 1} · Dərs {lesson.number ?? lesson.order}-də açılacaq</Text> : null}
            </View>
            {open ? <View style={s.play}><Icon name="play" size={14} color={d.purple} /></View> : null}
          </Pressable>;
        })}
      </View>
    </View>)}
    {table.foot ? <Text style={s.foot}>{table.foot}</Text> : null}
  </ScrollView>;

  const q = query.trim().toLowerCase();
  const found = q ? RULES.filter(r => ruleSearchText(r).includes(q)) : [];
  const units = [...new Set(RULES.map(r => r.unit))].sort((a, b) => b - a);
  const saved = RULES.filter(r => starred[r.id]);

  return <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.page, { paddingTop: topInset + 8, paddingBottom: bottomSpace + 16 }]}>
    <View style={{ paddingRight: 56, gap: 2 }}>
      <Text accessibilityRole="header" style={s.h1}>Qaydalar</Text>
      <Text style={s.sub}>Unutsan, buradan bax</Text>
    </View>
    <View style={s.searchBox}>
      <Icon name="search" size={18} color={d.lavenderText} />
      <TextInput value={query} onChangeText={setQuery} placeholder="Qayda axtar: from, sual, rəqəm" placeholderTextColor={d.lavenderText} style={s.search} returnKeyType="search" />
      {query ? <Pressable accessibilityRole="button" accessibilityLabel="Təmizlə" onPress={() => setQuery('')} hitSlop={8}><Icon name="close" size={16} color={d.lavenderText} /></Pressable> : null}
    </View>

    {q ? (found.length ? <Group list={found} /> : <Text style={s.foot}>Heç nə tapılmadı.</Text>) : <>
      {weakRules.length ? <View style={[s.dark, shadow]}>
        <Text style={s.darkTitle}>{weakRules.length} qayda təkrar istəyir</Text>
        {weakRules.slice(0, 3).map(r => <Pressable key={r.id} accessibilityRole="button" onPress={() => setRule(r)} style={s.darkRow}>
          <View style={[s.dot, { backgroundColor: d.orange }]} /><Text style={s.darkRowText} numberOfLines={1}>{r.title}</Text>
          <Icon name="arrow" size={14} color="#fff" />
        </Pressable>)}
      </View> : null}
      <View style={s.tabs} accessibilityRole="tablist">
        {TABS.map(t => <Pressable key={t.id} accessibilityRole="tab" accessibilityState={{ selected: tab === t.id }}
          onPress={() => setTab(t.id)} style={[s.tab, tab === t.id && s.tabOn]}><Text style={[s.tabText, tab === t.id && { color: '#fff' }]}>{t.label}</Text></Pressable>)}
      </View>
      {tab === 'rules' ? <View style={{ gap: 14 }}>{units.map(u => {
        const list = RULES.filter(r => r.unit === u), open = list.filter(opened).length;
        return <View key={u} style={{ gap: 8 }}>
          <View style={s.secHead}>
            <View style={s.secBadge}><Text style={s.secNum}>{u}</Text></View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.secTitle}>Bölmə {u} · {list[0].section}</Text>
              <View style={s.bar}><View style={{ width: `${(open / list.length) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: d.purple }} /></View>
            </View>
            <Text style={s.secCount}>{open}/{list.length}</Text>
          </View>
          <Group list={list} />
        </View>;
      })}</View>
        : tab === 'tables' ? <View style={[s.group, shadow]}>{TABLES.map((t, i) => <Pressable key={t.id} accessibilityRole="button" onPress={() => setTable(t)}
          style={({ pressed }) => [s.row, i < TABLES.length - 1 && s.rowLine, pressed && { backgroundColor: d.bg }]}>
          <View style={[s.tileIcon, { backgroundColor: t.tint }]}><Text style={[s.tileText, { color: t.ink }]}>{t.id === 'numbers' ? '123' : t.id === 'letters' ? 'ABC' : t.id === 'short' ? "I'm" : t.id === 'phone' ? '@' : 'UK'}</Text></View>
          <View style={{ flex: 1, gap: 2 }}><Text style={s.rowTitle}>{t.title}</Text><Text style={s.rowEg} numberOfLines={1}>{t.sub}</Text></View>
          <Icon name="arrow" size={16} color={d.purple} />
        </Pressable>)}</View>
          : saved.length ? <Group list={saved} /> : <Text style={s.foot}>Qaydanı saxla — burada toplanacaq.</Text>}
    </>}
  </ScrollView>;
}

const s = StyleSheet.create({
  sub: { color: d.lavenderText, fontSize: 15, ...font.bold },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border, paddingHorizontal: 14 },
  dark: { gap: 6, padding: 14, borderRadius: 22, backgroundColor: '#2A1B5C' },
  darkTitle: { color: '#fff', fontSize: 16, ...font.extrabold },
  darkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 34 },
  darkRowText: { flex: 1, color: '#E6DAFB', fontSize: 14, ...font.bold },
  group: { borderRadius: 22, backgroundColor: '#fff', overflow: 'hidden' },
  rowLine: { borderBottomWidth: 1, borderBottomColor: d.bg },
  rowEg: { color: d.purple, fontSize: 13, ...font.bold },
  tileText: { fontSize: 13, ...font.extrabold },
  secHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  secNum: { color: '#fff', fontSize: 15, ...font.extrabold },
  secTitle: { color: d.ink, fontSize: 15, ...font.extrabold },
  secCount: { color: d.lavenderText, fontSize: 13, ...font.extrabold },
  egStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 18, backgroundColor: d.purpleSoft },
  egText: { flex: 1, color: d.purple, fontSize: 18, ...font.extrabold },
  page: { paddingHorizontal: 16, gap: 12, backgroundColor: d.bg, flexGrow: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  h1: { color: d.purple, fontSize: 26, ...font.extrabold },
  h2: { color: d.ink, fontSize: 22, ...font.extrabold },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border, alignItems: 'center', justifyContent: 'center' },
  pill: { color: d.lavenderText, fontSize: 13, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, overflow: 'hidden', ...font.bold },
  search: { flex: 1, height: 46, color: d.ink, fontSize: 16, ...font.semibold },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22, backgroundColor: d.purple },
  heroTitle: { color: '#fff', fontSize: 16, ...font.extrabold },
  heroSub: { color: d.purpleSoft, fontSize: 13, ...font.bold },
  attention: { gap: 6, padding: 12, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: d.orangeSoft },
  attTitle: { color: d.orangeText, fontSize: 14, ...font.extrabold },
  attRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 32 },
  badge: { color: d.orangeText, backgroundColor: d.orangeSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, fontSize: 12, overflow: 'hidden', ...font.bold },
  tabs: { flexDirection: 'row', gap: 6 },
  tab: { paddingHorizontal: 13, height: 36, borderRadius: 18, justifyContent: 'center', backgroundColor: d.surface, borderWidth: 1, borderColor: d.border },
  tabOn: { backgroundColor: d.purple, borderColor: d.purple },
  tabText: { color: d.lavenderText, fontSize: 14, ...font.extrabold },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', flexGrow: 1, gap: 4, padding: 12, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border },
  tileIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tileIconText: { fontSize: 19, ...font.extrabold },
  bar: { height: 6, borderRadius: 3, backgroundColor: d.purpleSoft, overflow: 'hidden', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 60 },
  rowTitle: { color: d.ink, fontSize: 15, ...font.extrabold },
  rowSub: { color: d.lavenderText, fontSize: 13, ...font.bold },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: d.purpleSoft },
  groupTitle: { color: d.lavenderText, fontSize: 13, letterSpacing: .3, marginTop: 4, ...font.extrabold },
  ruleTitle: { color: d.ink, fontSize: 26, lineHeight: 32, ...font.extrabold },
  status: { fontSize: 14, marginTop: -6, ...font.bold },
  mainBtn: { flexDirection: 'row', gap: 8, height: 52, borderRadius: 26, backgroundColor: d.purple, alignItems: 'center', justifyContent: 'center' },
  mainBtnText: { color: '#fff', fontSize: 17, ...font.extrabold },
  tableCard: { borderRadius: 20, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 4 },
  tRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, minHeight: 52 },
  tLine: { borderTopWidth: 1, borderTopColor: d.bg },
  tBig: { minWidth: 48, fontSize: 20, textAlign: 'center', ...font.extrabold },
  tEn: { color: d.ink, fontSize: 16, ...font.extrabold },
  tNote: { color: d.lavenderText, fontSize: 12, ...font.bold },
  play: { width: 32, height: 32, borderRadius: 16, backgroundColor: d.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  foot: { color: d.inkSoft, fontSize: 14, textAlign: 'center', ...font.bold },
});
