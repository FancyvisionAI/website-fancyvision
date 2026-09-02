import styles from "./whatsapp-float-button.module.css";

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
        fill="currentColor"
      />
      <path
        d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.6 1.44 5.13L2 22l4.99-1.4A9.95 9.95 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.7 0-3.28-.5-4.6-1.36l-.33-.2-3.06.86.85-2.99-.21-.34a8.1 8.1 0 0 1-1.24-4.1c0-4.48 3.65-8.13 8.13-8.13S20.15 7.52 20.15 12s-3.65 8.13-8.13 8.13Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppFloatButton({ phone, label }: { phone: string; label: string }) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.launcher}
      aria-label={label}
    >
      <WhatsAppIcon />
    </a>
  );
}
