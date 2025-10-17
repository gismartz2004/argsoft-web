<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mensaje = htmlspecialchars(trim($_POST['mensaje']));

    // Validación básica
    if (empty($nombre) || empty($email) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Error: Datos inválidos.";
        exit;
    }

    // Aquí puedes integrar:
    // - Envío por correo (con PHPMailer o mail())
    // - Guardar en base de datos
    // - Enviar a CRM (como HubSpot, etc.)

    $to = "tu-email@tudominio.com"; // ¡Cambia esto!
    $subject = "Nuevo mensaje de contacto - Tu Startup";
    $body = "Nombre: $nombre\nEmail: $email\nMensaje:\n$mensaje";
    $headers = "From: web@tudominio.com";

    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado. ¡Gracias!";
    } else {
        http_response_code(500);
        echo "Error al enviar. Inténtalo más tarde.";
    }
} else {
    http_response_code(403);
    echo "Acceso no permitido.";
}
?>