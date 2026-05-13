<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nombreRemitente,
        public string $emailRemitente,
        public string $asunto,
        public string $mensaje,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Contacto: ' . $this->asunto,
            replyTo: [new Address($this->emailRemitente, $this->nombreRemitente)],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.contacto',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
