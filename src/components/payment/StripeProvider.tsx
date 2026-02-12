
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import PaymentService from '@/services/PaymentService';

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const stripePromise = PaymentService.getStripe();
  
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
