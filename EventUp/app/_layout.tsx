import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EventEinrichten"
          options={{
            title: 'Event einrichten',
            headerBackTitle: 'Mehr',
            headerTintColor: '#111111',
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
              color: '#111111',
            },
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}