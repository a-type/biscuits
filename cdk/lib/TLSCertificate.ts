import { RemovalPolicy } from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export class TLSCertificate extends Certificate {
  constructor(construct: Construct, appId: string) {
    super(construct, `${appId}_certificate`, {
      domainName: `${appId}.biscuits.club`,
      certificateName: `${appId}.biscuits.club_cert`,
      validation: CertificateValidation.fromDns(),
      subjectAlternativeNames: appId === 'www' ? [`biscuits.club`] : undefined,
    });
    // retain the certificate when the stack is deleted. it's annoying to
    // reprovision these.
    this.applyRemovalPolicy(RemovalPolicy.RETAIN);
  }
}
