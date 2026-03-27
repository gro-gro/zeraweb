import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // TODO: Configurar Mailgun — agregar MAILGUN_API_KEY y MAILGUN_DOMAIN en .env.local
    //
    // const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    // const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
    //
    // const formData = new FormData();
    // formData.append("from", `Zeratype Web <noreply@${MAILGUN_DOMAIN}>`);
    // formData.append("to", "hola@zeratype.com");
    // formData.append("subject", `Contacto web: ${name}`);
    // formData.append("text", `Nombre: ${name}\nEmail: ${email}\n\n${message}`);
    // formData.append("h:Reply-To", email);
    //
    // const res = await fetch(
    //   `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
    //     },
    //     body: formData,
    //   }
    // );
    //
    // if (!res.ok) throw new Error("Mailgun error");

    console.log("Contact form submission:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}
