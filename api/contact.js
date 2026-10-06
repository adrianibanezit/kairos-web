export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Método no permitido.'
    });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { name, email, message } = req.body || {};

  // Validar datos
  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      message: 'Faltan datos obligatorios (name, email, message).'
    });
  }

  // Variables de entorno
  const apiKey = process.env.RESEND_API_KEY;
  const destinationEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  // ID de la plantilla creada en Resend
  const confirmationTemplateId =
    process.env.RESEND_CONFIRMATION_TEMPLATE_ID;

  // Validar API Key
  if (!apiKey) {
    console.error('RESEND_API_KEY no está configurada');

    return res.status(500).json({
      ok: false,
      message: 'Falta la configuración de API Key.'
    });
  }

  // Validar email destino
  if (!destinationEmail) {
    console.error('RESEND_TO_EMAIL no está configurada');

    return res.status(500).json({
      ok: false,
      message: 'Falta la configuración del email destino.'
    });
  }

  try {
    // Sanitizar datos para HTML
    const sanitizedName = String(name)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const sanitizedEmail = String(email)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const sanitizedMessage = String(message)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // =====================================================
    // 1. EMAIL PARA KAIROS
    // =====================================================

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },

      body: JSON.stringify({
        from: fromEmail,
        to: destinationEmail,
        reply_to: email,

        subject: `Nuevo mensaje desde la web - ${name}`,

        html: `
          <h2>Nuevo mensaje desde KAIROS VISUALS</h2>

          <p>
            <strong>Nombre:</strong>
            ${sanitizedName}
          </p>

          <p>
            <strong>Email:</strong>
            <a href="mailto:${sanitizedEmail}">
              ${sanitizedEmail}
            </a>
          </p>

          <hr>

          <p>
            <strong>Mensaje:</strong>
          </p>

          <p>
            ${sanitizedMessage.replace(/\n/g, '<br>')}
          </p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Resend:', data);

      throw new Error(
        data?.message || 'Error enviando el email.'
      );
    }

    console.log('Email para KAIROS enviado:', data.id);

    // =====================================================
    // 2. EMAIL DE CONFIRMACIÓN PARA EL CLIENTE
    // =====================================================

    if (confirmationTemplateId) {
      try {
        const confirmationResponse = await fetch(
          'https://api.resend.com/emails',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`
            },

            body: JSON.stringify({
              from: fromEmail,
              to: email,

              template: {
                id: confirmationTemplateId,

                variables: {
                  NAME: String(name)
                }
              }
            })
          }
        );

        const confirmationData =
          await confirmationResponse.json();

        if (!confirmationResponse.ok) {
          console.error(
            'Error enviando confirmación:',
            confirmationData
          );
        } else {
          console.log(
            'Confirmación enviada al cliente:',
            confirmationData.id
          );
        }

      } catch (confirmationError) {
        // No hacemos fallar el formulario si falla
        // solamente el correo de confirmación.
        console.error(
          'Error en email de confirmación:',
          confirmationError.message
        );
      }
    }

    // =====================================================
    // RESPUESTA FINAL
    // =====================================================

    return res.status(200).json({
      ok: true,
      message: 'Mensaje enviado correctamente.'
    });

  } catch (error) {
    console.error(
      'Error al enviar email:',
      error.message
    );

    return res.status(500).json({
      ok: false,
      message:
        'No se pudo enviar el email. Intenta de nuevo más tarde.'
    });
  }
}