/**
 * @param text The message content in Markdown/HTML format.
 * @returns An object indicating success, and error message if failed.
 */
export async function sendTelegramNotification(text: string): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in environment variables.");
    return {
      success: false,
      error: "El servicio de notificaciones de Telegram no está configurado."
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error("Telegram API Error:", data);

      if (data.error_code === 400 && data.description?.includes("chat not found")) {
        return {
          success: false,
          error: "Error: El bot no puede enviarte mensajes todavía. Por favor, busca @mapamus_verifier_bot en Telegram y pulsa en 'Iniciar' (/start) primero."
        };
      }

      return {
        success: false,
        error: `Telegram Error: ${data.description || "error desconocido (400)"}`
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception sending Telegram message:", err);
    return {
      success: false,
      error: "No se pudo conectar con el servicio de Telegram. Inténtalo de nuevo."
    };
  }
}
