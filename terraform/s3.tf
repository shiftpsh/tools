data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "tools" {
  bucket = "tools.shiftpsh.com"

  tags = {
    Name = "tools.shiftpsh.com"
  }
}

resource "aws_s3_bucket_policy" "tools_policy" {
  bucket = aws_s3_bucket.tools.id

  policy = jsonencode({
    Version = "2008-10-17",
    Id      = "PolicyForCloudFrontPrivateContent",
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.tools.arn}/*",
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${aws_cloudfront_distribution.tools.id}"
          }
        }
      },
      {
        Sid       = "AllowOnlyHTTPS",
        Effect    = "Deny",
        Principal = "*",
        Action    = "s3:*",
        Resource = [
          "${aws_s3_bucket.tools.arn}",
          "${aws_s3_bucket.tools.arn}/*"
        ],
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}
