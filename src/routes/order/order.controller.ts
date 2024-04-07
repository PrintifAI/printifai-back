import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { Order } from '../../../generated/prisma';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { BearerGuard } from '../../guards/bearer.guard';

@Controller()
export class OrderController {
    constructor(private readonly prismaService: PrismaService) {}

    @Post('order')
    async createOrder(@Body() orderDto: OrderDto): Promise<Order> {
        return this.prismaService.order.create({
            data: {
                data: orderDto.data,
            },
        });
    }

    @UseGuards(BearerGuard)
    @Get('order')
    async getOrders(): Promise<Order[]> {
        return this.prismaService.order.findMany();
    }
}
