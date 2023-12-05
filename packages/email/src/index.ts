import nodemailer from 'nodemailer';

export class Email {
  private transporter;

  constructor(user: string, pass: string, private uiOrigin: string) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      pool: true,
      auth: {
        user: user?.trim() || '',
        pass: pass?.trim() || '',
      },
    });
    this.transporter.verify().then((error) => {
      if (error !== true) {
        console.error('Email error:', error);
      } else {
        console.log('Email ready');
      }
    });
  }

  sendEmailVerification({
    to,
    code,
    returnTo,
  }: {
    to: string;
    code: string;
    returnTo?: string;
  }) {
    return this.transporter.sendMail({
      from: 'hi@biscuits.club',
      to,
      subject: 'Verify your email on Biscuits',
      text: `Your verification code is ${code}`,
      html: `
			<div>
				<h1>Thanks for signing up to Biscuits!</h1>
				<p>Click the button below to finish signing up on this device.</p>
				<a href="${this.uiOrigin}/verify?code=${code}${
        returnTo ? `&returnTo=${returnTo}` : ''
      }">Verify my email</a>
				<p>After that, you can sign in on any device you want to sync to, for any Biscuits app!</p>
				<p>If you didn't request this email, you can safely ignore it.</p>
				<p>Thanks,</p>
				<p>Grant</p>
			</div>`,
    });
  }

  sendPasswordReset({
    to,
    code,
    returnTo,
  }: {
    to: string;
    code: string;
    returnTo?: string;
  }) {
    return this.transporter.sendMail({
      from: 'hi@biscuits.club',
      to,
      subject: 'Reset your password on Biscuits',
      text: `Your password reset code is ${code}`,
      html: `
			<div>
				<h1>Reset your password on Biscuits</h1>
				<p>Click the link below to reset your password.</p>
				<a href="${this.uiOrigin}/reset-password?code=${code}${
        returnTo ? `&returnTo=${returnTo}` : ''
      }">Reset my password</a>
				<p>If you didn't request this email, you can safely ignore it.</p>
				<p>Thanks,</p>
				<p>Grant</p>
			</div>`,
    });
  }
}
