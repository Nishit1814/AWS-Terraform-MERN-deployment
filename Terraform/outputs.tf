output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "The ID of the VPC created for your MERN stack application."
}

output "public_subnet_id" {
  value       = module.vpc.public_subnet_id
  description = "The ID of the subnet where your EC2 instance is hosted."
}

output "private_subnet_id" {
    value = module.vpc.private_subnet_id
    description = "this give the id of private_subnet"
}

output "s3_bucket_name" {
  value       = module.s3.bucket_id
  description = "The exact name of your S3 bucket. Add this to your Node.js backend .env file."
}

output "dynamodb_table_name" {
  value       = module.dynamodb.table_name
  description = "The name of your DynamoDB table. Add this to your Node.js backend .env file."
}

output "ec2_public_ip" {
  value       = module.ec2-public.ec2_public_ip
  description = "The public IP address of your EC2 server."
}

