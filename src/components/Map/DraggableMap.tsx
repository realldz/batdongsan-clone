"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icon with CDN-based assets to avoid Next.js compile errors
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to dynamically update map center when lat/lng changes from parent
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

interface DraggableMapProps {
  lat: number;
  lng: number;
  draggable?: boolean;
  onPositionChange?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

export default function DraggableMap({
  lat,
  lng,
  draggable = true,
  onPositionChange,
  height = "180px",
  className = "",
}: DraggableMapProps) {
  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null && onPositionChange) {
          const latLng = marker.getLatLng();
          onPositionChange(latLng.lat, latLng.lng);
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <div
      style={{ height, width: "100%" }}
      className={`relative rounded-md overflow-hidden border border-gray-300 z-10 ${className}`}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={draggable}
          eventHandlers={eventHandlers}
          position={[lat, lng]}
          icon={DefaultIcon}
          ref={markerRef}
        />
        <MapRecenter lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
