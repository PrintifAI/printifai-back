import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

type ReturnType = {
    externalMessage: string;
    code: HttpStatus;
};

export const getResponseByExceptionPrototype = (
    exception: Error,
): ReturnType => {
    let externalMessage: string = 'Internal Server Error';
    let code = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
        exception.name === 'BadRequestException' ||
        exception.name === 'NotFoundException' ||
        exception.name === 'UnauthorizedException' ||
        exception.name === 'ForbiddenException'
    ) {
        const nestException = exception as HttpException;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = nestException.getResponse() as any;

        if (Array.isArray(response?.message)) {
            externalMessage = response.message[0] || externalMessage;
        } else {
            externalMessage = response.message;
        }

        code = nestException.getStatus();
    }

    return {
        code,
        externalMessage,
    };
};
