import { NotificationTemplate } from '@prisma/client';

type AttachmentsWithContent = {
  filename: string;
  content: string;
};

type AttachmentsWithPath = {
  filename: string;
  path: string;
};

export type Attachments = AttachmentsWithContent | AttachmentsWithPath;

export type EmailTemplateType = {
  to: string[];
  templateParams: {
    [key: string]: string | number | boolean;
  };
  template: Omit<NotificationTemplate, 'id'>;
  attachments?: Attachments[];
};
