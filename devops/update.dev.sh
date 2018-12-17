set -e
AWS_PROFILE="informa"
aws --profile $AWS_PROFILE --region us-east-1 cloudformation update-stack --stack-name dev-costtrax-ui --parameters "file://dev.params.json" --template-url "https://s3.amazonaws.com/devops-610665873581-us-east-1/infrastructure/website.yaml" --capabilities CAPABILITY_NAMED_IAM --notification-arns arn:aws:sns:us-east-1:610665873581:informa-devops-cloudformation-us-east-1