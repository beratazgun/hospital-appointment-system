import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentSlotCommand } from './command/impl/create-appointment-slot.impl';
import { SendEmailForUpcomingAppointmentsCommand } from './command/impl/send-email-for-upcoming-appointments.impl';
import { LogJobsSchema } from './schema/log-jobs.schema';
import { getNowByLocale } from '@common/constants/custom-date-fns-methods';
import { ConfigService } from '@nestjs/config';
import { EnvType } from '@Root/config/env.validation';
import { CancelMissedAppointmentsCommand } from './command/impl/cancel-missed-appointments.impl';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(
    private readonly commandBus: CommandBus,
    @InjectModel(LogJobsSchema.name, 'logs')
    private readonly logJobsModel: Model<LogJobsSchema>,
    private configService: ConfigService<EnvType>,
  ) {}

  /**
   * Create appointment slots on the 15th of every month at 4pm.
   */
  // @Cron('0 4 15 * *') // --> It will work at 4pm on the 15th of every month
  // @Cron(CronExpression.EVERY_5_SECONDS) // --> It will work every 5 second
  async handleCreateAppointmentSlots() {
    await this.executeJob('createAppointmentSlots', () =>
      this.commandBus.execute(new CreateAppointmentSlotCommand()),
    );
  }

  /**
   * Send reminders for upcoming appointments every 1 hour.
   */
  @Cron(CronExpression.EVERY_HOUR) // --> It will work every hour
  async handleSendEmailForUpcomingAppointments() {
    await this.executeJob('sendEmailForUpcomingAppointments', () =>
      this.commandBus.execute(new SendEmailForUpcomingAppointmentsCommand()),
    );
  }

  /**
   * Cancel missed appointments every day at 6pm.
   */
  @Cron(CronExpression.EVERY_DAY_AT_6PM) // --> It will work at 6pm every day
  async handleCancelMissedAppointments() {
    await this.executeJob('sendEmailForUpcomingAppointments', () =>
      this.commandBus.execute(new CancelMissedAppointmentsCommand()),
    );
  }

  /**
   * Generic method to execute a job and log the result.
   */
  private async executeJob(jobName: string, jobFunction: () => Promise<void>) {
    const startTime = getNowByLocale();
    /**
     * Log job start in development environment.
     */
    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.log(`${jobName} job started`);
    }

    try {
      await jobFunction();
      await this.logJob(startTime, jobName, 'success');
    } catch (error) {
      /**
       * Log job failure in development environment.
       */
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.error(`${jobName} job failed`, error.message);
      }
      await this.logJob(startTime, jobName, 'failed', error.message);
    }
  }

  /**
   * Logs job execution details.
   */
  private async logJob(
    startTime: Date,
    jobName: string,
    status: 'success' | 'failed',
    errorMessage?: string,
  ) {
    const endTime = getNowByLocale();
    const duration = endTime.getTime() - startTime.getTime();

    const logEntry = {
      jobStartedAt: startTime,
      jobEndedAt: endTime,
      jobName,
      jobStatus: status,
      jobDuration: duration,
      errorMessage,
      createdAt: getNowByLocale(),
    };

    await this.logJobsModel.create(logEntry);
  }
}
