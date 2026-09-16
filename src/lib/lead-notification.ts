type Row = readonly [label: string, value: string | undefined];
type Section = { title: string; rows: readonly Row[] };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

/** Inline styles and real tables keep notification emails readable in Gmail and Outlook. */
export function leadNotification(title: string, sections: readonly Section[]) {
  const text = [title, "Website: CTA Plumbing 100", ...sections.flatMap(section => ["", section.title.toUpperCase(), ...section.rows.map(([label, value]) => `${label}: ${value || "Not provided"}`)])].join("\n");
  const html = `<!doctype html><html><body style="margin:0;padding:20px 12px;background:#f1f5f9;font-family:Arial,sans-serif;color:#10253f"><table role="presentation" style="width:100%;max-width:680px;margin:0 auto;border-collapse:collapse;background:#ffffff"><tr><td style="padding:24px;background:#10253f;color:#ffffff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;color:#f3c895">CTA PLUMBING 100</p><h1 style="margin:0;font-size:25px;line-height:1.3">${escapeHtml(title)}</h1><p style="margin:10px 0 0;font-size:14px">New website form submission</p></td></tr><tr><td style="padding:8px 20px 24px">${sections.map(section => `<h2 style="margin:24px 0 10px;font-size:18px">${escapeHtml(section.title)}</h2><table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px">${section.rows.map(([label, value]) => `<tr><th scope="row" style="width:36%;padding:12px 10px;border:1px solid #cbd5e1;background:#f8fafc;text-align:left;vertical-align:top;font-weight:bold;overflow-wrap:anywhere">${escapeHtml(label)}</th><td style="padding:12px 10px;border:1px solid #cbd5e1;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;white-space:pre-wrap">${escapeHtml(value || "Not provided")}</td></tr>`).join("")}</table>`).join("")}</td></tr></table></body></html>`;
  return { text, html };
}