#!/bin/bash

# Database Setup Script
# This script helps set up the PostgreSQL database for the GraphQL demo

set -e

echo "🚀 Setting up GraphQL Demo Database..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ docker-compose is not available"
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
$COMPOSE_CMD up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker exec graphql-demo-db pg_isready -U postgres &> /dev/null; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo "   Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ PostgreSQL failed to start"
    exit 1
fi

# Check if database already exists
if docker exec graphql-demo-db psql -U postgres -lqt | cut -d \| -f 1 | grep -qw graphql_demo; then
    echo "📊 Database 'graphql_demo' already exists"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        docker exec graphql-demo-db psql -U postgres -c "DROP DATABASE IF EXISTS graphql_demo;"
        docker exec graphql-demo-db psql -U postgres -c "CREATE DATABASE graphql_demo;"
    fi
else
    echo "📊 Creating database 'graphql_demo'..."
    docker exec graphql-demo-db psql -U postgres -c "CREATE DATABASE graphql_demo;"
fi

# Run DDL scripts
echo "📝 Running DDL scripts..."

# Check if scripts directory exists
if [ -f "ddl/01_create_schema.sql" ]; then
    echo "   Running 01_create_schema.sql..."
    docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/01_create_schema.sql
    
    if [ -f "ddl/02_seed_data.sql" ]; then
        echo "   Running 02_seed_data.sql..."
        docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/02_seed_data.sql
    fi
    
    echo "✅ Database setup complete!"
else
    echo "⚠️  DDL scripts not found in ddl/ directory"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=graphql_demo
DB_SSL=false

# Application Configuration
PORT=3000
NODE_ENV=development
EOF
    echo "✅ Created .env file with default values"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🎉 Setup complete! You can now start the application with:"
echo "   npm run start:dev"
echo ""
echo "The GraphQL playground will be available at: http://localhost:3000/graphql"
