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
  while (
    response?.Certificate?.DomainValidationOptions?.[0]?.ResourceRecord
      ?.Type !== 'CNAME'
  ) {
    response = await client.describeCertificate({
      CertificateArn: arn,
    });
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
