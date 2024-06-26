import * as cdk from 'aws-cdk-lib';
import { PriceClass } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { TLSCertificate } from './TLSCertificate';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { addRepositoryVariable } from './github';
import { createDnsRecord } from './porkbun';
import { waitForCertificateValidation } from './aws';

export interface AppStackProps extends cdk.StackProps {
  // add props here
  appId: string;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // create a TLS certificate

    const certificate = new TLSCertificate(this, props.appId);

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
    });

    // create a cloudfront distribution

    const domains = [`${props.appId}.biscuits.club`];
    if (props.appId === 'www') {
      domains.push('biscuits.club');
    }
    const distribution = new CloudFrontToS3(
      this,
      `${props.appId}_distribution`,
      {
        bucketProps: {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
          versioned: false,
          bucketName: `${props.appId}.biscuits.club`,
          lifecycleRules: [],
        },
        cloudFrontDistributionProps: {
          certificate,
          domainNames: domains,
          priceClass: PriceClass.PRICE_CLASS_100,
          comment: `${props.appId} app distribution`,
          defaultRootObject: 'index.html',
          errorResponses: [
            {
              httpStatus: 403,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            },
            {
              httpStatus: 404,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            },
          ],
        },
        logS3AccessLogs: false,
        insertHttpSecurityHeaders: false,
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
