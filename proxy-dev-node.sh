ssh -L 4444:127.0.0.1:4444 -J jump@bastion-01.aws-us-east-1.ops.rskcomputing.net ubuntu@mkt-cache-01.aws-us-west-2.dev.marketplace.rifcomputing.net
# ssh -L 4445:127.0.0.1:4444 -J jump@bastion-01.aws-us-east-1.ops.rskcomputing.net ubuntu@mkt-pinner-01.aws-us-west-2.dev.marketplace.rifcomputing.net
# ssh -L 4446:127.0.0.1:4444 -J jump@bastion-01.aws-us-east-1.ops.rskcomputing.net ubuntu@mkt-pinner-02.aws-us-west-2.dev.marketplace.rifcomputing.net
# ssh -L 4447:127.0.0.1:4444 -J jump@bastion-01.aws-us-east-1.ops.rskcomputing.net ubuntu@mkt-notifier-01.aws-us-west-2.dev.marketplace.rifcomputing.net
# ssh -J jump@bastion-01.aws-us-east-1.ops.rskcomputing.net ubuntu@mkt-upload-01.aws-us-west-2.dev.marketplace.rifcomputing.net # NO REGTEST NODE RUNNING