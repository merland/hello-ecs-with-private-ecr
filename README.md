# Hello ECS for private ECR repos

This minimal project is based on the following CDK v2 tutorial:

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-ecs-web-server-cdk.html

The tutorial is a minimal example of how to create an ECS Fargate Stack and deploy a docker image, using CDK.
It is a good tutorial, but it deals only with a *public* docker image. This code shows how to deploy a docker
image from a *private* ECR repository to Fargate.

`lib/hello-ecs-stack.ts` is the interesting part.