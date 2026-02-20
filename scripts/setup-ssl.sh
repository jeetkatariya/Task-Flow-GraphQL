#!/bin/bash

# SSL Setup Script using Let's Encrypt
# This script sets up SSL certificates for the domain

set -e

DOMAIN="${1:-your-domain.com}"
EMAIL="${2:-your-email@example.com}"

if [ "$DOMAIN" == "your-domain.com" ]; then
    echo "❌ Please provide your domain name as the first argument"
    echo "Usage: ./setup-ssl.sh your-domain.com your-email@example.com"
    exit 1
fi

echo "🔒 Setting up SSL for $DOMAIN..."

# Install Certbot
echo "📦 Installing Certbot..."
sudo yum install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
echo "⏸️  Stopping Nginx..."
sudo systemctl stop nginx

# Obtain certificate
echo "📜 Obtaining SSL certificate..."
sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Update Nginx configuration with domain name
echo "📝 Updating Nginx configuration..."
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/conf.d/graphql-demo.conf

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Start Nginx
echo "▶️  Starting Nginx..."
sudo systemctl start nginx

# Set up auto-renewal
echo "🔄 Setting up auto-renewal..."
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer

echo "✅ SSL setup complete!"
echo ""
echo "Your site should now be accessible at https://$DOMAIN"
echo "Certificate will auto-renew before expiration"
