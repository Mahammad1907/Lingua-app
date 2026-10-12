import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
} from 'react-native-svg';
import { getLessonById } from '../../data/lessons';
import { getAllModules } from '../../data/modules';
import { useUserStore } from '../../store/userStore';

const STEP = 180;
const FIRST_Y = 64;
const CARD_H = 88;
const AVATAR = 94;

function LockIcon() {
  return (
    <Svg width={48} height={52} viewBox="0 0 48 52">
      <Path
        d="M13 24 V15 C13 0 35 0 35 15 V24"
        stroke="#c6d1ed"
        strokeWidth={5}
        fill="none"
      />
      <Rect
        x={5}
        y={21}
        width={38}
        height={29}
        rx={8}
        fill="#92a2cb"
      />
      <Rect
        x={8}
        y={22}
        width={32}
        height={24}
        rx={6}
        fill="#b6c2df"
      />
      <Circle cx={24} cy={33} r={4} fill="#283751" />
      <Path
        d="M24 34 V40"
        stroke="#283751"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function Island({ house = false }: { house?: boolean }) {
  return (
    <Svg width={108} height={85} viewBox="0 0 108 85">
      <Ellipse
        cx={53}
        cy={71}
        rx={49}
        ry={10}
        fill="#167295"
        opacity={0.2}
      />
      <Path
        d="M5 58 L25 44 L71 46 L102 60
           L85 73 L34 77 L9 68 Z"
        fill="#243b50"
      />
      <Path
        d="M5 58 L25 44 L71 46 L102 60
           L74 67 L31 66 Z"
        fill="#426b5c"
      />
      <Path
        d="M12 58 L29 48 L68 49 L92 60 L68 63 L34 61 Z"
        fill="#527b60"
      />
      {house ? (
        <>
          <Path d="M38 34 H70 V59 H38 Z" fill="#b8b5c1" />
          <Path d="M70 34 L81 40 V56 L70 59 Z" fill="#787b98" />
          <Path d="M31 36 L54 15 L80 36 Z" fill="#945f7d" />
          <Path d="M54 15 L67 13 L88 36 L80 36 Z" fill="#6e526e" />
          <Rect x={50} y={44} width={9} height={15} fill="#36415a" />
          <Rect x={40} y={41} width={6} height={7} fill="#ffdc95" />
          <Path d="M20 54 V37" stroke="#786448" strokeWidth={3} />
          <Path d="M10 43 L20 18 L30 43 Z" fill="#285b4c" />
          <Path d="M12 48 L20 29 L28 48 Z" fill="#36775b" />
        </>
      ) : (
        <>
          <Path d="M25 58 V32 M75 57 V28" stroke="#786448" strokeWidth={4} />
          <Path d="M10 39 L25 5 L40 39 Z" fill="#23554c" />
          <Path d="M13 48 L25 21 L37 48 Z" fill="#34795d" />
          <Path d="M60 35 L75 2 L90 35 Z" fill="#285d51" />
          <Path d="M63 45 L75 19 L87 45 Z" fill="#3c8065" />
          <Path d="M39 57 L51 31 L68 58 Z" fill="#85849c" />
          <Path d="M51 31 L68 58 L55 54 Z" fill="#5d607b" />
        </>
      )}
    </Svg>
  );
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const completedLessons = useUserStore((s) => s.completedLessons);
  const level = useUserStore((s) => s.level);
  const allModules = useMemo(() => getAllModules(), []);

  const mapWidth = Math.min(width - 32, 460);
  const offset = Math.min(32, mapWidth * 0.09);
  const cardWidth = mapWidth - offset;

  const modules = useMemo(() => {
    const progress = allModules.map((module) => {
      const lessons = module.lessonIds
        .map((id) => getLessonById(id))
        .filter((lesson): lesson is NonNullable<typeof lesson> =>
          lesson !== undefined
        );

      const count = lessons.filter((lesson) =>
        completedLessons.includes(lesson.id)
      ).length;

      return {
        module,
        count,
        total: lessons.length,
        completed: lessons.length > 0 && count === lessons.length,
      };
    });

    return progress.map((item, index) => ({
      ...item,
      locked:
        !item.completed &&
        index > 0 &&
        !progress[index - 1].completed,
    }));
  }, [allModules, completedLessons]);

  const mapHeight = modules.length
    ? FIRST_Y + (modules.length - 1) * STEP + 230
    : 240;

  const levelLabel =
    level === 'A1' || level === 'A2'
      ? 'Başlanğıc'
      : level === 'B1' || level === 'B2'
      ? 'Orta'
      : 'Öyrənmə yolu';

  return (
    <LinearGradient
      colors={['#060c20', '#08213b', '#07162d']}
      style={styles.screen}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.header, { width: mapWidth }]}>
          <View style={styles.headingRow}>
            <View style={styles.headingIcon}>
              <Svg width={26} height={26} viewBox="0 0 26 26">
                <Path
                  d="M3 5 L9 3 L17 6 L23 4 V21
                     L17 23 L9 20 L3 22 Z"
                  fill="none"
                  stroke="#b8c8ea"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                <Path
                  d="M9 3 V20 M17 6 V23"
                  stroke="#b8c8ea"
                  strokeWidth={1.8}
                />
              </Svg>
            </View>
            <Text style={styles.heading}>İngilis dili</Text>
          </View>

          <View style={styles.levelChip}>
            <Text style={styles.levelText}>
              {level} · {levelLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.map, { width: mapWidth, height: mapHeight }]}>
          {modules.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Hələ bölmə yoxdur</Text>
              <Text style={styles.emptyText}>
                Bölmələr əlavə ediləndə burada görünəcək.
              </Text>
            </View>
          ) : (
            <>
              {/* Tək kart olduqda da fon dekorları görünür. */}
              {Array.from({ length: modules.length + 1 }, (_, index) => (
                <View
                  key={`island-${index}`}
                  pointerEvents="none"
                  style={[
                    styles.island,
                    {
                      top: index === 0
                        ? 0
                        : FIRST_Y + (index - 1) * STEP + CARD_H + 6,
                      left: index % 2 === 0 ? mapWidth - 100 : -8,
                    },
                  ]}
                >
                  <Island house={index % 3 === 1} />
                </View>
              ))}

              <Svg
                width={mapWidth}
                height={mapHeight}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              >
                {modules.map((item, index) => {
                  const left = index % 2 === 0 ? 0 : offset;
                  const startX = left + cardWidth * 0.68;
                  const startY = FIRST_Y + index * STEP + CARD_H;
                  const nextLeft = (index + 1) % 2 === 0 ? 0 : offset;
                  const endX = nextLeft + AVATAR / 2;
                  const endY = FIRST_Y + (index + 1) * STEP + 5;
                  const bendY = startY + (endY - startY) * 0.55;

                  return (
                    <Path
                      key={`road-${item.module.id}`}
                      d={`M ${startX} ${startY}
                          C ${startX} ${bendY},
                            ${endX} ${bendY},
                            ${endX} ${endY}`}
                      stroke={item.completed ? '#43cda9' : '#6474d7'}
                      strokeWidth={3}
                      strokeDasharray="7 10"
                      strokeLinecap="round"
                      fill="none"
                      opacity={0.8}
                    />
                  );
                })}
              </Svg>

              {modules.map((item, index) => {
                const current = !item.locked && !item.completed;
                const accent = item.completed
                  ? '#64ddaa'
                  : current
                  ? '#ff9b52'
                  : '#4a587d';

                return (
                  <TouchableOpacity
                    key={item.module.id}
                    activeOpacity={0.88}
                    disabled={item.locked}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: item.locked }}
                    accessibilityLabel={`${item.module.titleAz}, ${
                      item.locked ? 'kilidli' : 'bölməni aç'
                    }`}
                    onPress={() =>
                      router.push(`/module/${item.module.id}`)
                    }
                    style={[
                      styles.mapItem,
                      {
                        top: FIRST_Y + index * STEP,
                        left: index % 2 === 0 ? 0 : offset,
                        width: cardWidth,
                      },
                    ]}
                  >
                    {/* Kart və avatar ayrıdır, təsvir kəsilmir. */}
                    <View
                      style={[
                        styles.card,
                        {
                          borderColor: item.locked
                            ? '#25365a'
                            : `${accent}66`,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={
                          item.locked
                            ? ['#122341', '#0c1c36']
                            : ['#162b57', '#0d2047']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardFill}
                      >
                        <View style={styles.textArea}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.title,
                              item.locked && styles.lockedTitle,
                            ]}
                          >
                            {index + 1}. {item.module.titleAz}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={styles.subtitle}
                          >
                            {item.module.description}
                          </Text>
                          <Text style={styles.progress}>
                            {item.count}/{item.total} dərs
                            {item.locked ? ' · Kilidli' : ''}
                          </Text>
                        </View>

                        {!item.locked && (
                          <Text style={[styles.arrow, { color: accent }]}>
                            ›
                          </Text>
                        )}
                      </LinearGradient>
                    </View>

                    <View
                      style={[
                        styles.avatarOuter,
                        {
                          borderColor: accent,
                          backgroundColor: item.locked
                            ? '#14213b'
                            : '#1b4260',
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={
                          item.locked
                            ? ['#293553', '#17223b']
                            : ['#24567a', '#285547']
                        }
                        style={styles.avatarInner}
                      >
                        {item.locked ? (
                          <LockIcon />
                        ) : index === 0 ? (
                          <Image
                            source={require('../../../assets/mascot/fox_normal.png')}
                            style={styles.fox}
                            resizeMode="contain"
                          />
                        ) : (
                          <Text style={styles.moduleIcon}>
                            {item.module.icon || '📚'}
                          </Text>
                        )}
                      </LinearGradient>

                      {item.completed && (
                        <View style={styles.checkBadge}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 62,
    paddingBottom: 110,
  },
  header: { paddingHorizontal: 4, marginBottom: 12 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headingIcon: { marginRight: 14 },
  heading: {
    color: '#f1f5ff',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  levelChip: {
    alignSelf: 'flex-start',
    marginLeft: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1b2851',
    borderWidth: 1,
    borderColor: '#303c69',
  },
  levelText: { color: '#dce5fa', fontSize: 13, fontWeight: '700' },
  map: { position: 'relative' },
  island: { position: 'absolute', opacity: 0.9 },
  mapItem: { position: 'absolute', height: CARD_H },
  card: {
    position: 'absolute',
    left: 38,
    right: 0,
    top: 0,
    height: CARD_H,
    borderRadius: 44,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 64,
    paddingRight: 12,
  },
  textArea: { flex: 1 },
  title: {
    color: '#f2f5ff',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  lockedTitle: { color: '#becbe4' },
  subtitle: { color: '#9dadcc', fontSize: 12, marginTop: 4 },
  progress: { color: '#92a9cb', fontSize: 10, marginTop: 5 },
  arrow: { fontSize: 27, marginLeft: 5 },
  avatarOuter: {
    position: 'absolute',
    left: 0,
    top: -5,
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 3,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: AVATAR / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fox: { width: 82, height: 86 },
  moduleIcon: { fontSize: 36 },
  checkBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#64ddaa',
    borderWidth: 2,
    borderColor: '#10253e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: { color: '#144335', fontWeight: '900', fontSize: 14 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyTitle: { color: '#e7efff', fontSize: 18, fontWeight: '700' },
  emptyText: {
    color: '#9dadcc',
    marginTop: 8,
    textAlign: 'center',
  },
});