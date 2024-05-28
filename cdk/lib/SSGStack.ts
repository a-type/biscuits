import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TLSCertificate } from './TLSCertificate';
import { CloudfrontToServer } from './CloudfrontToServer';

export interface SSGStackProps extends StackProps {
  subdomain: string;
  renderPath: string;
}

export class SSGStack extends Stack {
  constructor(scope: Construct, id: string, props: SSGStackProps) {
    super(scope, id, props);

    const certificate = new TLSCertificate(this, props.subdomain);

    new CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
    });

    const distribution = new CloudfrontToServer(
      this,
      {
        origin: `api.biscuits.club`,
        path: props.renderPath,
      },
      certificate,
      props.subdomain,
    );

    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });
  }
}
