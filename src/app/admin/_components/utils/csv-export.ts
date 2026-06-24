export function downloadCsv<T>(
  filename: string,
  headers: string[],
  data: T[],
  rowMapper: (item: T) => (string | number | boolean | null | undefined)[]
) {
  const rows = data.map(rowMapper);
  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
