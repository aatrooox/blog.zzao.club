interface MailOptions {
  to: string
  subject?: string
  text?: string
  html?: string
  path?: string
}

export function sendMailNotice(name: string, { to, subject, text, path }: MailOptions) {
  const { sendMail } = useNodeMailer()
  const _subject = subject || `来自早早集市(zzao.club)的回复`
  const _html = `
      <div>
        <p style="fontWeight: 800;">Hi👋，<span>${name}</span>：</p>
        <p>${text!.replace(/\n/g, '<br>')}</p>
        <p style="fontSize: 14px;">前往➡️ <a href="${path || 'https://zzao.club'}">早早集市</a></p>
      </div>
    `

  return sendMail({ to, subject: _subject, html: _html })
}
