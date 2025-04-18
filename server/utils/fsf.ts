interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
export function sendMail({ to, subject, text, html }: MailOptions) {
  const { sendMail } = useNodeMailer();

  return sendMail({ to, subject, text, html });
}