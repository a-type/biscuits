import { TLSCertificate } from './TLSCertificate';
import { ACM } from '@aws-sdk/client-acm';
import { createDnsRecord } from './porkbun';

export async function waitForCertificateValidation(
  certificate: TLSCertificate,
) {
  const arn = certificate.certificateArn;

  // poll on the certificate until the CNAME record is available
  const client = new ACM({});

  let response;
  const began = Date.now();
  while (
    response?.Certificate?.DomainValidationOptions?.[0]?.ResourceRecord
      ?.Type !== 'CNAME' &&
    Date.now() - began < 1000 * 60 * 5
  ) {
    response = await client.describeCertificate({
      CertificateArn: arn,
    });
  }

  if (!response?.Certificate?.DomainValidationOptions?.[0]?.ResourceRecord) {
    throw new Error('Resource record not found (timed out)');
  }

  const cname =
    response.Certificate.DomainValidationOptions[0].ResourceRecord.Name;
  const content =
    response.Certificate.DomainValidationOptions[0].ResourceRecord.Value;

  if (!cname || !content) {
    throw new Error('CNAME or content not found');
  }

  return { cname, content };
}
