import { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useUserStore } from '../store/userStore';
export default function EarnedXP({ receiptId = '' }: { receiptId?: string }) {
  const [xp, setXP] = useState(0);
  const claimed = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const animated = useRef(false);
  useEffect(() => {
    if (claimed.current) return;
    claimed.current = true;
    const receipt = useUserStore.getState().claimReceipt(receiptId);
    setXP(receipt?.xp ?? 0);
  }, [receiptId]);
  useEffect(() => {
    if (xp > 0 && !reduced && !animated.current) {
      animated.current = true;
      opacity.setValue(0);
      Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    }
    if (reduced) { opacity.stopAnimation(); opacity.setValue(1); }
  }, [xp, reduced, opacity]);
  return <Animated.View style={{ opacity }}><Text accessibilityLiveRegion="polite" style={{ color: '#ffb24d', fontSize: 16, fontWeight: '800', textAlign: 'center' }}>+{xp} XP</Text></Animated.View>;
}
