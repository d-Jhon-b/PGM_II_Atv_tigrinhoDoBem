import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DezenaBola from '../components/DezenaBola';
import ActionButton from '../components/ActionButton';

export default function Tela2({ navigation }) {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [teimosinha, setTeimosinha] = useState(1);
  const [isGuaranteedWin, setIsGuaranteedWin] = useState(false);
  const totalNumbers = Array.from({ length: 60 }, (_, i) => i + 1);

  const toggleNumber = (num) => {
    setIsGuaranteedWin(false);
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      if (selectedNumbers.length < 20) {
        setSelectedNumbers([...selectedNumbers, num]);
      }
    }
  };

  const handleSurpresinha = () => {
    setIsGuaranteedWin(false);
    const randoms = [];
    while (randoms.length < 6) {
      const n = Math.floor(Math.random() * 60) + 1;
      if (!randoms.includes(n)) randoms.push(n);
    }
    setSelectedNumbers(randoms);
  };

  const handleApostaCerta = () => {
    setIsGuaranteedWin(true); 
    const garantidos = [];
    while (garantidos.length < 6) {
      const n = Math.floor(Math.random() * 60) + 1;
      if (!garantidos.includes(n)) garantidos.push(n);
    }
    setSelectedNumbers(garantidos);
  };

  const isButtonEnabled = selectedNumbers.length >= 6 && selectedNumbers.length <= 20;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gamesena</Text>
      <Text style={styles.subtitle}>Selecione de 6 a 20 dezenas</Text>

      <View style={styles.optionsContainer}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.surpresinhaBtn} onPress={handleSurpresinha}>
            <Text style={styles.btnText}>Surpresinha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.apostaCertaBtn} onPress={handleApostaCerta}>
            <Text style={styles.btnText}>Aposta Certa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.teimosinhaGroup}>
          <Text style={styles.teimosinhaLabel}>Teimosinha:</Text>
          {[1, 2, 4, 8].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.teimosinhaTag, teimosinha === t && styles.teimosinhaSelected]}
              onPress={() => setTeimosinha(t)}
            >
              <Text style={[styles.teimosinhaTagText, teimosinha === t && styles.teimosinhaSelectedText]}>
                {t}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.cardGrid}>
        <ScrollView contentContainerStyle={styles.grid}>
          {totalNumbers.map((num) => (
            <DezenaBola
              key={num}
              numero={num}
              isSelected={selectedNumbers.includes(num)}
              onPress={() => toggleNumber(num)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedRow}>
        {selectedNumbers.sort((a, b) => a - b).map((num) => (
          <View key={num} style={styles.selectedTag}>
            <Text style={styles.selectedTagText}>{num < 10 ? `0${num}` : num}</Text>
          </View>
        ))}
      </ScrollView>

      <ActionButton
        title={isButtonEnabled ? "Confirmar opções" : "Selecione ao menos 6 dezenas"}
        disabled={!isButtonEnabled}
        onPress={() =>
          navigation.navigate('Tela3', {
            selectedNumbers,
            teimosinha,
            isGuaranteedWin, 
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A', padding: 16, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginTop: 25 },
  subtitle: { fontSize: 14, color: '#fff', marginBottom: 10 },
  optionsContainer: { width: '100%', marginBottom: 10, gap: 8 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 8 },
  surpresinhaBtn: { flex: 1, backgroundColor: '#10B981', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  apostaCertaBtn: { flex: 1, backgroundColor: '#8B5CF6', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  teimosinhaGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  teimosinhaLabel: { fontSize: 12, fontWeight: 'bold', color: '#fff', marginRight: 6 },
  teimosinhaTag: { backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 4 },
  teimosinhaSelected: { backgroundColor: '#2563EB' },
  teimosinhaTagText: { fontSize: 11, color: '#334155' },
  teimosinhaSelectedText: { color: '#FFF', fontWeight: 'bold' },
  cardGrid: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, width: '100%', height: 320, shadowColor: '#000', elevation: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  selectedRow: { maxHeight: 40, marginVertical: 10 },
  selectedTag: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginHorizontal: 3 },
  selectedTagText: { fontSize: 12, fontWeight: 'bold', color: '#2563EB' },
});