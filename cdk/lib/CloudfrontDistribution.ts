import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CloudFrontDistribution extends cloudfront.Distribution {
  constructor(
    scope: Construct,
    bucket: Bucket,
    certificate: Certificate,
    appId: string,
  ) {
    super(scope, `${appId}_distribution`, {
      defaultBehavior: {
        origin: new S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      domainNames: [`${appId}.biscuits.club`],
      certificate,
      // defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      comment: `${appId} app distribution`,
    });

    const oac = new cloudfront.CfnOriginAccessControl(this, `${appId}_oac`, {
      originAccessControlConfig: {
        name: `${appId}.biscuits.club-oac`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    const allowOriginAccessIdentityPolicy = new PolicyStatement({
      actions: ['s3:GetObject'],
      principals: [new ServicePrincipal(this.distributionId)],
      effect: Effect.ALLOW,
      resources: [oac.attrId],
    });

    const allowCloudFrontReadOnlyPolicy = new PolicyStatement({
      actions: ['s3:GetObject'],
      principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
      effect: Effect.ALLOW,
      conditions: {
        StringEquals: {
          'AWS:SourceArn': this.distributionId,
        },
      },
    });

    bucket.addToResourcePolicy(allowCloudFrontReadOnlyPolicy);
    bucket.addToResourcePolicy(allowOriginAccessIdentityPolicy);

    const cfnDistribution = this.node
      .defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.getAtt('Id'),
    );
    // remove origin access identity
    cfnDistribution.addPropertyDeletionOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
    );
  }
}
