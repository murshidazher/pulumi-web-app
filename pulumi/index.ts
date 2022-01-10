import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as mime from "mime";
import * as fs from "fs";
import * as path from "path";
import { getRelativeFilePaths } from "./utils";
import lambdaArn from "./securityHeaderEdgeLambda";


const uuid = "0YzP7fxvCTKFZRz";

// Create an Private S3 bucket
const bucketName = `pulumi-webapp-${uuid}`;
const bucket = new aws.s3.Bucket(bucketName, {
  website: {
    errorDocument: "index.html",
    indexDocument: "index.html",
  },
});

// Put the files to directory
let siteDir = path.join(__dirname, "..","react-app", "build");


// Put all the static files to the bucket
const staticFilePaths = getRelativeFilePaths(siteDir);

staticFilePaths.forEach((blob: string) => {
  let filePath = path.join(siteDir, blob);
  let file = path.parse(blob).base
  let object = new aws.s3.BucketObject(blob, {
    bucket: bucket.bucket,
    // use FileAsset to point to a file
    source: new pulumi.asset.FileAsset(filePath),
    // set the MIME type of the file
    contentType: mime.getType(filePath) || undefined,
  });
});

// Use OriginAccessIdentity to allow cloudfront to read from S3
const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  `pulumi-origin-access-identity-${uuid}`,
  {
    comment: `Access Identity for ${bucketName}`,
  }
);

// Create public S3 read policy
function publicReadPolicyForBucket(
  _bucketName: string,
  _originAccessArn: string
) {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "1",
        Effect: "Allow",
        Principal: {
          AWS: [`${_originAccessArn}`],
        },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${_bucketName}/*`],
      },
    ],
  });
}

// Associate the bucket policy with the cloudfront
const bucketPolicy = new aws.s3.BucketPolicy(`${bucketName}-policy`, {
  bucket: bucket.bucket,
  policy: pulumi
    .all([bucket.bucket, originAccessIdentity.iamArn])
    .apply(([_bucketName, originAccessArn]) =>
      publicReadPolicyForBucket(_bucketName, originAccessArn)
    ),
});

/**
 * Setting up the cloudfront distribution
 *
 * Links:
 *  [CloudFront Pulumi](https://tinyurl.com/ycx6np5v)
 *  [Defining CORS and Origins](https://tinyurl.com/2p8hcwre)
 */
const cloudFrontDistribution = new aws.cloudfront.Distribution(
  `pulumi-cloudfront-${uuid}`,
  {
    origins: [
      {
        domainName: bucket.bucketRegionalDomainName,
        originId: bucket.arn,
        s3OriginConfig: {
          originAccessIdentity:
            originAccessIdentity.cloudfrontAccessIdentityPath,
        },
      },
    ],
    customErrorResponses: [
      {
        errorCachingMinTtl: 0,
        errorCode: 404,
        responseCode: 200,
        responsePagePath: "/index.html",
      },
      {
        errorCachingMinTtl: 0,
        errorCode: 403,
        responseCode: 200,
        responsePagePath: "/index.html",
      },
    ],
    // States which origin to fetch from and TTL
    defaultCacheBehavior: {
      allowedMethods: ["GET", "HEAD"],
      cachedMethods: ["GET", "HEAD"],
      targetOriginId: bucket.arn,
      viewerProtocolPolicy: "redirect-to-https",
      forwardedValues: {
        cookies: {
          forward: "none",
        },
        queryString: false,
      },
      minTtl: 0,
      defaultTtl: 10, // 3600s
      maxTtl: 10, // 86400s
      lambdaFunctionAssociations: [
        {
          eventType: "viewer-response",
          includeBody: false,
          lambdaArn,
        },
      ]
    },
    /**
     * For more Granular Caching using Path Patterns
     *
     * Ex: this can be used to static contents and more
     */

    // orderedCacheBehaviors: [
    //   {
    //     pathPattern: "content/immutable/*",
    //     allowedMethods: ["GET", "HEAD"],
    //     cachedMethods: ["GET", "HEAD"],
    //     targetOriginId: someOtherOriginId,
    //     forwardedValues: {
    //       queryString: false,
    //       cookies: {
    //         forward: "none",
    //       },
    //     },
    //     minTtl: 0,
    //     defaultTtl: 86400,
    //     maxTtl: 31536000,
    //     viewerProtocolPolicy: "redirect-to-https",
    //   },
    // ],

    // The SSL Certificate
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },

    // TO SPECIFY YOUR OWN CERTIFICATE

    // viewerCertificate: {
    //   acmCertificateArn: {your_ACM_ARN},
    //   cloudfrontDefaultCertificate: false,
    //   minimumProtocolVersion: 'TLSv1.2_2019',
    //   sslSupportMethod: 'sni-only',
    // },

    restrictions: {
      geoRestriction: {
        locations: [],
        restrictionType: "none",
      },
    },
    defaultRootObject: "index.html",
    httpVersion: "http2",
    isIpv6Enabled: true,
    priceClass: "PriceClass_All",
    waitForDeployment: true,
    enabled: true,
    retainOnDelete: false,
  },
  {
    protect: true,
  }
);


// Exports
export const s3Bucket = bucket.bucket;
export const cfDomainName = cloudFrontDistribution.domainName;
export const cfDistributionArn = cloudFrontDistribution.arn;
export const cfDistributionId = cloudFrontDistribution.id;



