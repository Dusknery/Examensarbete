export default function FileUploadButton({
  label = "Välj bild",
  accept = "image/*",
  disabled = false,
  onSelect,
}) {
  return (
    <label className={`fileBtn ${disabled ? "disabled" : ""}`}>
      {label}
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file && onSelect) onSelect(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}