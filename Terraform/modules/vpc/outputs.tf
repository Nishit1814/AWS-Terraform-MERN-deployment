output "vpc_id" {
  value       = aws_vpc.my-vpc.id
  description = "The ID of the created VPC"
}

output "public_subnet_id" {
  value       = aws_subnet.public.id
  description = "The ID of the public subnet"
}

output "private_subnet_id" {
    value = aws_subnet.private.id
    description = "the id of private subnet"
  
}
