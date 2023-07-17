import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
    return {
      name: 'PaymentRequiredError',
      message: 'No payment for this entity!',
    };
  }