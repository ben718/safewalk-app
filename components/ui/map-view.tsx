import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export interface MapViewProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
  onCopyLink?: (link: string) => void;
  className?: string;
}

/**
 * Composant pour afficher une carte avec la position GPS
 */
export function MapViewComponent({
  latitude,
  longitude,
  accuracy,
  onCopyLink,
  className,
}: MapViewProps) {
  const colors = useColors();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [latitude, longitude]);

  const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

  const handleCopyLink = () => {
    onCopyLink?.(mapsLink);
  };

  return (
    <View className={cn('w-full rounded-3xl overflow-hidden', className)}>
      {/* Carte */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        zoomEnabled
        scrollEnabled
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Ma position"
          description={`Précision: ${accuracy ? accuracy.toFixed(0) : '?'} m`}
          pinColor={colors.primary}
        />
      </MapView>

      {/* Overlay avec info et bouton */}
      <View
        style={[
          styles.overlay,
          { backgroundColor: `${colors.background}dd` },
        ]}
      >
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="location-on" size={16} color={colors.primary} />
          <Text
            className="text-sm font-semibold flex-1"
            style={{ color: colors.foreground }}
            numberOfLines={1}
          >
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>

        {accuracy && (
          <Text
            className="text-xs mt-1"
            style={{ color: colors.muted }}
          >
            Précision: ±{accuracy.toFixed(0)}m
          </Text>
        )}

        <Pressable
          onPress={handleCopyLink}
          style={({ pressed }) => [
            styles.copyButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <MaterialIcons name="content-copy" size={14} color={colors.background} />
          <Text
            className="text-xs font-semibold ml-1"
            style={{ color: colors.background }}
          >
            Copier le lien
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
});
