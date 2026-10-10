import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import StartMeteor from '../components/StartMeteor';
import { evaluateRaffle } from '../utils/raffleLogic';

export default function Tela3({ route, navigation }) {
  const { selectedNumbers, teimosinha, isGuaranteedWin } = route.params;
  const [raffleResult, setRaffleResult] = useState(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    setRaffleResult(evaluateRaffle(selectedNumbers, 6, isGuaranteedWin));
  }, []);

  if (!raffleResult) return null;

  return (
    <View style={styles.container}>
      <StartMeteor
        isWinner={raffleResult.isWinner}
        onAnimationComplete={() => setAnimationFinished(true)}
      />

      {animationFinished && (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.resultContainer}>
          <Text style={styles.ticketText}>Bilhete nº #{raffleResult.ticketNumber}</Text>
          <Text style={[styles.resultTitle, { color: raffleResult.starColor }]}>
            {raffleResult.isWinner ? 'PARABÉNS, VOCÊ GANHOU!' : 'Sorteio Concluído!'}
          </Text>

          <Text style={styles.resultText}>
            Dezenas Sorteadas: {[...raffleResult.drawnNumbers].sort((a, b) => a - b).join(', ')}
          </Text>
          <Text style={styles.resultText}>
            Seus Acertos ({raffleResult.hits.length}): {raffleResult.hits.join(', ') || 'Nenhum'}
          </Text>

          {teimosinha > 1 && (
            <Text style={styles.teimosinhaInfo}>Aposta válida para +{teimosinha - 1} concursos (Teimosinha)</Text>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Tela2')}>
              <Text style={styles.btnText}>NOVO JOGO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Tela1')}>
              <Text style={styles.btnText}>INÍCIO</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A', justifyContent: 'center', alignItems: 'center' },
  resultContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
    borderRadius: 16,
    width: '85%',
  },
  ticketText: { fontSize: 12, color: '#94A3B8', marginBottom: 6 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  resultText: { fontSize: 15, color: '#FFF', marginVertical: 4, textAlign: 'center' },
  teimosinhaInfo: { fontSize: 12, color: '#10B981', marginTop: 8, fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row', marginTop: 20, gap: 10 },
  btnPrimary: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: '#20803D', borderRadius: 8 },
  btnSecondary: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: '#475569', borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
});