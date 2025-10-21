resource "aws_cloudfront_distribution" "tools" {
  origin {
    domain_name              = aws_s3_bucket.tools.bucket_regional_domain_name
    origin_id                = "toolsS3Origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.tools.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "tools.shiftpsh.com CloudFront Distribution"
  default_root_object = "index.html"

  aliases = ["tools.shiftpsh.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "toolsS3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_router.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:163332979109:certificate/4c3ab814-31e9-4ee9-9cf7-b86a2dde1121"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }

  tags = {
    Name = "tools.shiftpsh.com"
  }
}

resource "aws_cloudfront_origin_access_control" "tools" {
  name                              = "tools-oac"
  description                       = "Origin Access Control for tools.shiftpsh.com"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
  origin_access_control_origin_type = "s3"
}

resource "aws_cloudfront_function" "spa_router" {
  name    = "tools-spa-router"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite non-asset requests to /index.html for React SPA"

  publish = true

  code = <<EOT
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // If the URI starts with /assets/ or ends with a file extension, pass through
  if (uri.startsWith("/assets/") || uri.match(/\.[a-zA-Z0-9]+$/)) {
    return request;
  }

  // Otherwise, rewrite to index.html
  request.uri = "/index.html";
  return request;
}
EOT
}
