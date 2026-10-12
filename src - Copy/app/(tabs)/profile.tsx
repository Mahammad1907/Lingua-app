import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';

export default function Profile() {
  const router = useRouter();

  const xp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak);
  const hearts = useUserStore((s) => s.hearts);
  const level = useUserStore((s) => s.level);
  const resetAll = useUserStore((s) => s.resetAll);

  const handleLogout = () => {
    Alert.alert('Hesabdan çıx', 'Əminsən?', [
      { text: 'Xeyr', style: 'cancel' },
      {
        text: 'Bəli',
        style: 'destructive',
        onPress: () => {
          resetAll();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={['#0a0a1a', '#1a0f3a', '#0a0a1a']}
      style={styles.background}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.pageTitle}>Profil</Text>
            <Text style={styles.greeting}>Salam, Mahammad 👋</Text>
            <Text style={styles.subtitle}>İngilis dili • {level}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.settingsButton}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={colors.grad.avatar as unknown as [string, string, ...string[]]}
              style={styles.avatar}
            >
              <Text style={styles.avatarIcon}>👤</Text>
            </LinearGradient>
          </View>
        </View>

        {/* STATISTIKA KARTI - 3 STAT */}
        <LinearGradient
          colors={colors.grad.statsCard as unknown as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsCard}
        >
          <View style={styles.statItem}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIcon}>⭐</Text>
            </View>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statSub}>+0 bu gün</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIcon}>🔥</Text>
            </View>
            <Text style={styles.statLabel}>Gündəlik giriş</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statSub}>gün</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIcon}>❤️</Text>
            </View>
            <Text style={styles.statLabel}>Ürək</Text>
            <Text style={styles.statValue}>{hearts}</Text>
            <Text style={styles.statSub}>qalan</Text>
          </View>
        </LinearGradient>

        {/* Dil kartı */}
        <Text style={styles.sectionLabel}>ÖYRƏNDİYİM DİL</Text>

        <LinearGradient
          colors={['rgba(30, 27, 75, 0.9)', 'rgba(76, 29, 149, 0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.languageCard}
        >
          <View style={styles.flagWrapper}>
            <Text style={styles.flag}>🇬🇧</Text>
          </View>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>İngilis</Text>
            <Text style={styles.languageSubtitle}>{level} • Beginner</Text>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Dəyiş →</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Tənzimləmələr */}
        <Text style={styles.sectionLabel}>TƏNZİMLƏMƏLƏR</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: colors.helper.indigo + '33' },
            ]}
          >
            <Text style={styles.menuIconText}>🔔</Text>
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Bildirişlər</Text>
            <Text style={styles.menuSubtitle}>Yeni dərslər və xatırlatmalar</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: colors.helper.violet + '33' },
            ]}
          >
            <Text style={styles.menuIconText}>🎯</Text>
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Gündəlik məqsəd</Text>
            <Text style={styles.menuSubtitle}>Öyrənmə vərdişlərini qur</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: colors.helper.pink + '33' },
            ]}
          >
            <Text style={styles.menuIconText}>💎</Text>
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Premium</Text>
            <Text style={styles.menuSubtitle}>Daha çox imkan əldə et</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: colors.helper.blue + '33' },
            ]}
          >
            <Text style={styles.menuIconText}>?</Text>
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Kömək</Text>
            <Text style={styles.menuSubtitle}>Tez-tez verilən suallar</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Lingua App v0.1</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 80, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerLeft: { flex: 1 },
  headerRight: { alignItems: 'flex-end', gap: 10 },
  pageTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1.2,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceGlass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brd.light,
  },
  settingsIcon: { fontSize: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.brd.light,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarIcon: { fontSize: 38 },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 18,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.borderGlow,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: { fontSize: 24 },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1.8,
    marginBottom: 12,
    marginTop: 4,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.brd.light,
  },
  flagWrapper: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.surfaceGlass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.brd.light,
  },
  flag: { fontSize: 38 },
  languageInfo: { flex: 1 },
  languageName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  languageSubtitle: {
    fontSize: 13,
    color: colors.txt.accent,
    fontWeight: '600',
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.brd.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brd.strong,
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 18, 45, 0.7)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.brd.default,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIconText: { fontSize: 22 },
  menuInfo: { flex: 1 },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
});