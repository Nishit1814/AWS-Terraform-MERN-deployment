Automated AWS Infrastructure & MERN Stack Deployment
This project demonstrates a complete, end-to-end DevOps pipeline for provisioning secure cloud infrastructure and deploying a containerized full-stack application. It integrates Infrastructure as Code (IaC), configuration management, containerization, and reverse proxying into a seamless workflow.

Overview
The core objective is to automate the deployment of a MERN (MongoDB, Express, React, Node.js) stack application onto AWS, moving away from manual server configurations. This approach ensures reproducibility, scalability, and security best practices.

Architecture Diagram
The diagram below illustrates the comprehensive infrastructure and deployment architecture.

Key Features
Infrastructure as Code (IaC): Utilizes Terraform to define and provision all AWS resources.

Secure Networking: Deploys a custom VPC with public and private subnets, security groups, and key pairs.

Remote State Management: Configures Terraform to store the state file (tfstate) in a remote S3 bucket, with state locking handled by DynamoDB to prevent concurrent modifications.

Automated Configuration: Uses Ansible playbooks (or equivalent scripts) to install and configure essential software on the EC2 instance, including Nginx, Git, Docker, and Docker Compose.

Containerization: Employs Docker to containerize the MERN stack components and Docker Compose to orchestrate their deployment and connectivity.

Reverse Proxy: Configures Nginx on the EC2 instance to act as a reverse proxy, securely routing incoming traffic to the React frontend and Node.js backend.

Prerequisites
Before deploying, ensure you have the following installed locally:

AWS CLI

Terraform

Docker and Docker Compose

A Git client

An AWS account with appropriate permissions.

Deployment Steps

1. Provision Infrastructure with Terraform
Navigate to the Terraform/ directory.

Initialize Terraform (this will configure the S3 backend and DynamoDB locking):

Bash
terraform init

Review the execution plan:

Bash
terraform plan

Apply the changes to create the infrastructure:

Bash
terraform apply

2. Configure Server and Deploy Application
SSH into the newly created EC2 instance using the key pair.

Install required software (this can be automated with an Ansible playbook):

Bash
# (Example steps if done manually)
sudo apt update
sudo apt install nginx git docker.io docker-compose

Clone the application repository.

Navigate to the project root (containing the docker-compose.yml file).

Start the MERN stack application:

Bash
docker-compose up -d

Configure Nginx to act as a reverse proxy, directing traffic to the frontend and backend containers.
