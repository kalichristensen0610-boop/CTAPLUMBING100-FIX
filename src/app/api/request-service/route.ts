const landingPageOrigin = "https://cta-plumbing-100.tkyy67t28j.chatgpt.site";
const maxBodyBytes = 4096;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host");
  const contentType = request.headers.get("content-type")?.split(";")[0];

  if (contentType !== "application/json" ||
      !origin ||
      origin !== new URL(request.url).origin && origin !== `https://${host}`) {
    return Response.json({ accepted: false }, { status: 403 });
  }

  if (Number(request.headers.get("content-length")) > maxBodyBytes) {
    return Response.json({ accepted: false }, { status: 413 });
  }

  try {
    const body = await request.arrayBuffer();
    if (body.byteLength > maxBodyBytes) {
      return Response.json({ accepted: false }, { status: 413 });
    }

    // Both copies of the landing page feed the same private inquiry inbox.
    const upstream = await fetch(`${landingPageOrigin}/api/request-service`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: landingPageOrigin },
      body,
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    const result = await upstream.json().catch(() => null);
    return Response.json({ accepted: upstream.ok && result?.accepted === true }, {
      status: upstream.ok ? 200 : upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ accepted: false }, { status: 502 });
  }
}
