import Field from "@/components/ui/custom/Field";
import { Contact } from "@/types";

interface TournamentContactsSectionProps {
  contacts: Contact[];
  isPending: boolean;
  onChange: (contacts: Contact[]) => void;
  inputClass: string;
}

const DEFAULT_CONTACT: Contact = {
  name: "",
  phone: null,
  is_whatsapp: false,
  instagram: null,
  facebook: null,
  email: null,
  description: null,
};

export default function TournamentContactsSection({
  contacts,
  isPending,
  onChange,
  inputClass
}: TournamentContactsSectionProps) {
  const update = (index: number, updated: Contact) => {
    const next = [...contacts];
    next[index] = updated;
    onChange(next);
  };

  const add = () => onChange([...contacts, { ...DEFAULT_CONTACT }]);

  const remove = (index: number) => onChange(contacts.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {contacts.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-neutral-100 rounded-2xl">
          <p className="text-sm text-neutral-400">Sin contactos añadidos.</p>
          <button
            type="button"
            onClick={add}
            disabled={isPending}
            className="mt-2 text-[#33AD6A] text-xs font-bold hover:underline cursor-pointer"
          >
            Añadir el primero
          </button>
        </div>
      )}

      <div className="space-y-6">
        {contacts.map((contact, index) => (
          <div key={index} className="relative p-5 bg-neutral-50 border border-[#EAEAEA] rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-[#33AD6A] uppercase tracking-widest">
                Contacto #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={isPending}
                className="text-[10px] text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre de contacto">
                <input
                  className={inputClass}
                  placeholder="ej. Karlos, o Recepción/Bar"
                  value={contact.name || ""}
                  disabled={isPending}
                  onChange={(e) => update(index, { ...contact, name: e.target.value })}
                />
              </Field>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">Teléfono</label>
                <input
                  className={inputClass}
                  placeholder="ej. 600 000 000"
                  value={contact.phone || ""}
                  disabled={isPending}
                  onChange={(e) => update(index, { ...contact, phone: e.target.value })}
                />
              </div>

              <Field label="Email">
                <input
                  type="email"
                  className={inputClass}
                  placeholder="contacto@organizador.com"
                  value={contact.email || ""}
                  disabled={isPending}
                  onChange={(e) => update(index, { ...contact, email: e.target.value })}
                />
              </Field>

              <Field label="Instagram">
                <input
                  className={inputClass}
                  placeholder="@usuario"
                  value={contact.instagram || ""}
                  disabled={isPending}
                  onChange={(e) => update(index, { ...contact, instagram: e.target.value })}
                />
              </Field>

            </div>


            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={contact.is_whatsapp || false}
                disabled={isPending}
                onChange={(e) => update(index, { ...contact, is_whatsapp: e.target.checked })}
                className="rounded"
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
                value={contact.description || ""}
                onChange={(e) => update(index, { ...contact, description: e.target.value })}
                disabled={isPending}
                placeholder="ej. Solo llamadas tardes / para inscripciones"
                className="w-full h-10 px-3 border border-[#EAEAEA] hover:border-neutral-300 focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-sm bg-white"
              />
            </div>


          </div>
        ))}
      </div>

      {contacts.length > 0 && (
        <button
          type="button"
          onClick={add}
          disabled={isPending}
          className="text-xs font-bold text-[#33AD6A] hover:text-[#288A56] hover:underline transition-colors cursor-pointer"
        >
          + Añadir otro contacto
        </button>
      )}
    </div>
  );
}

