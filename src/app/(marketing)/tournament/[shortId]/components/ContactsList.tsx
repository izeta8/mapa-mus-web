import { MessageCircle, Phone } from 'lucide-react';
import { Contact } from '@/types';

interface ContactsListProps {
  contacts: Contact[];
}

export function ContactsList({ contacts }: ContactsListProps) {
  if (contacts.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F1F1F] mb-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-[#33AD6A]" />
        Contacto e Inscripciones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contacts.map((contact: Contact, idx: number) => (
          <div
            key={idx}
            className="bg-white border border-[#EAEAEA] rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-[#33AD6A]/30 transition-all shadow-sm"
          >
            <div>
              <p className="font-semibold text-[#1F1F1F]">{contact.name || 'Organizador'}</p>
              {contact.phone && <p className="text-sm text-[#737373] mt-0.5">{contact.phone}</p>}
              {contact.email && <p className="text-xs text-[#737373] mt-0.5">{contact.email}</p>}
              {contact.instagram && <p className="text-xs text-[#288A56] font-medium mt-1">@{contact.instagram}</p>}
            </div>
            
            {contact.phone && (
              <div className="flex gap-2 mt-1">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-center gap-1 flex-1 py-2 bg-[#F7F7F7] hover:bg-[#EAEAEA] text-[#1F1F1F] border border-[#EAEAEA] font-semibold text-xs rounded-lg transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#737373]" />
                  Llamar
                </a>
                {contact.is_whatsapp && (
                  <a
                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 flex-1 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/20 font-semibold text-xs rounded-lg transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
