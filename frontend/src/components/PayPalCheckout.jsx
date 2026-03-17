import React, { useEffect, useRef, useState } from 'react';
import '../styles/PayPalCheckout.css';

const PayPalCheckout = ({ paymentData }) => {
  const paypalRef = useRef(null);
  const [error, setError] = useState(null);
  const sdkLoadedRef = useRef(false);
  const buttonsRenderedRef = useRef(false);

  useEffect(() => {
    if (!paymentData) return undefined;

    const loadAndRenderPayPal = async () => {
      try {
        // Clear previous content
        if (paypalRef.current) {
          paypalRef.current.innerHTML = '';
        }

        buttonsRenderedRef.current = false;

        // Load PayPal SDK only once
        if (!sdkLoadedRef.current && !window.paypal) {
          sdkLoadedRef.current = true;
          
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=AVgNu0oSNALm2g5CNUylYIhitE_qgT1TuJNtNc6Y9R-6XMeaOqWVeed3645THIbtjQ9BnUneYH_Zj-7n&currency=USD';
            script.async = true;

            script.onload = () => {
              renderButtons();
              resolve();
            };

            script.onerror = () => {
              setError('Failed to load PayPal SDK. Please refresh the page.');
              reject(new Error('PayPal SDK failed to load'));
            };

            document.body.appendChild(script);
          });
        } else if (window.paypal && !buttonsRenderedRef.current) {
          // SDK already loaded, render buttons
          renderButtons();
        }
      } catch (err) {
        console.error('Error loading PayPal:', err);
      }
    };

    const renderButtons = () => {
      if (!window.paypal || !paypalRef.current || buttonsRenderedRef.current) return;

      buttonsRenderedRef.current = true;

      const nameParts = (paymentData.payer_info.name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || 'Donor';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Payment';

      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: paymentData.paypal_data.amount,
                  },
                  custom_id: paymentData.paypal_data.invoice,
                  description: 'Donation',
                },
              ],
              payer: {
                name: {
                  given_name: firstName,
                  surname: lastName,
                },
                email_address: paymentData.payer_info.email,
              },
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              console.log('Payment approved:', details);
              window.location.href = '/payment-success';
            } catch (err) {
              setError('Failed to capture payment: ' + err.message);
              console.error('Capture error:', err);
            }
          },
          onError: (err) => {
            setError('Payment error: ' + (err.message || 'Unknown error occurred'));
            console.error('Payment error:', err);
          },
        })
        .render(paypalRef.current)
        .catch((err) => {
          setError('Failed to render PayPal buttons: ' + err.message);
          console.error('Render error:', err);
        });
    };

    loadAndRenderPayPal();

    return () => {
      buttonsRenderedRef.current = false;
    };
  }, [paymentData]);

  return (
    <div className="paypal-checkout-container">
      <h2>Complete Payment via PayPal</h2>
      <div className="payment-summary">
        <p>
          <strong>Amount:</strong> ${paymentData?.paypal_data?.amount}
        </p>
        <p>
          <strong>Invoice:</strong> {paymentData?.paypal_data?.invoice}
        </p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div ref={paypalRef} className="paypal-button-container"></div>
    </div>
  );
};

export default PayPalCheckout;