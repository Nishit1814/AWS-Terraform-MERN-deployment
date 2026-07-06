variable "environment" {
  type        = string
  description = "The deployment environment"
}

variable "vpc_cidr" {
  type        = string
  description = "The IP range for the entire VPC"
}

variable "public_subnet_cidr" {
  type        = string
  description = "The IP range for the public subnet"
}

variable "private_subnet_cidr" {
    type = string
    description = "The IP range for the private subnet"
  }

variable "availability_zone" {
  type        = string
  description = "The AWS availability zone to deploy the subnet into"
}

variable "vpc_id" {
  type = string
  default = "aws_vpc.main.id"
  
}
