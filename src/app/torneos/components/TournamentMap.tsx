"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Tournament } from "@/types/database";
import { Locate, Search, Layers } from "lucide-react";
import { toast } from "sonner";

interface TournamentMapProps {
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  onSelectTournament: (tournament: Tournament | null) => void;
  apiKey: string;
}

// Classic Google Maps pin helper for unselected state
const getUnselectedIcon = (google: typeof globalThis.google) => ({
  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  scaledSize: new google.maps.Size(32, 32),
  anchor: new google.maps.Point(16, 32),
});

// Classic Google Maps pin helper for selected state (larger and green)
const getSelectedIcon = (google: typeof globalThis.google) => ({
  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  scaledSize: new google.maps.Size(44, 44),
  anchor: new google.maps.Point(22, 44),
});

export function TournamentMap({
  tournaments,
  selectedTournament,
  onSelectTournament,
  apiKey,
}: TournamentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(() => {
    return typeof window !== "undefined" && !!(window as unknown as { google?: { maps?: { Map?: unknown } } }).google?.maps?.Map;
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapTypeId, setMapTypeId] = useState<"roadmap" | "hybrid">("roadmap");
  const markersRef = useRef<Record<string, google.maps.Marker>>({});
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const zoomIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);

  // Polling to guarantee google.maps.Map is initialized correctly
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

  // Modern clean light map styles
  const cleanLightStyle = [
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "all", stylers: [{ color: "#E0F2FE" }] },
    { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#FFFFFF" }] },
    { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#F7F7F7" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#F0F0F0" }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#E4E4E7" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#D4D4D8" }] },
  ];

  // Initialize Map
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current) return;

    const google = (window as unknown as { google: typeof globalThis.google }).google;

    // Center in Basque Country / Spain center as default
    const defaultCenter = { lat: 43.15, lng: -2.17 };

    const initializedMap = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 9,
      styles: cleanLightStyle,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
    });

    // Close selected tournament card when map clicked
    initializedMap.addListener("click", (e: google.maps.MapMouseEvent) => {
      // Prevent default Google Maps POI InfoWindow popup
      if (e && "placeId" in e && e.stop) {
        e.stop();
      }
      onSelectTournament(null);
    });

    setMap(initializedMap);

    // Initialize Autocomplete Search
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ["(regions)"],
        componentRestrictions: { country: "es" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          toast.error("No se encontró la localidad seleccionada.");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        initializedMap.setCenter({ lat, lng });
        initializedMap.setZoom(12);
      });
    }

    // Cleanup markers and intervals on unmount
    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
      markersRef.current = {};
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current);
      }
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleMapsLoaded]);
  // Sync Map Type ID (Roadmap vs Satellite/Hybrid)
  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapTypeId);
    }
  }, [map, mapTypeId]);
  // Sync Markers when tournaments change
  useEffect(() => {
    if (!map || !googleMapsLoaded) return;

    const google = (window as unknown as { google: typeof globalThis.google }).google;

    // Clear existing markers that are no longer in tournaments
    const currentTourneyIds = new Set(tournaments.map((t) => t.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentTourneyIds.has(id)) {
        markersRef.current[id].setMap(null);
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    tournaments.forEach((tourney) => {
      if (tourney.latitude === null || tourney.longitude === null) return;

      const position = { lat: tourney.latitude, lng: tourney.longitude };

      if (!markersRef.current[tourney.id]) {
        // Minimalist unselected pin
        const marker = new google.maps.Marker({
          position,
          map,
          title: tourney.name,
          icon: getUnselectedIcon(google),
        });

        marker.addListener("click", () => {
          onSelectTournament(tourney);
          map.panTo(position);
        });

        markersRef.current[tourney.id] = marker;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, tournaments, googleMapsLoaded]);

  // Zoom and pan to selected tournament when changed externally
  useEffect(() => {
    if (!map || !googleMapsLoaded) return;
    
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }

    if (!selectedTournament || selectedTournament.latitude === null || selectedTournament.longitude === null) return;

    const google = (window as unknown as { google: typeof globalThis.google }).google;
    const position = new google.maps.LatLng(selectedTournament.latitude, selectedTournament.longitude);

    // Zoom and pan to selected tournament when changed externally
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }

    // Smoothly pan to the tournament position
    map.panTo(position);

    // Animate zoom to target level (14) with a smooth transition
    const targetZoom = 14;
    const currentZoom = map.getZoom() || 9;
    if (currentZoom !== targetZoom) {
      let zoomLevel = currentZoom;
      const step = currentZoom < targetZoom ? 1 : -1;

      zoomIntervalRef.current = setInterval(() => {
        if (zoomLevel === targetZoom) {
          if (zoomIntervalRef.current) {
            clearInterval(zoomIntervalRef.current);
            zoomIntervalRef.current = null;
          }
        } else {
          zoomLevel += step;
          map.setZoom(zoomLevel);
        }
      }, 80); // 80ms per zoom step
    }

    // Set selected marker to green dot pin (larger)
    const marker = markersRef.current[selectedTournament.id];
    if (marker) {
      marker.setIcon(getSelectedIcon(google));

      // Create custom HTMLOverlay to place the "Ver Torneo" link above the marker
      const link = document.createElement("a");
      link.href = `/torneo/${selectedTournament.short_id}`;
      link.className = "flex items-center gap-1.5 px-3 py-1.5 bg-[#33AD6A] hover:bg-[#288A56] text-white rounded-full shadow-lg font-extrabold text-xs transition-all duration-200 active:scale-95 cursor-pointer border border-[#288A56]/20 whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200 no-underline";
      link.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Ver Torneo</span>
      `;

      link.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      class HTMLOverlay extends google.maps.OverlayView {
        element: HTMLElement;
        position: google.maps.LatLng;

        constructor(element: HTMLElement, position: google.maps.LatLng) {
          super();
          this.element = element;
          this.position = position;
          this.setMap(map);
        }

        onAdd() {
          const panes = this.getPanes();
          if (panes) {
            panes.floatPane.appendChild(this.element);
          }
        }

        draw() {
          const projection = this.getProjection();
          if (!projection) return;

          const pos = projection.fromLatLngToDivPixel(this.position);
          if (!pos) return;

          this.element.style.position = "absolute";
          this.element.style.left = `${pos.x}px`;
          this.element.style.top = `${pos.y - 48}px`; // 48px above the center of the pin
          this.element.style.transform = "translate(-50%, -100%)";
        }

        onRemove() {
          if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
          }
        }
      }

      const overlay = new HTMLOverlay(link, position);
      overlayRef.current = overlay;

      // Restore to standard unselected pin and clear overlay when deselected
      return () => {
        marker.setIcon(getUnselectedIcon(google));
        overlay.setMap(null);
        overlayRef.current = null;
        if (zoomIntervalRef.current) {
          clearInterval(zoomIntervalRef.current);
          zoomIntervalRef.current = null;
        }
      };
    }
  }, [map, selectedTournament, googleMapsLoaded]);

  // Geolocation Handler
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("La geolocalización no es compatible con tu navegador.");
      return;
    }

    toast.info("Localizando tu posición...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const pos = { lat, lng };

        if (map) {
          map.setCenter(pos);
          map.setZoom(12);

          const google = (window as unknown as { google: typeof globalThis.google }).google;

          // Draw user location marker if it doesn't exist
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(pos);
          } else {
            userMarkerRef.current = new google.maps.Marker({
              position: pos,
              map,
              title: "Tu ubicación",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#3B82F6", // Blue dot for user location
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                scale: 8,
              },
            });
          }
          toast.success("Mapa centrado en tu ubicación.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("No pudimos acceder a tu ubicación. Comprueba tus permisos.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-neutral-50">
      {/* Script Google Maps */}
      <Script
        id="google-maps-explorer-script-main"
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`}
        onReady={handleScriptReady}
      />

      {/* Floating Autocomplete Search & Geolocation inside Map */}
      {googleMapsLoaded && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-10 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Buscar localidad"
              className="w-full h-11 pl-10 pr-4 bg-white border border-[#EAEAEA] focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm shadow-md transition-all placeholder:text-neutral-400"
            />
          </div>
          <button
            type="button"
            onClick={handleGeolocation}
            title="Centrar en mi ubicación"
            className="w-11 h-11 bg-white hover:bg-neutral-50 border border-[#EAEAEA] rounded-xl flex items-center justify-center shadow-md active:scale-[0.95] transition-all cursor-pointer text-[#33AD6A] shrink-0"
          >
            <Locate className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setMapTypeId(mapTypeId === "roadmap" ? "hybrid" : "roadmap")}
            title={mapTypeId === "roadmap" ? "Mostrar vista satélite" : "Mostrar vista mapa"}
            className={`w-11 h-11 bg-white hover:bg-neutral-50 border rounded-xl flex items-center justify-center shadow-md active:scale-[0.95] transition-all cursor-pointer shrink-0 ${
              mapTypeId === "hybrid"
                ? "border-[#33AD6A] text-[#33AD6A]"
                : "border-[#EAEAEA] text-neutral-500 hover:text-[#1F1F1F]"
            }`}
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actual Map Element */}
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />

      {!googleMapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-[#33AD6A] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-sm font-semibold text-neutral-500">Cargando mapa interactivo...</p>
          </div>
        </div>
      )}

    </div>
  );
}
