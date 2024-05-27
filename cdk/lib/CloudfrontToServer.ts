import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export class CloudfrontToServer extends cloudfront.Distribution {
  constructor(
    scope: Construct,
    server: {
      origin: string;
      path: string;
    },
    certificate: Certificate,
    subdomain: string,
  ) {
    super(scope, `${subdomain}_distribution`, {
      defaultBehavior: {
        origin: new HttpOrigin(server.origin, {
          originPath: server.path,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
      },
      domainNames: [`${subdomain}.biscuits.club`],
      certificate,
      // defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      comment: `${subdomain} app distribution`,
    });
  }
}
