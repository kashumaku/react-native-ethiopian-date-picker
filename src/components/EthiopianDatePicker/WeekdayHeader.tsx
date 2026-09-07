import React from "react";
import { View, Text } from "react-native";
import { getLocalization } from "../../localization";
import { styles, type ResolvedTheme } from "./styles";
import type { EthiopianLocale } from "../../types";

export interface WeekdayHeaderProps {
  locale: EthiopianLocale;
  theme: ResolvedTheme;
}

export const WeekdayHeader: React.FC<WeekdayHeaderProps> = React.memo(
  ({ locale, theme }) => {
    const dict = getLocalization(locale);

    return (
      <View
        style={[
          styles.weekdayContainer,
          { borderBottomColor: theme.borderColor },
        ]}
      >
        {dict.shortWeekdays.map((shortName, index) => {
          const fullName = dict.weekdays[index] ?? shortName;
          return (
            <View
              key={index}
              style={styles.weekdayCell}
              accessibilityLabel={fullName}
            >
              <Text
                style={[
                  styles.weekdayText,
                  { color: theme.weekdayTextColor },
                ]}
              >
                {shortName}
              </Text>
            </View>
          );
        })}
      </View>
    );
  },
);
