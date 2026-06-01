export async function GET(req: Request) {
const { searchParams } = new URL(req.url);
const title = searchParams.get("title");

  if (!title) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const url =
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const res = await fetch(url);
  if (!res.ok) {
    return Response.json(
      { error: "Page not found or Wikipedia error" },
      { status: res.status }
    );
  }
  const data = await res.json();

  return Response.json(data);
}