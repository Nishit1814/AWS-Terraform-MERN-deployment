terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.52.0"
    }
  }
backend "s3" {
  bucket= "my-state-bucket-1411"
  key= "terraform.tfstate"
  region = "ap-south-1"
  dynamodb_table= "TF-state-Table"
}  
}
provider "aws" {
    region = "ap-south-1"
}
