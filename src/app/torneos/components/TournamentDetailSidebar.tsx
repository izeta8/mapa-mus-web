import { Tournament, Prize, Contact } from "@/types/database";
import { SafeDate } from "@/components/ui/custom/SafeDate";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Award,
  Users,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface TournamentDetailSidebarProps {
  tournament: Tournament;
  onBack: () => void;
}

export function TournamentDetailSidebar({
  tournament,
  onBack,
}: TournamentDetailSidebarProps) {
  // Parse prizes
  const prizes = Array.isArray(tournament.prizes)
    ? (tournament.prizes as unknown as Prize[])
    : [];

  // Parse contacts
  const contacts = tournament.contacts as unknown as Contact | null;

  // Check if there is any valid contact information
  const hasContacts = !!(
    contacts &&
    (contacts.name?.trim() ||
      contacts.phone?.trim() ||
      contacts.email?.trim() ||
      contacts.instagram?.trim() ||
      contacts.facebook?.trim() ||
      contacts.description?.trim())
  );

  // Extract clean registration details from Json (ignoring in_app_enabled)
  const registrationText = (() => {
    const info = tournament.registration_info;
    if (!info) return null;
    if (typeof info === "string") return info;
    const parsed = info as { in_person_details?: string; description?: string };
    return parsed.in_person_details || parsed.description || null;
  })();

  // Format price
  const priceLabel =
    tournament.price_per_couple === null || tournament.price_per_couple === 0
      ? "Gratuito"
      : `${tournament.price_per_couple}€ / pareja`;

  const statusLabels: Record<typeof tournament.status, string> = {
    planned: "Inscripción Abierta",
    ongoing: "En Juego",
    finished: "Finalizado",
    canceled: "Cancelado",
    revision_pending: "Pendiente de Revisión",
  };

  const statusColors: Record<typeof tournament.status, string> = {
    planned: "bg-[#33AD6A]/10 text-[#288A56] border-[#33AD6A]/20",
    ongoing: "bg-amber-50 text-amber-700 border-amber-200",
    finished: "bg-neutral-100 text-neutral-600 border-neutral-200",
    canceled: "bg-red-50 text-red-700 border-red-200",
    revision_pending: "bg-blue-50 text-blue-700 border-blue-200",
  };

  // Helper to format WhatsApp URL
  const getWhatsAppUrl = (phone: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, "");
    // Standard Spanish prefix if not set (normally Spanish phone numbers start with 34 or have 9 digits)
    const formattedNumber = cleanNumber.length === 9 ? `34${cleanNumber}` : cleanNumber;
    return `https://wa.me/${formattedNumber}`;
  };

  // Google Maps directions or search link
  const googleMapsUrl =
    tournament.latitude !== null && tournament.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${tournament.latitude},${tournament.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.location)}`;

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Header back button */}
      <div className="p-4 border-b border-[#EAEAEA] flex items-center shrink-0">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#737373] hover:text-[#1F1F1F] transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#33AD6A]" />
          Volver al listado
        </button>
      </div>

      {/* Main Details Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Basic Title & Badges */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                statusColors[tournament.status]
              }`}
            >
              {statusLabels[tournament.status]}
            </span>
            <span className="text-xs font-bold text-[#33AD6A] bg-[#33AD6A]/5 px-2.5 py-0.5 rounded-lg border border-[#33AD6A]/10">
              {priceLabel}
            </span>
          </div>

          <h2 className="text-xl font-black text-[#1F1F1F] leading-tight tracking-tight">
            {tournament.name}
          </h2>
        </div>

        {/* Date, Location, Spots */}
        <div className="space-y-3.5 bg-[#F7F7F7] p-4 rounded-2xl border border-neutral-100 text-sm text-[#737373]">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#33AD6A] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Fecha y Hora</p>
              <SafeDate date={tournament.tournament_date} className="font-semibold text-[#1F1F1F] mt-0.5 block" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#33AD6A] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Lugar</p>
              <span className="font-semibold text-[#1F1F1F] mt-0.5 block leading-normal">
                {tournament.location}
              </span>
            </div>
          </div>

          {tournament.max_spots && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-[#33AD6A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">Plazas Máximas</p>
                <span className="font-semibold text-[#1F1F1F] mt-0.5 block">
                  {tournament.max_spots} parejas máximo
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Prizes Section */}
        {prizes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <Award className="w-4 h-4 text-[#33AD6A]" />
              Premios
            </h3>
            <div className="space-y-2">
              {prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white border border-[#EAEAEA] rounded-xl text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#33AD6A]/10 text-[#288A56] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {prize.rank}º
                    </span>
                    <span className="font-medium text-zinc-700">{prize.description}</span>
                  </div>
                  {prize.cash > 0 && (
                    <span className="font-bold text-[#33AD6A] bg-[#33AD6A]/5 px-2 py-0.5 rounded border border-[#33AD6A]/10 text-xs">
                      {prize.cash}€
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Info */}
        {registrationText && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <FileText className="w-4 h-4 text-[#33AD6A]" />
              Inscripción
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 whitespace-pre-line">
              {registrationText}
            </p>
          </div>
        )}

        {/* Contact details */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
            <Phone className="w-4 h-4 text-[#33AD6A]" />
            Organizador y Contacto
          </h3>
          {hasContacts && contacts ? (
            <div className="space-y-2.5">
              {contacts.name && (
                <p className="text-sm font-semibold text-[#1F1F1F]">
                  Organiza: <span className="text-[#737373] font-medium">{contacts.name}</span>
                </p>
              )}

              {contacts.description && (
                <p className="text-xs text-[#737373] italic">{contacts.description}</p>
              )}

              <div className="flex flex-wrap gap-2 pt-1.5">
                {/* Call Button */}
                {contacts.phone && (
                  <a
                    href={`tel:${contacts.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F7F7F7] hover:bg-neutral-100 border border-[#EAEAEA] rounded-xl text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#33AD6A]" />
                    Llamar
                  </a>
                )}

                {/* WhatsApp Button */}
                {contacts.phone && contacts.is_whatsapp && (
                  <a
                    href={getWhatsAppUrl(contacts.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-xl text-xs font-bold text-[#128C7E] transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
                    WhatsApp
                  </a>
                )}

                {/* Email Button */}
                {contacts.email && (
                  <a
                    href={`mailto:${contacts.email}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F7F7F7] hover:bg-neutral-100 border border-[#EAEAEA] rounded-xl text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#33AD6A]" />
                    Email
                  </a>
                )}

                {/* Instagram Button */}
                {contacts.instagram && (
                  <a
                    href={`https://instagram.com/${contacts.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F7F7F7] hover:bg-neutral-100 border border-[#EAEAEA] rounded-xl text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 text-center">
              No hay información de contacto disponible.
            </p>
          )}
        </div>

        {/* Rules */}
        {tournament.rules && tournament.rules.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-2">
              <FileText className="w-4 h-4 text-[#33AD6A]" />
              Reglas y Modalidad
            </h3>
            <ul className="list-disc pl-5 text-sm text-[#737373] space-y-1.5">
              {tournament.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Direct Link Action - Sticky Footer */}
      <div className="p-4 border-t border-[#EAEAEA] bg-white shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] flex gap-3">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-11 bg-white hover:bg-[#F7F7F7] border border-[#EAEAEA] hover:border-neutral-300 text-[#1F1F1F] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#33AD6A]" />
          Google Maps
        </a>
        <a
          href={`/torneo/${tournament.short_id}`}
          className="flex-1 h-11 bg-[#33AD6A] hover:bg-[#288A56] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          Ver Torneo
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
