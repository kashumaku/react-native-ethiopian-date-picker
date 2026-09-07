import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import {
  EthiopianDatePicker,
  formatEthiopianDate,
  formatEthiopianDateRange,
  type EthiopianDateRange,
} from './src';

export default function App() {
  const [pickerType, setPickerType] = useState<'single' | 'range'>('range');
  const [modalVisible, setModalVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [singleDate, setSingleDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<EthiopianDateRange>({
    startDate: new Date(),
    endDate: null,
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ethiopian Date Picker</Text>

      {/* Mode Switcher Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, pickerType === 'single' && styles.activeTab]}
          onPress={() => setPickerType('single')}
        >
          <Text style={[styles.tabText, pickerType === 'single' && styles.activeTabText]}>
            Single Date (ነጠላ)
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, pickerType === 'range' && styles.activeTab]}
          onPress={() => setPickerType('range')}
        >
          <Text style={[styles.tabText, pickerType === 'range' && styles.activeTabText]}>
            Date Range (ክልል)
          </Text>
        </Pressable>
      </View>

      {/* Display Current Selection */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Current Selection:</Text>
        <Text style={styles.cardValue}>
          {pickerType === 'single'
            ? formatEthiopianDate(singleDate, { locale: 'am', format: 'long' })
            : formatEthiopianDateRange(dateRange, { locale: 'am' }) || 'No range selected'}
        </Text>
      </View>

      {/* Presentation Trigger Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.openButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.openButtonText}>
            {pickerType === 'single' ? 'Modal Dialog' : 'Modal Range'}
          </Text>
        </Pressable>

        <Pressable style={[styles.openButton, styles.sheetButton]} onPress={() => setSheetVisible(true)}>
          <Text style={[styles.openButtonText, styles.sheetButtonText]}>
            {pickerType === 'single' ? 'Bottom Sheet' : 'Sheet Range'}
          </Text>
        </Pressable>
      </View>

      {/* Modal Picker */}
      <EthiopianDatePicker
        mode="modal"
        visible={modalVisible}
        selectionType={pickerType}
        value={singleDate}
        selectedRange={dateRange}
        locale="am"
        title={pickerType === 'single' ? 'ቀን ይምረጡ' : 'የቀን ክልል ይምረጡ'}
        confirmText="አረጋግጥ"
        cancelText="ይቅር"
        showTodayButton
        onChange={(date) => {
          setSingleDate(date);
          setModalVisible(false);
        }}
        onRangeChange={(range) => {
          setDateRange(range);
          if (range.startDate && range.endDate) {
            setModalVisible(false);
          }
        }}
        onClose={() => setModalVisible(false)}
      />

      {/* Bottom Sheet Picker */}
      <EthiopianDatePicker
        mode="sheet"
        visible={sheetVisible}
        selectionType={pickerType}
        value={singleDate}
        selectedRange={dateRange}
        locale="am"
        title={pickerType === 'single' ? 'ቀን ይምረጡ' : 'የቀን ክልል ይምረጡ'}
        confirmText="አረጋግጥ"
        cancelText="ይቅር"
        showTodayButton
        onChange={(date) => {
          setSingleDate(date);
          setSheetVisible(false);
        }}
        onRangeChange={(range) => {
          setDateRange(range);
          if (range.startDate && range.endDate) {
            setSheetVisible(false);
          }
        }}
        onClose={() => setSheetVisible(false)}
      />

      {/* Inline Demo Preview */}
      <View style={styles.inlineSection}>
        <Text style={styles.sectionTitle}>Inline Preview</Text>
        <EthiopianDatePicker
          mode="inline"
          selectionType={pickerType}
          value={singleDate}
          selectedRange={dateRange}
          locale="am"
          showTodayButton
          onChange={(date) => setSingleDate(date)}
          onRangeChange={(range) => setDateRange(range)}
          style={{
            elevation:0,
            borderWidth:0
          }}
        />
        
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#C7FF00',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  openButton: {
    backgroundColor: '#C7FF00',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sheetButton: {
    backgroundColor: '#111827',
  },
  sheetButtonText: {
    color: '#FFFFFF',
  },
  openButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  inlineSection: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
});
