import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(paymentDto: any) {
    const payment = new this.paymentModel(paymentDto);
    return payment.save();
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, status, method, startDate, endDate } = query;

    const filter: any = {};

    if (status) filter.status = status;
    if (method) filter.method = method;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const data = await this.paymentModel
      .find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(limit));

    const total = await this.paymentModel.countDocuments(filter);

    return {
      data,
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id);
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const [totalToday, failedCount, totalRevenue, last7Days] =
      await Promise.all([
        this.paymentModel.countDocuments({
          createdAt: { $gte: today },
        }),
        this.paymentModel.countDocuments({ status: 'failed' }),
        this.paymentModel.aggregate([
          { $match: { status: 'success' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        this.paymentModel.aggregate([
          {
            $match: {
              createdAt: { $gte: oneWeekAgo },
              status: 'success',
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
              },
              total: { $sum: '$amount' },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    return {
      totalToday,
      failedCount,
      totalRevenue: totalRevenue[0]?.total || 0,
      last7Days,
    };
  }
}
