import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingBottomNavCapsule, type NavItem } from './ui/floating-bottom-nav-capsule';

const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', icon: 'home', route: 'index' },
  { label: 'Paramètres', icon: 'settings', route: 'settings' },
];

export interface AppShellOverlayProps {
  children: React.ReactNode;
}

export function AppShellOverlay({ children }: AppShellOverlayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [activeRoute, setActiveRoute] = useState<string>('index');

  // Update active route based on current pathname
  useEffect(() => {
    if (pathname === '/' || pathname === '/index') {
      setActiveRoute('index');
    } else if (pathname.includes('settings')) {
      setActiveRoute('settings');
    } else {
      // For detail routes, keep the last main route active
      setActiveRoute(activeRoute);
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

  return (
    <View style={styles.container}>
      {children}

      {/* FloatingBottomNavCapsule Overlay */}
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
