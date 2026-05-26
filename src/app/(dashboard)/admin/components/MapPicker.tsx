import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { toast } from "sonner";
import { cleanAddress } from "@/lib/utils/helpers";

interface MapPickerProps {
  address: string;
  latitude: number | null;
  longitude: number | null;
  onAddressChange: (address: string) => void;
  onLocationChange: (lat: number | null, lng: number | null) => void;
  isPending: boolean;
  required?: boolean;
}

export function MapPicker({
  address,
  latitude,
  longitude,
  onAddressChange,
  onLocationChange,
  isPending,
  required = false,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(() => {
    return typeof window !== "undefined" && !!(window as unknown as { google?: { maps?: { Map?: unknown } } }).google?.maps?.Map;
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Polling mechanism to ensure google.maps.Map constructor is loaded before initializing
  const handleScriptReady = () => {
    const checkLoaded = () => {
      const win = window as unknown as { google?: { maps?: { Map?: unknown } } };
      if (win.google?.maps?.Map) {
        setGoogleMapsLoaded(true);
      } else {
        setTimeout(checkLoaded, 50);
      }
    };
    checkLoaded();
  };

  // Initialize Map and Places Autocomplete
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current || !searchInputRef.current) return;

    const google = (window as unknown as { google: typeof globalThis.google }).google;

    // Default coordinates: use current coords if available, otherwise Gipuzkoa center
    const hasLocation = latitude !== null && longitude !== null;
    const defaultCoords = hasLocation
      ? { lat: latitude as number, lng: longitude as number }
      : { lat: 43.15, lng: -2.17 };

    const initializedMap = new google.maps.Map(mapRef.current, {
      center: defaultCoords,
      zoom: hasLocation ? 16 : 9,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Create marker if location exists initially
    if (hasLocation) {
      const newMarker = new google.maps.Marker({
        position: defaultCoords,
        map: initializedMap,
        draggable: true,
      });

      newMarker.addListener("dragend", () => {
        const pos = newMarker.getPosition();
        if (pos) {
          onLocationChange(pos.lat(), pos.lng());
          reverseGeocode(pos.lat(), pos.lng());
        }
      });

      markerRef.current = newMarker;
    }

    const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
      types: ["establishment", "geocode"],
      componentRestrictions: { country: "es" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        toast.error("No se encontró la ubicación detallada. Por favor, selecciona una sugerencia.");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      onLocationChange(lat, lng);

      const rawAddr = place.formatted_address || place.name || "";
      onAddressChange(cleanAddress(rawAddr));

      // Center map & place marker
      initializedMap.setCenter({ lat, lng });
      initializedMap.setZoom(16);

      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        const newMarker = new google.maps.Marker({
          position: { lat, lng },
          map: initializedMap,
          draggable: true,
        });

        // Update coordinates on dragend
        newMarker.addListener("dragend", () => {
          const pos = newMarker.getPosition();
          if (pos) {
            onLocationChange(pos.lat(), pos.lng());
            reverseGeocode(pos.lat(), pos.lng());
          }
        });

        markerRef.current = newMarker;
      }
    });

    // Handle map click to place marker manually
    initializedMap.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onLocationChange(lat, lng);

      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        const newMarker = new google.maps.Marker({
          position: { lat, lng },
          map: initializedMap,
          draggable: true,
        });

        newMarker.addListener("dragend", () => {
          const pos = newMarker.getPosition();
          if (pos) {
            onLocationChange(pos.lat(), pos.lng());
            reverseGeocode(pos.lat(), pos.lng());
          }
        });

        markerRef.current = newMarker;
      }

      reverseGeocode(lat, lng);
    });

    const reverseGeocode = (lat: number, lng: number) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          onAddressChange(cleanAddress(results[0].formatted_address));
        }
      });
    };

    setMap(initializedMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleMapsLoaded]);

  // Clear Location Handler
  const clearLocation = () => {
    onAddressChange("");
    onLocationChange(null, null);
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (map) {
      map.setCenter({ lat: 43.15, lng: -2.17 });
      map.setZoom(9);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
          Dirección física {required && <span className="text-red-500">*</span>}
        </label>
        {(address || latitude || longitude) && (
          <button
            type="button"
            onClick={clearLocation}
            className="text-[10px] text-red-500 hover:text-red-700 hover:underline font-bold transition-colors cursor-pointer"
          >
            Borrar ubicación
          </button>
        )}
      </div>
      <input
        type="text"
        ref={searchInputRef}
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        disabled={isPending}
        required={required}
        placeholder="Busca la dirección en el mapa..."
        className="w-full h-11 px-4 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm transition-all duration-200 bg-neutral-50 focus:bg-white"
      />
      <p className="text-[11px] text-neutral-500 leading-relaxed bg-[#F8F9FA] p-3 rounded-xl border border-neutral-100 mt-1">
        Busca la dirección en el buscador o haz clic directamente en el mapa para colocar el marcador.
      </p>

      {/* Google Maps Script */}
      <Script
        id="google-maps-script"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        onReady={handleScriptReady}
      />

      {/* Dynamic Google Map */}
      <div
        ref={mapRef}
        className="w-full h-60 rounded-xl border border-[#EAEAEA] mt-2 bg-neutral-100 flex items-center justify-center text-xs text-neutral-400 font-semibold"
      >
        {!googleMapsLoaded ? "Cargando mapa interactivo..." : ""}
      </div>

      {/* Required marker warning */}
      {required && !latitude && !longitude && (
        <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1.5 mt-1">
          <span>&#9888;</span> Haz clic en el mapa o busca una dirección para colocar el marcador (obligatorio).
        </p>
      )}

      {/* Coordinate indicators */}
      {latitude && longitude && (
        <div className="flex gap-4 text-[10px] text-neutral-400 font-mono mt-1 justify-end">
          <span>Lat: {latitude.toFixed(6)}</span>
          <span>Lng: {longitude.toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}
