import { recordEvent } from "@/lib/events";
import { getContact } from "@/lib/queries";

// The phone number is only sent after a click, so every reveal is counted and
// the number never appears in the page HTML for scrapers.
export async function POST(_req: Request, ctx: RouteContext<"/api/negocios/[slug]/telefono">) {
  const { slug } = await ctx.params;
  const contact = getContact(slug);
  if (!contact) return Response.json({ error: "No encontrado" }, { status: 404 });

  recordEvent(slug, "phone_reveal");
  return Response.json(contact, { headers: { "Cache-Control": "no-store" } });
}
