import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface CdkStackProps extends cdk.StackProps {
  // add props here
  appId: string;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // create an s3 bucket

    const bucket = new cdk.aws_s3.Bucket(this, `${props.appId}_bucket`, {
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: `${props.appId}.biscuits.club`,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });

    // create a TLS certificate

    const certificate = new cdk.aws_certificatemanager.Certificate(
      this,
      `${props.appId}_certificate`,
      {
        domainName: `${props.appId}.biscuits.club`,
      },
    );

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
    });

    // create an origin access identity

    const originAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      `${props.appId}_origin_access_identity`,
    );

    new cdk.CfnOutput(this, 'OriginAccessIdentityId', {
      value: originAccessIdentity.originAccessIdentityId,
    });

    // create a cloudfront distribution

    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      `${props.appId}_distribution`,
      {
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        domainNames: [`${props.appId}.biscuits.club`],
        certificate: certificate,
      },
    );

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName,
    });

    // configure the bucket policy

    bucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects('*')],
        principals: [
          new cdk.aws_iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    );
  }
}
