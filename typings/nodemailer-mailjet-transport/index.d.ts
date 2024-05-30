declare module 'nodemailer-mailjet-transport' {
    import { Transport } from 'nodemailer';
  
    interface MailjetTransportOptions {
      auth: {
        apiKey: string;
        apiSecret: string;
      };
    }

    const mailjetTransport: (options: MailjetTransportOptions) => Transport;
  
    export = mailjetTransport;
  }
  