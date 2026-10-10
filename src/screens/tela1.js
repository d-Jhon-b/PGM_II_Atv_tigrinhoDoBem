import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ActionButton from '../components/ActionButton';

export default function Tela1({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gamesena</Text>
      <Text style={styles.subtitle}>Orientações do Jogo</Text>

      <ScrollView style={styles.card}>
        <Text style={styles.sectionTitle}>Como Apostar:</Text>
        <Text style={styles.text}>
          • Você pode selecionar manualmente de <Text style={styles.bold}>6 a 20 números</Text> entre 1 e 60.
        </Text>

        <Text style={styles.sectionTitle}>MOdo Surpresinha:</Text>
        <Text style={styles.text}>
          • Deixe o sistema escolher os números da sorte aleatoriamente para você!
        </Text>

        <Text style={styles.sectionTitle}>Modo Teimosinha:</Text>
        <Text style={styles.text}>
          • Repita sua aposta em vários sorteios consecutivos (2, 4 ou 8 concursos)[cite: 14].
        </Text>
      </ScrollView>

      <ActionButton
        title="INICIAR APOSTA"
        onPress={() => navigation.navigate('Tela2')}
        style={{ marginBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A', padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginTop: 30 },
  subtitle: { fontSize: 18, color: '#F0FDF4', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, flex: 1, marginBottom: 10 
  , maxHeight:'60%'},
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginTop: 12, marginBottom: 4 },
  text: { fontSize: 14, color: '#475569', lineHeight: 20 },
  bold: { fontWeight: 'bold', color: '#2563EB' },
});