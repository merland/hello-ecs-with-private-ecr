import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as console from 'console';
import {Construct} from 'constructs';
import {EcrImage} from 'aws-cdk-lib/aws-ecs';
import {Repository} from "aws-cdk-lib/aws-ecr";

/**
 See README.md
 Make sure that the environment variables below are set.
 **/

const REGION = process.env.CDK_DEFAULT_REGION;   // e.g. us-east-1
const ACCOUNT = process.env.CDK_DEFAULT_ACCOUNT; // e.g. 123456789012
const ECR_REPO_NAME = process.env.ECR_REPO_NAME; // e.g. "mycompany/myapp"

const privateDockerRepoARN = `arn:aws:ecr:${REGION}:${ACCOUNT}:repository/${ECR_REPO_NAME}`;
console.log("-------> Private Docker repo ARN: " + privateDockerRepoARN);

export class HelloEcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Reuse the default VPC of the current account. This is recommended by AWS for simple use cases.
        // https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html
        let vpc = ec2.Vpc.fromLookup(this, 'TheVPC', {
            isDefault: true,
        });

        let cluster = new ecs.Cluster(this, 'TheCluster', {
            vpc: vpc,
        })

        const repo = Repository.fromRepositoryArn(this, "TheEcrRepo", privateDockerRepoARN);
        let myEcrImage = EcrImage.fromEcrRepository(repo, 'latest')

        new ecsp.ApplicationLoadBalancedFargateService(this, 'TheFargateService', {
            cluster: cluster,
            assignPublicIp: true,
            desiredCount: 2,
            memoryLimitMiB: 512,
            cpu: 256,
            taskImageOptions: {
                image: myEcrImage,
                containerName: 'TheHelloContainer',
                containerPort: 80,
                enableLogging: true,
            },
            taskSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
        })
    }
}