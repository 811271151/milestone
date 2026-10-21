import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '@/state/AppProvider';
import { useTheme } from '@/ui/theme';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProvider>
      <RootSurface />
    </AppProvider>
  );
}

function RootSurface() {
  const { colors } = useTheme();

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { dark, colors } = useTheme();

  return (
    <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="project/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="project/[id]/submit"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
