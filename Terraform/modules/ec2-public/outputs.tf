output "ec2_public_ip" {
  value       = aws_instance.ec2_server.public_ip
  description = "The public IP address of the MERN server"
}
