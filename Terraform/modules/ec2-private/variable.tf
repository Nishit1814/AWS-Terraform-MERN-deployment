variable "environment" {
  type        = string
  default = "dev"
  description = "The deployment environment (e.g., dev, prod)"
}

variable "vpc_id" {
  type        = string
  description = "The ID of the VPC where the security group will be created"
}

variable "subnet_id" {
  type        = string
  description = "The Subnet ID where the EC2 instance will live"
}

variable "ami_id" {
  type        = string
  description = "The Amazon Machine Image ID (e.g., Ubuntu 24.04/22.04 LTS)"
}

variable "instance_type" {
  type        = string # Free tier eligible
  description = "The size of the EC2 instance"
}

variable "key_name" {
  type        = string
  description = "The name of your AWS SSH Key Pair to login to the server"
}

variable "volume-size" {
  type = number
  description = "size you want for application"
}

variable "volume-type" {
  type = string
  description = "volume type is gp3 prefer"
}
