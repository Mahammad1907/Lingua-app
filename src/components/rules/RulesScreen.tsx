// Qaydalar tab (approved mockup, 21 Nov 2026): every Müəllim izahı from the lessons, grouped by topic or section,
// with the learner's weak rules on top, starred rules, and reference tables (numbers, letters, short forms …).
import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import { useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from '../design/Icons';
import { HomeIcon } from '../home/HomeIcon';
import { AlphabetBoard } from '../design/AlphabetBoard';
import { Reading, TeacherView } from '../design/TaskScreens';
import { d, font, shadow } from '../design/theme';
import { lessonLabel, lessonOfCard, RULE_TOPICS, RULES, ruleSearchText, TABLES, type Rule, type RuleTopic, type Table } from '../../data/rules';
import { strengthOf, useRulesStore, type RuleStrength } from '../../store/rulesStore';
import { useUserStore } from '../../store/userStore';

type Tab = 'topics' | 'sections' | 'tables' | 'starred';
const TABS: { id: Tab; label: string }[] = [{ id: 'topics', label: 'Mövzular' }, { id: 'sections', label: 'Bölmələr' }, { id: 'tables', label: 'Cədvəllər' }, { id: 'starred', label: '★' }];
const STRENGTH: Record<RuleStrength, { label: string; color: string; dots: number }> = {
  new: { label: 'Hələ məşq olunmayıb', color: '#B79CF0', dots: 0 },
  weak: { label: 'Zəif', color: d.orange, dots: 1 },
  learning: { label: 'Öyrənilir', color: d.orange, dots: 2 },
  strong: { label: 'Möhkəm', color: d.green, dots: 3 },
};
const say = (text: string, rate = 0.85) => {
  void Speech.stop().then(() => setAudioModeAsync({ playsInSilentMode: true }).catch(() => {})).then(() => Speech.speak(text, { language: 'en-US', rate }));
};

export function RulesScreen({ topInset, bottomSpace, onOpenLesson }: { topInset: number; bottomSpace: number; onOpenLesson: (lessonId: string, unit: number) => void }) {
  const { seen, starred, stats, load, toggleStar } = useRulesStore();
  const completed = useUserStore(s => s.completedLessons);
  const partial = useUserStore(s => s.lessonPartial) ?? {};
  useEffect(() => { void load(); }, [load]);
  const [tab, setTab] = useState<Tab>('topics');
  const [topic, setTopic] = useState<RuleTopic | null>(null);
  const [rule, setRule] = useState<Rule | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [query, setQuery] = useState<string | null>(null);

  // Android back closes the open page before leaving the tab.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (rule) { setRule(null); return true; } if (table) { setTable(null); return true; } if (topic) { setTopic(null); return true; }
      if (query !== null) { setQuery(null); return true; } return false;
    });
    return () => sub.remove();
  }, [rule, table, topic, query]);

  const opened = (r: Rule) => Boolean(seen[r.id]) || completed.includes(r.lessonId);
  const started = (lessonId?: string) => Boolean(lessonId && (completed.includes(lessonId) || (partial[lessonId] ?? 0) > 0));
  const strength = (r: Rule) => strengthOf(stats[r.id]);
  const openCount = RULES.filter(opened).length;
  const strong = RULES.filter(r => opened(r) && strength(r) === 'strong').length;
  const weakRules = useMemo(() => RULES.filter(r => opened(r) && strength(r) === 'weak').sort((a, b) => (stats[b.id]?.wrong ?? 0) - (stats[a.id]?.wrong ?? 0)),
    [seen, stats, completed]); // eslint-disable-line react-hooks/exhaustive-deps

  const Row = ({ r }: { r: Rule }) => {
    const on = opened(r), st = STRENGTH[strength(r)];
    return <Pressable accessibilityRole="button" disabled={!on} onPress={() => setRule(r)}
      accessibilityLabel={`${r.title}, ${lessonLabel({ unit: r.unit, number: r.lessonNumber, order: r.lessonNumber, part: r.part as 1 | 2 | 3 | undefined })}${on ? `, ${st.label}` : ', bağlıdır'}`}
      style={({ pressed }) => [s.row, !on && { opacity: .55 }, pressed && { transform: [{ scale: .98 }] }]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.rowTitle} numberOfLines={2}>{r.title}</Text>
        <Text style={s.rowSub}>{on ? `Bölmə ${r.unit} · Dərs ${r.lessonNumber}` : `Bölmə ${r.unit} · Dərs ${r.lessonNumber}-də açılacaq`}</Text>
      </View>
      {on ? <View style={{ flexDirection: 'row', gap: 4 }}>{[0, 1, 2].map(i => <View key={i} style={[s.dot, i < st.dots && { backgroundColor: st.color }]} />)}</View>
        : <HomeIcon name="lock" size={16} color={d.lavenderText} />}
      {starred[r.id] ? <Text style={{ color: d.orange, fontSize: 16 }}>★</Text> : null}
    </Pressable>;
  };

  // ── One rule ──
  if (rule) {
    const st = STRENGTH[strength(rule)], stat = stats[rule.id];
    return <ScrollView contentContainerStyle={[s.page, { paddingTop: topInset + 8, paddingBottom: bottomSpace + 16 }]}>
      <View style={s.topRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => setRule(null)} style={s.round}><Icon name="back" size={18} color={d.purple} /></Pressable>
        <Text style={s.pill}>Bölmə {rule.unit} · Dərs {rule.lessonNumber}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={starred[rule.id] ? 'Ulduzu götür' : 'Ulduzla'} onPress={() => toggleStar(rule.id)} style={s.round}>
          <Text style={{ color: starred[rule.id] ? d.orange : d.lavenderText, fontSize: 20 }}>{starred[rule.id] ? '★' : '☆'}</Text></Pressable>
      </View>
      <Text accessibilityRole="header" style={s.ruleTitle}>{rule.title}</Text>
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
    <View style={[s.topRow, { justifyContent: 'flex-start', gap: 10 }]}>
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

  const q = (query ?? '').trim().toLowerCase();
  const found = q ? RULES.filter(r => ruleSearchText(r).includes(q)) : [];
  const topicRules = topic ? RULES.filter(r => r.topic === topic) : [];
  const units = [...new Set(RULES.map(r => r.unit))].sort((a, b) => b - a);

  return <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.page, { paddingTop: topInset + 8, paddingBottom: bottomSpace + 16 }]}>
    <View style={s.topRow}>
      {topic ? <Pressable accessibilityRole="button" accessibilityLabel="Geri" onPress={() => setTopic(null)} style={s.round}><Icon name="back" size={18} color={d.purple} /></Pressable> : null}
      <Text accessibilityRole="header" style={[s.h1, topic && { flex: 1, fontSize: 22, color: d.ink }]}>{topic ? RULE_TOPICS.find(t => t.id === topic)!.title : 'Qaydalar'}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Qayda axtar" onPress={() => setQuery(query === null ? '' : null)} style={s.round}>
        <Icon name={query === null ? 'search' : 'close'} size={18} color={d.purple} /></Pressable>
    </View>
    {query !== null ? <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Qayda axtar: from, sual, rəqəm…" placeholderTextColor={d.lavenderText} style={s.search} /> : null}

    {q ? <View style={{ gap: 8 }}>{found.length ? found.map(r => <Row key={r.id} r={r} />) : <Text style={s.foot}>Heç nə tapılmadı.</Text>}</View>
      : topic ? <View style={{ gap: 8 }}>{topicRules.map(r => <Row key={r.id} r={r} />)}</View>
      : <>
        <View style={[s.hero, shadow]}>
          <Svg width={58} height={58}><Circle cx={29} cy={29} r={23} stroke="#8E63E8" strokeWidth={6} fill="none" />
            <Circle cx={29} cy={29} r={23} stroke={d.orange} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 23 * (openCount / Math.max(RULES.length, 1))} 200`} transform="rotate(-90 29 29)" /></Svg>
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>{RULES.length} qaydadan {openCount}-i açılıb</Text>
            <Text style={s.heroSub}>{strong} möhkəm · {weakRules.length} zəif</Text>
          </View>
        </View>
        {weakRules.length ? <View style={s.attention}>
          <Text style={s.attTitle}>Diqqət lazımdır</Text>
          {weakRules.slice(0, 3).map(r => <Pressable key={r.id} accessibilityRole="button" onPress={() => setRule(r)} style={s.attRow}>
            <View style={[s.dot, { backgroundColor: d.orange }]} /><Text style={[s.rowTitle, { flex: 1 }]} numberOfLines={1}>{r.title}</Text>
            <Text style={s.badge}>{stats[r.id]?.wrong ?? 0} səhv</Text>
          </Pressable>)}
        </View> : null}
        <View style={s.tabs} accessibilityRole="tablist">
          {TABS.map(t => <Pressable key={t.id} accessibilityRole="tab" accessibilityLabel={t.id === 'starred' ? 'Ulduzlu' : t.label} accessibilityState={{ selected: tab === t.id }}
            onPress={() => setTab(t.id)} style={[s.tab, tab === t.id && s.tabOn]}><Text style={[s.tabText, tab === t.id && { color: '#fff' }]}>{t.label}</Text></Pressable>)}
        </View>
        {tab === 'topics' ? <View style={s.grid}>{RULE_TOPICS.map(t => {
          const all = RULES.filter(r => r.topic === t.id), open = all.filter(opened).length;
          if (!all.length) return null;
          return <Pressable key={t.id} accessibilityRole="button" accessibilityLabel={`${t.title}, ${all.length} qaydadan ${open}`} onPress={() => setTopic(t.id)}
            style={({ pressed }) => [s.tile, pressed && { transform: [{ scale: .98 }] }]}>
            <View style={[s.tileIcon, { backgroundColor: t.tint }]}><Text style={[s.tileIconText, { color: t.ink }]}>{t.icon}</Text></View>
            <Text style={s.rowTitle} numberOfLines={2}>{t.title}</Text>
            <Text style={s.rowSub}>{open} / {all.length} qayda</Text>
            <View style={s.bar}><View style={{ width: `${(open / all.length) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: t.bar }} /></View>
          </Pressable>;
        })}</View>
          : tab === 'sections' ? <View style={{ gap: 8 }}>{units.map(u => <View key={u} style={{ gap: 8 }}>
            <Text style={s.groupTitle}>Bölmə {u} · {RULES.find(r => r.unit === u)?.section}</Text>
            {RULES.filter(r => r.unit === u).map(r => <Row key={r.id} r={r} />)}
          </View>)}</View>
          : tab === 'tables' ? <View style={{ gap: 8 }}>{TABLES.map(t => <Pressable key={t.id} accessibilityRole="button" onPress={() => setTable(t)}
            style={({ pressed }) => [s.row, pressed && { transform: [{ scale: .98 }] }]}>
            <View style={[s.tileIcon, { backgroundColor: t.tint }]}><Text style={[s.tileIconText, { color: t.ink, fontSize: 15 }]}>{t.id === 'numbers' ? '123' : t.id === 'letters' ? 'ABC' : t.id === 'short' ? "I'm" : t.id === 'phone' ? '@' : '⚑'}</Text></View>
            <View style={{ flex: 1, gap: 2 }}><Text style={s.rowTitle}>{t.title}</Text><Text style={s.rowSub} numberOfLines={1}>{t.sub}</Text></View>
            <Icon name="arrow" size={16} color={d.purple} />
          </Pressable>)}</View>
          : <View style={{ gap: 8 }}>{RULES.filter(r => starred[r.id]).length ? RULES.filter(r => starred[r.id]).map(r => <Row key={r.id} r={r} />)
            : <Text style={s.foot}>Qaydanı ulduzla (☆) — burada toplanacaq.</Text>}</View>}
      </>}
  </ScrollView>;
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, gap: 12, backgroundColor: d.bg, flexGrow: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  h1: { color: d.purple, fontSize: 26, ...font.extrabold },
  h2: { color: d.ink, fontSize: 22, ...font.extrabold },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border, alignItems: 'center', justifyContent: 'center' },
  pill: { color: d.lavenderText, fontSize: 13, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, overflow: 'hidden', ...font.bold },
  search: { height: 46, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border, paddingHorizontal: 14, color: d.ink, fontSize: 16, ...font.semibold },
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: d.border, minHeight: 56 },
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
