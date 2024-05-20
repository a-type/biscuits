import { RemovalPolicy } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class S3Bucket extends Bucket {
  constructor(scope: Construct, appId: string) {
    super(scope, `${appId}_bucket`, {
      // websiteIndexDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: `${appId}.biscuits.club`,
      // publicReadAccess: false,
    });
  }
}
