interface ContactForm {
  name: string;
  phone: string;
  is_whatsapp: boolean;
  instagram: string;
  facebook: string;
  email: string;
  description: string;
}

interface ContactEditorProps {
  contacts: ContactForm[];
  onContactsChange: (contacts: ContactForm[]) => void;
  isPending: boolean;
}

export function ContactEditor({ contacts, onContactsChange, isPending }: ContactEditorProps) {
  const addContact = () => {
    onContactsChange([
      ...contacts,
      { name: "", phone: "", is_whatsapp: true, instagram: "", facebook: "", email: "", description: "" }
    ]);
  };

  const removeContact = (index: number) => {
    if (contacts.length === 1) return;
    onContactsChange(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (index: number, field: keyof ContactForm, value: string | boolean) => {
    onContactsChange(
      contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center border-b pb-1">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Contactos de la Organización
        </h3>
        <button
          type="button"
          onClick={addContact}
          disabled={isPending}
          className="inline-flex items-center gap-1 text-[10px] text-[#33AD6A] hover:text-[#288A56] font-bold px-2 py-1 bg-[#33AD6A]/10 rounded-lg border border-[#33AD6A]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Añadir otro contacto
        </button>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, index) => {
          const hasOtherDetails = !!(
            contact.phone.trim() ||
            contact.email.trim() ||
            contact.instagram.trim() ||
            contact.facebook.trim() ||
            contact.description.trim()
          );

          return (
            <div 
              key={index}
              className="p-5 border border-[#EAEAEA] rounded-xl bg-neutral-50 space-y-4 relative group"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-neutral-400">
                  Contacto #{index + 1}
                </span>
                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                    Nombre del Contacto {hasOtherDetails && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, "name", e.target.value)}
                    disabled={isPending}
                    required={hasOtherDetails}
                    placeholder="ej. Karlos o La barra"
                    className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
                  />
                </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                  disabled={isPending}
                  placeholder="ej. 600123456"
                  className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, "email", e.target.value)}
                  disabled={isPending}
                  placeholder="ej. contacto@bar.com"
                  className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Instagram
                </label>
                <input
                  type="text"
                  value={contact.instagram}
                  onChange={(e) => handleContactChange(index, "instagram", e.target.value)}
                  disabled={isPending}
                  placeholder="ej. @organizacion"
                  className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Facebook
                </label>
                <input
                  type="text"
                  value={contact.facebook}
                  onChange={(e) => handleContactChange(index, "facebook", e.target.value)}
                  disabled={isPending}
                  placeholder="ej. facebook.com/organizacion"
                  className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`whatsapp-${index}`}
                checked={contact.is_whatsapp}
                onChange={(e) => handleContactChange(index, "is_whatsapp", e.target.checked)}
                disabled={isPending}
                className="w-4 h-4 text-[#33AD6A] border-gray-300 rounded focus:ring-[#33AD6A] cursor-pointer"
              />
              <label 
                htmlFor={`whatsapp-${index}`}
                className="text-xs font-semibold text-neutral-600 cursor-pointer"
              >
                Este número tiene WhatsApp para recibir inscripciones
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">
                Notas de contacto
              </label>
              <input
                type="text"
                value={contact.description}
                onChange={(e) => handleContactChange(index, "description", e.target.value)}
                disabled={isPending}
                placeholder="ej. Solo llamadas tardes / para inscripciones"
                className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
              />
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
