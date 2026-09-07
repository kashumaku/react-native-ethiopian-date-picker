import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { EthiopianDatePicker, formatEthiopianDate } from './src';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ethiopian Date Picker</Text>

      <Text style={styles.selectedText}>
        የተመረጠው ቀን (Selected): {formatEthiopianDate(selectedDate, { locale: 'am' })}
      </Text>

      <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>ቀን ይምረጡ (Open Modal)</Text>
      </Pressable>

      <EthiopianDatePicker
        mode="modal"
        visible={modalVisible}
        value={selectedDate}
        locale="am"
        title="ቀን ይምረጡ"
        confirmText="አረጋግጥ"
        cancelText="ይቅር"
        onChange={(date) => {
          setSelectedDate(date);
          setModalVisible(false);
        }}
        onClose={() => setModalVisible(false)}
        theme={{
          selectedDayTextColor:"red"
        }}
        maxYear={2017}
        style={{
          elevation:0, borderWidth:0
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  selectedText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
  },
  openButton: {
    backgroundColor: '#1A56DB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',

  },
});
