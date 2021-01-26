import nodemailer, { Transporter } from "nodemailer";
import { inject, injectable } from "tsyringe";
import aws from "aws-sdk";
import mailConfig from "@config/mail";
import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";
import IMailprovider from "../models/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";

@injectable()
export default class SESMailProvider implements IMailprovider {
  private client: Transporter;

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_DEFAULT_REGION,
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.address || email,
      },
      to,
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
