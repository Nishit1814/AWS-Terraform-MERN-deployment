output "bucket_id" {
  value       = aws_s3_bucket.mern-db.bucket
  description = "The actual name of the S3 bucket"
}
