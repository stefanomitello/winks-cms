export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
