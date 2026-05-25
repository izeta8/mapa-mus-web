
interface FieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

export default function Field({ label, required, children }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}