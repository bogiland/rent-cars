const STATS = [
  { value: "30+",     label: "Cars in the fleet" },
  { value: "1,247",   label: "Verified reviews" },
  { value: "100%",    label: "Insurance included" },
  { value: "<15 min", label: "Booking confirmation" },
];

export function TrustBar() {
  return (
    <section
      className="py-10 border-y border-[var(--color-border)]"
      aria-label="Trust signals"
    >
      <div className="container">
        <ul
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          role="list"
        >
          {STATS.map(({ value, label }) => (
            <li key={label} className="text-center md:text-left">
              <p
                className="text-2xl font-medium leading-none text-[var(--color-fg)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </p>
              <p className="text-sm text-[var(--color-fg-muted)] mt-2">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
