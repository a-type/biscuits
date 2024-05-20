import * as cdk from 'aws-cdk-lib';
import { CfnDistribution, PriceClass } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { S3Bucket } from './S3Bucket';
import { CloudFrontDistribution } from './CloudfrontDistribution';
import { TLSCertificate } from './TLSCertificate';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';

export interface CdkStackProps extends cdk.StackProps {
  // add props here
  appId: string;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // create a TLS certificate

    const certificate = new TLSCertificate(this, props.appId);

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
    });

    // create a cloudfront distribution

    const distribution = new CloudFrontToS3(
      this,
      `${props.appId}_distribution`,
      {
        bucketProps: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
          versioned: false,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          bucketName: `${props.appId}.biscuits.club`,
          lifecycleRules: [],
        },
        cloudFrontDistributionProps: {
          certificate,
          domainNames: [`${props.appId}.biscuits.club`],
          priceClass: PriceClass.PRICE_CLASS_100,
          comment: `${props.appId} app distribution`,
        },
        logS3AccessLogs: false,
      },
    );

    new cdk.CfnOutput(this, 'BucketName', {
      value: distribution.s3Bucket!.bucketName,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.cloudFrontWebDistribution.distributionId,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.cloudFrontWebDistribution.distributionDomainName,
    });
  }
}
