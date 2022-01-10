import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const role = new aws.iam.Role("security-lambda-header-role", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: aws.iam.Principals.LambdaPrincipal,
        Effect: "Allow",
      },
      {
        Action: "sts:AssumeRole",
        Principal: aws.iam.Principals.EdgeLambdaPrincipal,
        Effect: "Allow",
      },
    ],
  },
});

const rolePolicy = new aws.iam.RolePolicyAttachment(
  `security-lambda-header-role-policy-attachment`,
  {
    role,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
  }
);

// Some resources must be provisioned in us-east-1, such as Lambda@Edge.
const awsUsEast1 = new aws.Provider("us-east-1", { region: "us-east-1" });

const lambda = new aws.lambda.CallbackFunction(
  "security-lambda-header-function",
  {
    publish: true,
    role,
    timeout: 5,
    callback: async (event: any) => {
      //Get contents of response
      const response = event.Records[0].cf.response;
      const headers = response.headers;
      const defaultTimeToLive = 60 * 60 * 24 * 365; // 60 * 60 * 24 * 365 = 1 year
      headers["strict-transport-security"] = [
        {
          key: "Strict-Transport-Security",
          value: `max-age=${defaultTimeToLive}; includeSubdomains; preload`,
        },
      ];
      // For more information see this: https://content-security-policy.com/
      headers["x-frame-options"] = [{ key: "X-Frame-Options", value: "DENY" }];
      headers["referrer-policy"] = [
        { key: "Referrer-Policy", value: "same-origin" },
      ];
      // By default, Create React App will embed an inline script into index.html during the production build. If we dont want script tags with React, read [this](https://medium.com/@nrshahri/csp-cra-324dd83fe5ff)
      headers["x-content-type-options"] = [
        { key: "X-Content-Type-Options", value: "nosniff" },
      ];
      headers["x-xss-protection"] = [
        { key: "X-XSS-Protection", value: "1; mode=block" },
      ];
      // Example: To allow an iframe to be loaded from https://*.different.com.au
      headers["content-security-policy"] = [
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'none'; manifest-src 'self'; frame-src https://*.different.com.au; script-src 'self' 'unsafe-inline'; connect-src 'self' ; img-src 'self'; style-src 'self';base-uri 'self';form-action 'self'",
        },
      ];
      // Check here to see browser compatibility https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#browser_compatibility
      headers["permissions-policy"] = [
        {
          key: "Permissions-Policy",
          value: "microphone 'none'; geolocation 'none'",
        },
      ];
    return response;
    },
  },
  { provider: awsUsEast1 }
);

// Not using qualifiedArn here due to some bugs around sometimes returning $LATEST
export default pulumi.interpolate`${lambda.arn}:${lambda.version}`;
