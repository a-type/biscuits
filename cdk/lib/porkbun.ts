const apiKey = process.env.PORKBUN_API_KEY;
const apiSecret = process.env.PORKBUN_API_SECRET;
if (!apiKey || !apiSecret) {
  throw new Error('PORKBUN_API_KEY and PORKBUN_API_SECRET must be set');
}

export async function createDnsRecord(
  domain: string,
  record: {
    type: string;
    content: string;
    ttl?: number;
    prio?: number;
    name?: string;
  },
) {
  console.info('Creating DNS record:', record);
  const response = await fetch(
    `https://porkbun.com/api/json/v3/dns/create/${domain}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...record,
        apikey: apiKey,
        secretapikey: apiSecret,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to create DNS record: ${response.statusText}`);
  } else {
    console.info('✅ DNS record created');
  }
  const json = await response.json();
  console.info('Response:', json);
}
