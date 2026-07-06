output "ec2_public_ip" {
  value       = aws_instance.ec2_server1.private_ip
  description = "The public IP address of the MERN server"
}
