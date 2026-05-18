import { useState, useEffect } from 'react';

export const useShipping = (city) => {
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    if (!city) setShippingCost(0);
    else if (city.toLowerCase() === 'karachi') setShippingCost(250);
    else setShippingCost(400);
  }, [city]);

  return { shippingCost };
};