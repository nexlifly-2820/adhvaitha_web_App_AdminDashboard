export const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

/**
 * Fetches an authentication token from Shiprocket using credentials in .env.local
 */
export async function getShiprocketToken(): Promise<string> {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials are not configured in environment variables.");
  }

  try {
    const response = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      // Shiprocket tokens expire, so we probably shouldn't cache this aggressively 
      // without checking expiration. For now, no-store is safer.
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to authenticate with Shiprocket: ${errorText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching Shiprocket token:", error);
    throw error;
  }
}

/**
 * Creates a new order in Shiprocket
 * @param orderData The formatted order payload expected by Shiprocket
 */
export async function createShiprocketOrder(orderData: any) {
  try {
    const token = await getShiprocketToken();

    const response = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create order in Shiprocket: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating Shiprocket order:", error);
    throw error;
  }
}
