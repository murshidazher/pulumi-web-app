# [pulumi-web-app](https://github.com/murshidazher/pulumi-web-app)

> 🐛 A Pulumi infrastructure as code demonstration with react web app.

- Publish a react web application in AWS.
- Securing the response headers with `Lambda@Edge`, to check your application header [here](https://securityheaders.com/) and more information on [how pulumi uses Lambda@Edge to solve security header issues](https://github.com/pulumi/pulumitv/tree/master/modern-infrastructure-wednesday/2020-06-24)
  - In essence, `Lambda@Edge` is used to intercept the response back to the user and add the required headers to secure the website.

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

TBA

```sh
git clone git@github.com:murshidazher/pulumi-web-app.git
npm run install
npm run deploy
```

```sh
AWS_PROFILE=<profile> pulumi console #  for more information of stack
```

To see the outputs,

```sh
AWS_PROFILE=<profile> pulumi stack output
AWS_PROFILE=<profile> aws s3 ls $(pulumi stack output s3Bucket)
```

To destroy the whole stack,

```sh
AWS_PROFILE=<profile> pulumi destroy
```

To destroy the staging,

```sh
AWS_PROFILE=<profile> pulumi destroy -s <stagename> --force
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

## LICENSE

[MIT](./LICENSE) &copy; Murshid Azher 2022.
