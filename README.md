# [pulumi-web-app](https://github.com/murshidazher/pulumi-web-app)

> 🐛 A Pulumi infrastructure as code demonstration with react web app.

- 🚀 Publish a react web application in AWS.
- 🛼 All automated pipelines are configured using [Github Workflow](./.github/workflows/)
- 🔒 Securing the response headers with `Lambda@Edge`, to check your application header [here](https://securityheaders.com/).
  - More information on [How Pulumi uses Lambda@Edge to solve security header issues](https://github.com/pulumi/pulumitv/tree/master/modern-infrastructure-wednesday/2020-06-24).
  - In essence, some security header would be missed for example `Strict-Transport-Security`. `Lambda@Edge` is used to intercept the response back to the user and add the required headers to secure the website.

## Before You Begin

> :bulb: More information on Pulumi [setup](https://www.pulumi.com/docs/get-started/aws/begin/)

Before we get started using this repository, let’s run through a few quick steps to ensure our environment is setup correctly.

```sh
# macOS
brew install pulumi
# windows
choco install pulumi
# linux
curl -fsSL https://get.pulumi.com | sh
```

Install [nodejs](https://nodejs.org/en/download/)

Setup your aws credentials,

```sh
export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```

## Installation & Usage

> If this your first time using Pulumi then you might be create an account in `Pulumi` where it manages your state files.

Clone the repository, install the dependencies and deploy,

```sh
git clone git@github.com:murshidazher/pulumi-web-app.git
npm run install
```

:rocket: To deploy the whole infrastructure,

```sh
npm run deploy
```

## Destroying / Teardown

:boom: To destroy the whole stack,

```sh
AWS_PROFILE=<profile> pulumi destroy
```

:boom: To destroy the staging,

```sh
AWS_PROFILE=<profile> pulumi destroy -s <stagename> --force
```

## Other Commands

To see the console,

```sh
AWS_PROFILE=<profile> pulumi console #  for more information of stack
```

To see the outputs,

```sh
AWS_PROFILE=<profile> pulumi stack output
AWS_PROFILE=<profile> aws s3 ls $(pulumi stack output s3Bucket)
```

## Development

For getting development from scratch,

```sh
mkdir pulumi && AWS_PROFILE=<profile> pulumi new aws-typescript # create a pulumi account
cd .. && npx create-react-app react-app
cd react-app && yarn build
```

To manually put files to the `s3` bucket,

```sh
AWS_PROFILE=<profile> aws s3 sync ./build s3://{your_s3_bucket_name} --delete
```

To invalidate caches,

```sh
aws cloudfront create-invalidation --distribution-id {your_distribution_id} --paths '/*'
```

## LICENSE

[MIT](./LICENSE) &copy; Murshid Azher 2022.
