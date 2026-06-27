import { Metadata } from 'next';
import { getTournamentFullDataByShortId } from '@/services/tournaments';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Prize, Contact } from '@/types';

// Import subcomponents (colocados localmente bajo la ruta)
import { AutoRedirect } from './components/AutoRedirect';
import { AppPromoBanner } from './components/AppPromoBanner';
import { LiveTablePanel } from './components/LiveTablePanel';
import { TournamentPoster } from './components/TournamentPoster';
import { TournamentSpecsCard } from './components/TournamentSpecsCard';
import { PrizesList } from './components/PrizesList';
import { ContactsList } from './components/ContactsList';
import { ShareButton } from './components/ShareButton';

interface Props {
  params: Promise<{ shortId: string }>;
}

// Generación dinámica de Metadatos para Open Graph (Vista previa en WhatsApp, Twitter, etc.)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortId } = await params;
  const tournament = await getTournamentFullDataByShortId(shortId);

  if (!tournament || (tournament.status !== 'planned' && tournament.status !== 'ongoing')) {
    return {
      title: 'Torneo no encontrado | Mapa Mus',
    };
  }

  const title = tournament.name;
  const locationText = tournament.location ? `en ${tournament.location}` : '';
  const dateText = tournament.tournament_date
    ? `el ${new Date(tournament.tournament_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`
    : '';
  const description = `¡Anímate al torneo de Mus ${locationText} ${dateText}! Consulta premios, formato de juego y más en Mapa Mus.`;

  // Use the API proxy route to serve the poster without restrictive robots headers
  const posterUrl = `/api/torneo/${shortId}/cartel`;

  return {
    title,
    description,
    robots: tournament.is_test ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: [
        {
          url: posterUrl,
          width: 1200,
          height: 630,
          alt: `Póster de ${tournament.name}`,
        },
      ],
      type: 'website',
      url: `https://www.mapamus.site/torneo/${shortId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [posterUrl],
    },
  };
}

export default async function TournamentDetailPage({ params }: Props) {
  const { shortId } = await params;
  const tournament = await getTournamentFullDataByShortId(shortId);

  if (!tournament || (tournament.status !== 'planned' && tournament.status !== 'ongoing')) {
    notFound();
  }

  const formattedDate = tournament.tournament_date
    ? new Date(tournament.tournament_date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Fecha por definir';

  const prizes = Array.isArray(tournament.prizes)
    ? (tournament.prizes as unknown as Prize[])
    : [];

  const contacts = Array.isArray(tournament.contacts)
    ? (tournament.contacts as unknown as Contact[])
    : [];

  const mapsUrl = tournament.latitude && tournament.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${tournament.latitude},${tournament.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.location || '')}`;

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#1F1F1F] antialiased selection:bg-[#33AD6A] selection:text-white">
      {/* Script de Redirección Automática para Android */}
      <AutoRedirect shortId={shortId} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {tournament.is_test && (
          <div className="mb-6 p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center gap-3 text-amber-800">
            <span className="text-xl">🧪</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-amber-900">Entorno de Pruebas</span>
              <span className="text-xs text-amber-800/90 font-medium">Este torneo es de prueba y no aparece en el mapa público.</span>
            </div>
          </div>
        )}

        {/* Navegación al buscador/mapa de torneos */}
        <div className="mb-6">
          <Link
            href="/torneos"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#737373] hover:text-[#1F1F1F] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-[#737373] group-hover:-translate-x-0.5 transition-transform" />
            Ver el mapa de los torneos
          </Link>
        </div>

        {/* Panel "tu mesa en vivo": solo durante el torneo, como héroe sobre la info. */}
        {tournament.status === 'ongoing' && (
          <LiveTablePanel initialTournament={tournament} />
        )}

        {/* Banner de Aviso de App Móvil */}
        <AppPromoBanner shortId={shortId} />

        {/* Sección Principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Póster del Torneo */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <TournamentPoster name={tournament.name} posterUrl={tournament.poster_url} />
          </div>

          {/* Columna Derecha: Detalles del Torneo */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-[#33AD6A]/10 text-[#288A56] text-xs font-bold rounded-full border border-[#33AD6A]/20">
                  {tournament.kings_modality ? `${tournament.kings_modality} Reyes` : 'Reglas Estándar'}
                </span>
                <span className="px-3 py-1 bg-[#FFD700]/10 text-yellow-700 text-xs font-bold rounded-full border border-[#FFD700]/30">
                  {tournament.points_modality ? `${tournament.points_modality} Tantos` : 'Puntos Estándar'}
                </span>
                <span className="px-3 py-1 bg-white text-[#1F1F1F] text-xs font-semibold rounded-full border border-[#EAEAEA] shadow-sm">
                  {tournament.price_per_couple ? `${tournament.price_per_couple}€ por pareja` : 'Inscripción Gratis'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F] tracking-tight">{tournament.name}</h1>
            </div>

            <ShareButton tournamentName={tournament.name} />

            {/* Ficha técnica */}
            <TournamentSpecsCard
              formattedDate={formattedDate}
              location={tournament.location}
              pricePerCouple={tournament.price_per_couple}
              maxSpots={tournament.max_spots}
              mapsUrl={mapsUrl}
            />

            {/* Sección Premios */}
            <PrizesList prizes={prizes} />

            {/* Sección Contacto */}
            <ContactsList contacts={contacts} />
          </div>
        </div>
      </div>
    </div>
  );
}
