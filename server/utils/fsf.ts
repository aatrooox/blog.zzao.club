interface MailOptions {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
}
/**
 * 发送邮件通知
 * @param name 对方称呼
 * @param param1 邮件配置
 * @returns nodemailer 发送邮件返回的信息
 */
export function sendMailNotice(name: string, { to, subject, text }: MailOptions) {
  const { sendMail } = useNodeMailer();
  const _subject = subject || `来自早早集市(zzao.club)的回复`
  const _html = `
      <div>
        <p>Hi， <span style="color: red">${name}</span>：</p>
        <p>${text!.replace(/\n/g, '<br>')}</p>
      </div>
    `

  return sendMail({ to, subject: _subject, html: _html });
}