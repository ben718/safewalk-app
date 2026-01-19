import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingBottomNavCapsule, type NavItem } from './ui/floating-bottom-nav-capsule';
import IndexScreen from '@/app/index';
import SettingsScreen from '@/app/settings';

const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', icon: 'home', route: 'index' },
  { label: 'Paramètres', icon: 'settings', route: 'settings' },
];

// Écrans qui doivent afficher le menu
const SCREENS_WITH_NAV = ['index', 'settings'];

export interface AppShellUberProps {
  children?: React.ReactNode;
}

export function AppShellUber({ children }: AppShellUberProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [activeRoute, setActiveRoute] = useState<string>('index');
  const [currentScreen, setCurrentScreen] = useState<'index' | 'settings'>('index');

  // Update active route based on current pathname
  useEffect(() => {
    if (pathname === '/' || pathname === '/index') {
      setActiveRoute('index');
      setCurrentScreen('index');
    } else if (pathname.includes('settings')) {
      setActiveRoute('settings');
      setCurrentScreen('settings');
    }
  }, [pathname]);

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    if (route === 'index') {
      router.push('/');
    } else {
      router.push(`/${route}` as any);
    }
  };

  const showNav = SCREENS_WITH_NAV.includes(currentScreen);

  return (
    <View style={styles.container}>
      {/* Render the appropriate screen */}
      {currentScreen === 'index' && <IndexScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}

      {/* FloatingBottomNavCapsule - Only visible on nav screens */}
      {showNav && (
        <View
          style={[
            styles.navContainer,
            {
              bottom: insets.bottom + 12,
            },
          ]}
        >
          <FloatingBottomNavCapsule
            items={NAV_ITEMS}
            activeRoute={activeRoute}
            onPress={handleNavigation}
          />
        </View>
      )}

      {/* Render flow screens via children */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 100,
    pointerEvents: 'box-none',
  },
});
