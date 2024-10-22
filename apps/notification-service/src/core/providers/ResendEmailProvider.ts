import { Resend } from 'resend';
import hbs from 'handlebars';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { EnvType } from '@Root/config/env.validation';
import {
  LogNotificationSchema,
  LogNotificationSchemaType,
} from '@notification/consumer/schemas/log-notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toZonedTime } from 'date-fns-tz';
@Injectable()
export class ResendEmailProvider {
  constructor(
    private configService: ConfigService<EnvType>,
    @InjectModel(LogNotificationSchema.name, 'logs')
    private logNotificationModel: Model<LogNotificationSchema>,
  ) {}

  /**
   * Send email
   */
  async send({ to, templateParams, template, attachments }: EmailTemplateType) {
    const resend = this.buildResendInstance();

    const renderTemplate = this.renderEmailTemplate(template, templateParams);

    const resendSdkPayload = {
      from: 'Acme <onboarding@resend.dev>',
      to:
        this.configService.get('NODE_ENV') === 'production'
          ? to
          : [this.configService.get('DEVELOPER_MAIL_FOR_DEV_ENV')],
      subject: template.subject,
      html: renderTemplate,
      attachments: attachments ?? [],
    };

    const { data, error } = await resend.emails.send(resendSdkPayload);

    const notificationLogObject: LogNotificationSchemaType = {
      type: 'EMAIL',
      template,
      createdAt: new Date(toZonedTime(new Date(), 'Europe/Istanbul')),
      sdkPayload: resendSdkPayload,
      sdkResponse: data ? data : error,
    };

    if (this.configService.get('NODE_ENV') === 'development') {
      console.log('*********');
      console.log('Email sent', data);
      console.log('*********');
      return;
    }

    await this.logNotificationModel.create(notificationLogObject);
  }

  /**
   * Build Resend instance
   */
  private buildResendInstance() {
    const RESEND_API_KEY = this.configService.get<string>('RESEND_API_KEY');
    return new Resend(RESEND_API_KEY);
  }

  /**
   * Render email template
   */
  protected renderEmailTemplate(
    template: EmailTemplateType['template'],
    params: EmailTemplateType['templateParams'],
  ) {
    const templateDir =
      'apps/notification-service/src/core/views/templates/' +
      template.emailTemplateFileName;

    const layoutDir =
      'apps/notification-service/src/core/views/layouts/layout.hbs';

    try {
      const compileLayout = hbs.compile(fs.readFileSync(layoutDir, 'utf8'));

      const compileTemplate = hbs.compile(fs.readFileSync(templateDir, 'utf8'));

      return compileLayout({
        BODY: compileTemplate(params),
      });
    } catch (error) {
      console.error('Error while rendering email template', error);
      throw new Error('Error while rendering email template');
    }
  }
}
