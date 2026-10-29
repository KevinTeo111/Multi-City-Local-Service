import { isEventType, recordEvent } from "@/lib/events";
import { getContact } from "@/lib/queries";

export async function POST(req: Request, ctx: RouteContext<"/api/negocios/[slug]/evento">) {
  const { slug } = await ctx.params;
  if (!getContact(slug)) return Response.json({ error: "No encontrado" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const type = body?.type;
  if (!isEventType(type) || type === "phone_reveal") {
    return Response.json({ error: "Evento inválido" }, { status: 400 });
  }

  recordEvent(slug, type);
  return new Response(null, { status: 204 });
}
