# [pulumi-web-app](https://github.com/murshidazher/pulumi-web-app)

> 🐛 A pulumi infrastructure as code demonstration with react web app

- Publish a react web application in AWS.

## Before You Begin

> :bulb: More information on pulumi [setup](https://www.pulumi.com/docs/get-started/aws/begin/)

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
cd pulumi && npm install
cd ../react-app && npm install
```

## Development

For getting development from scratch,

```sh
mkdir pulumi && AWS_PROFILE=<profile> pulumi new aws-typescript # create a pulumi account
cd .. && npx create-react-app react-app
cd react-app && yarn build
```

## LICENSE

[MIT](./LICENSE) &copy; Murshid Azher 2022.
