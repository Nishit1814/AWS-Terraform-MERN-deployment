module "vpc" {
    source = "./modules/vpc"
    environment = "dev"
    vpc_cidr = "10.0.0.0/16"
    public_subnet_cidr = "10.0.1.0/24"
    private_subnet_cidr = "10.0.2.0/24"
    availability_zone = "ap-south-1a"
    
}

module "s3" {
    source = "./modules/s3"
    environment = "dev"
}

module "ec2-public" {
    source = "./modules/ec2-public"
    key_name = "cloud"
    vpc_id = module.vpc.vpc_id
    instance_type = "c7i-flex.large"
    ami_id = "ami-01a00762f46d584a1"
    subnet_id = module.vpc.public_subnet_id
    volume-size = 25 
    volume-type = "gp3"
    
}
module "ec2-private" {
    source = "./modules/ec2-private"
    key_name = "cloud"
    vpc_id = module.vpc.vpc_id
    instance_type = "c7i-flex.large"
    ami_id = "ami-01a00762f46d584a1"
    subnet_id = module.vpc.private_subnet_id
    volume-size = 15 
    volume-type = "gp3"
    
}

module "dynamodb" {
    source = "./modules/dynamodb"
    table_name = "mern-db-table"
    hash_key_name = "userID"
}
