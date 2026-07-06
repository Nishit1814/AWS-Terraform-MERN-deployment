# 1. Create the VPC
resource "aws_vpc" "my-vpc" {
  cidr_block           = var.vpc_cidr
  

  tags = {
    Name        = "mern-vpc"
    Environment = var.environment
  }
}

# 2. Create an Internet Gateway (Allows traffic to/from the internet)
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.my-vpc.id

  tags = {
    Name        = "mern-igw"
    Environment = var.environment
  }
}

# 3. Create a Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.my-vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone


  tags = {
    Name        = "mern-public-subnet"
    Environment = var.environment
  }
}

resource "aws_subnet" "private" {
    vpc_id = aws_vpc.my-vpc.id
    cidr_block =  var.private_subnet_cidr
    availability_zone = var.availability_zone
  
  tags = {
    Name = "mern-private-subnet"
    Environment = var.environment
  }
}

resource "aws_route_table" "private_rt" {
    vpc_id = aws_vpc.my-vpc.id

}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.my-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name        = "public-rt"
    Environment = var.environment
  }
}

# 5. Associate the Route Table with our Public Subnet
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "private_accoc" {
    subnet_id = aws_subnet.private.id
    route_table_id = aws_route_table.private_rt.id
}
