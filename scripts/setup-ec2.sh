#!/bin/bash

# EC2 Setup Script
# This script sets up the EC2 instance for running the GraphQL demo application

set -e

echo "🚀 Setting up EC2 instance for GraphQL Demo..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo yum install -y nginx

# Install PostgreSQL client (for running migrations)
echo "📦 Installing PostgreSQL client..."
sudo yum install -y postgresql15

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/graphql-demo
sudo chown -R ec2-user:ec2-user /var/www/graphql-demo

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p /var/www/graphql-demo/logs

# Create PM2 startup script
echo "📝 Setting up PM2 startup..."
pm2 startup systemd -u ec2-user --hp /home/ec2-user
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "✅ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /var/www/graphql-demo"
echo "2. Install dependencies: cd /var/www/graphql-demo && npm install"
echo "3. Build the application: npm run build"
echo "4. Configure environment variables in .env file"
echo "5. Start the application with PM2: pm2 start ecosystem.config.js"
echo "6. Configure Nginx (see nginx.conf)"
echo "7. Set up SSL with Let's Encrypt"
