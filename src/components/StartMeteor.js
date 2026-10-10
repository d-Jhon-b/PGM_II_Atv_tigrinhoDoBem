import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
  interpolateColor,
  Extrapolation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const ANGLE_DEG = 32;
const TAIL_LENGTH = 280;
const BOX_H = 120;

const METEOR_DURATION = 3800;
const BURST_DURATION = 1200;

const FOLLOW = 0.85;
const ZOOM_END = 1.25;
const START_TILT = -2.5;

const BG_COLOR = '#0D1B2A';
const PURPLE_COLOR = '#A855F7';
const GOLD_COLOR = '#FFD700';
const CLAMP = Extrapolation.CLAMP;

function useParallax(progress, dx, dy, depth) {
  return useAnimatedStyle(() => {
    const k = (1 - progress.value) * FOLLOW * depth;
    return { transform: [{ translateX: dx * k }, { translateY: dy * k }] };
  });
}

export default function StartMeteor({ isWinner = false, onAnimationComplete }) {
  const { width, height } = useWindowDimensions();
  const cx = width / 2;
  const cy = height / 2;

  const distance = Math.hypot(width, height) / 2 + TAIL_LENGTH;
  const rad = (ANGLE_DEG * Math.PI) / 180;
  const dx = Math.cos(rad) * distance;
  const dy = Math.sin(rad) * distance;

  const progress = useSharedValue(0);
  const burst = useSharedValue(0);

  const targetColor = isWinner ? GOLD_COLOR : PURPLE_COLOR;

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: METEOR_DURATION,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    burst.value = withDelay(
      METEOR_DURATION,
      withTiming(
        1,
        { duration: BURST_DURATION, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished && onAnimationComplete) runOnJS(onAnimationComplete)();
        }
      )
    );
  }, []);

  const animatedColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.25, 0.80],
      [PURPLE_COLOR, PURPLE_COLOR, targetColor]
    );
    return { backgroundColor: color };
  });

  const animatedBorderColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.25, 0.80],
      [PURPLE_COLOR, PURPLE_COLOR, targetColor]
    );
    return { borderColor: color };
  });

  const purpleTrailStyle = useAnimatedStyle(() => {
    const opacity = isWinner
      ? interpolate(progress.value, [0.25, 0.80], [1, 0], CLAMP)
      : 1;
    return { opacity };
  });

  const goldTrailStyle = useAnimatedStyle(() => {
    const opacity = isWinner
      ? interpolate(progress.value, [0.25, 0.80], [0, 1], CLAMP)
      : 0;
    return { opacity };
  });

  const layers = useMemo(() => {
    const make = (density, depth, sizeMin, sizeMax, maxCount) => {
      const S = distance * FOLLOW * depth;
      const area = (width + S) * (height + S);
      const count = Math.min(maxCount, Math.round(area * density));
      return Array.from({ length: count }, () => ({
        x: -S + Math.random() * (width + S),
        y: -S + Math.random() * (height + S),
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        opacity: 0.3 + Math.random() * 0.6,
      }));
    };
    return {
      far: make(1 / 9000, 0.25, 1, 1.8, 120),
      mid: make(1 / 16000, 0.55, 1.5, 2.4, 90),
      near: make(1 / 30000, 1.0, 2, 3.2, 60),
      streaks: make(1 / 45000, 2.2, 90, 170, 70),
    };
  }, [width, height]);

  const farStyle = useParallax(progress, dx, dy, 0.25);
  const midStyle = useParallax(progress, dx, dy, 0.55);
  const nearStyle = useParallax(progress, dx, dy, 1.0);
  const ringParallax = useParallax(progress, dx, dy, 1.0);

  const streakParallax = useParallax(progress, dx, dy, 2.2);
  const streakStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.25, 0.9, 1], [0, 0.55, 0.9, 0], CLAMP),
  }));

  const cameraStyle = useAnimatedStyle(() => {
    const zoom = interpolate(progress.value, [0, 1], [1, ZOOM_END], CLAMP);
    const punch = interpolate(burst.value, [0, 0.15, 1], [1, 1.1, 1 / ZOOM_END], CLAMP);
    const amp = interpolate(burst.value, [0, 0.05, 1], [0, 1, 0], CLAMP);
    const tilt = interpolate(progress.value, [0, 1], [START_TILT, 0], CLAMP);
    return {
      transform: [
        { translateX: Math.sin(burst.value * 55) * 14 * amp },
        { translateY: Math.cos(burst.value * 47) * 10 * amp },
        { rotate: `${tilt}deg` },
        { scale: zoom * punch },
      ],
    };
  });

  const moveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.08, 0.95, 1], [0, 1, 1, 0], CLAMP),
    transform: [
      { translateX: -dx * (1 - progress.value) * (1 - FOLLOW) },
      { translateY: -dy * (1 - progress.value) * (1 - FOLLOW) },
      { scale: interpolate(progress.value, [0, 1], [0.7, 1.3], CLAMP) },
    ],
  }));

  const ringOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.12, 0.5], CLAMP),
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burst.value, [0, 0.12, 0.6], [0, 0.95, 0], CLAMP),
  }));
  const bloomStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burst.value, [0, 0.15, 1], [0, 0.9, 0], CLAMP),
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.2, 9], CLAMP) }],
  }));
  const ringBurstStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burst.value, [0, 0.1, 1], [0, 0.9, 0], CLAMP),
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.2, 6], CLAMP) }],
  }));
  const crossStyle = useAnimatedStyle(() => ({
    opacity: interpolate(burst.value, [0, 0.1, 0.8], [0, 1, 0], CLAMP),
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.3, 4], CLAMP) }],
  }));

  const centered = (size) => ({
    position: 'absolute',
    left: cx - size / 2,
    top: cy - size / 2,
    width: size,
    height: size,
  });

  const meteorBox = {
    position: 'absolute',
    left: cx - TAIL_LENGTH,
    top: cy - BOX_H / 2,
    width: TAIL_LENGTH * 2,
    height: BOX_H,
  };

  const glowAtHead = (size, opacity) => [
    {
      position: 'absolute',
      left: TAIL_LENGTH - size / 2,
      top: BOX_H / 2 - size / 2,
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity,
    },
    animatedColorStyle,
  ];

  const ringSize = width * 0.9;

  const renderStars = (list) =>
    list.map((s, i) => (
      <View
        key={i}
        style={{
          position: 'absolute',
          left: s.x,
          top: s.y,
          width: s.size,
          height: s.size,
          borderRadius: s.size / 2,
          backgroundColor: '#FFFFFF',
          opacity: s.opacity,
        }}
      />
    ));

  return (
    <View pointerEvents="none" style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, cameraStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, farStyle]}>{renderStars(layers.far)}</Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, midStyle]}>{renderStars(layers.mid)}</Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, ringParallax]}>
          <Animated.View
            style={[
              centered(ringSize),
              { borderRadius: ringSize / 2, borderWidth: 2, borderColor: '#FFFFFF' },
              ringOpacityStyle,
            ]}
          />
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, nearStyle]}>{renderStars(layers.near)}</Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, streakParallax, streakStyle]}>
          {layers.streaks.map((s, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: s.x,
                top: s.y,
                width: s.size,
                height: 1.5,
                borderRadius: 1,
                backgroundColor: '#FFFFFF',
                opacity: s.opacity * 0.6,
                transform: [{ rotate: `${ANGLE_DEG}deg` }],
              }}
            />
          ))}
        </Animated.View>

        <Animated.View style={[meteorBox, moveStyle]}>
          <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${ANGLE_DEG}deg` }] }]}>
            
            <Animated.View style={[StyleSheet.absoluteFill, purpleTrailStyle]}>
              <LinearGradient
                colors={[`${PURPLE_COLOR}00`, `${PURPLE_COLOR}66`]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.outerGradient}
              />
              <LinearGradient
                colors={[`${PURPLE_COLOR}00`, PURPLE_COLOR, '#FFFFFF']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.innerGradient}
              />
            </Animated.View>

            <Animated.View style={[StyleSheet.absoluteFill, goldTrailStyle]}>
              <LinearGradient
                colors={[`${GOLD_COLOR}00`, `${GOLD_COLOR}66`]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.outerGradient}
              />
              <LinearGradient
                colors={[`${GOLD_COLOR}00`, GOLD_COLOR, '#FFFFFF']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.innerGradient}
              />
            </Animated.View>

          </View>

          <Animated.View style={glowAtHead(90, 0.12)} />
          <Animated.View style={glowAtHead(50, 0.35)} />
          <View
            style={{
              position: 'absolute',
              left: TAIL_LENGTH - 10,
              top: BOX_H / 2 - 10,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
            }}
          />

          <Animated.View style={[styles.flareH, { left: TAIL_LENGTH - 40, top: BOX_H / 2 - 1 }, animatedColorStyle]} />
          <Animated.View style={[styles.flareV, { left: TAIL_LENGTH - 1, top: BOX_H / 2 - 40 }, animatedColorStyle]} />
        </Animated.View>

        {/* ===== Explosão de Impacto ===== */}
        <Animated.View style={[centered(40), { borderRadius: 20 }, animatedColorStyle, bloomStyle]} />
        <Animated.View style={[centered(100), { borderRadius: 50, borderWidth: 3 }, animatedBorderColorStyle, ringBurstStyle]} />
        <Animated.View style={[centered(120), crossStyle]}>
          <View style={styles.burstH} />
          <View style={styles.burstV} />
        </Animated.View>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }, flashStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: BG_COLOR, overflow: 'hidden' },
  outerGradient: { position: 'absolute', left: 0, top: BOX_H / 2 - 9, width: TAIL_LENGTH, height: 18, borderRadius: 9 },
  innerGradient: { position: 'absolute', left: 0, top: BOX_H / 2 - 2, width: TAIL_LENGTH, height: 4, borderRadius: 2 },
  flareH: { position: 'absolute', width: 80, height: 2, borderRadius: 1, opacity: 0.9 },
  flareV: { position: 'absolute', width: 2, height: 80, borderRadius: 1, opacity: 0.9 },
  burstH: { position: 'absolute', left: 0, top: 58.5, width: 120, height: 3, borderRadius: 1.5, backgroundColor: '#FFF' },
  burstV: { position: 'absolute', left: 58.5, top: 0, width: 3, height: 120, borderRadius: 1.5, backgroundColor: '#FFF' },
});