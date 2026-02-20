#!/bin/bash

# Deployment Script
# This script deploys the application to EC2

set -e

# Configuration
EC2_HOST="${EC2_HOST:-your-ec2-host}"
EC2_USER="${EC2_USER:-ec2-user}"
APP_DIR="/var/www/graphql-demo"
BRANCH="${BRANCH:-main}"

echo "🚀 Deploying to EC2..."

# Build the application locally
echo "📦 Building application..."
npm run build

# Copy files to EC2
echo "📤 Copying files to EC2..."
rsync -avz --exclude 'node_modules' --exclude '.git' \
  --exclude 'frontend/node_modules' --exclude 'frontend/dist' \
  ./ ${EC2_USER}@${EC2_HOST}:${APP_DIR}/

# SSH into EC2 and run deployment commands
echo "🔧 Running deployment commands on EC2..."
ssh ${EC2_USER}@${EC2_HOST} << EOF
  cd ${APP_DIR}
  
  # Install backend dependencies
  echo "📦 Installing backend dependencies..."
  npm install --production
  
  # Install frontend dependencies and build
  echo "📦 Building frontend..."
  cd frontend
  npm install
  npm run build
  cd ..
  
  # Run database migrations (if needed)
  # psql -h \$DB_HOST -U \$DB_USERNAME -d \$DB_NAME -f ddl/04_add_password_column.sql
  
  # Restart PM2
  echo "🔄 Restarting application..."
  pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
  
  # Reload Nginx
  echo "🔄 Reloading Nginx..."
  sudo nginx -t && sudo systemctl reload nginx
  
  echo "✅ Deployment complete!"
EOF

echo "🎉 Deployment finished!"
