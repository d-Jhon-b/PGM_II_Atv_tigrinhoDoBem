import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function DezenaBola({ numero, isSelected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bola,
        isSelected && styles.bolaSelecionada,
        pressed && styles.bolaPressionada,
      ]}
    >
      <Text style={[styles.texto, isSelected && styles.textoSelecionado]}>
        {numero < 10 ? `0${numero}` : numero}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bola: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  bolaSelecionada: {
    backgroundColor: '#2563EB', // Azul idêntico à Figura 1 do PDF
    borderColor: '#1D4ED8',
  },
  bolaPressionada: {
    opacity: 0.7,
  },
  texto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  textoSelecionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});