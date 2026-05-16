import { Resend } from "resend";
import { randomInt } from "crypto";
import { throwError } from "../utils/asyncHandler.js";
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";

const resend = new Resend(process.env.RESEND_API_KEY)

export const generarCodigo = () => {
  return randomInt(100000, 999999).toString();
}

export async function sendEmail(email, token) {

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Quién está envíando el correo
      to: email,                        // A quien le vá a llegar
      subject: "Tu código de verificación",                       // El asunto del correo (titulo)

      // Mensaje
      html: ` <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2>Verifica tu cuenta</h2>
        <p>Tu código de verificación es:</p>
        <div style="
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #4F46E5;
          text-align: center;
          padding: 20px;
          background: #F3F4F6;
          border-radius: 8px;
        ">
          ${token}
        </div>
        <p style="color: gray; font-size: 12px;">
          Este código expira en 10 minutos.
        </p>
      </div>`
    })
  } catch {
    throwError(ERROR_MESSAGES.CORREO_NO_ENVIADO, 500);
  }

}