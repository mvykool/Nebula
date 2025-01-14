{ pkgs ? import <nixpkgs> {} }:

// ocmmnet
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.dockerTools
    pkgs.docker
    ];

  shellHook = ''
    echo "Welcome to nebula-local env"

    # --- Client setup ---
    # Check if the client dependencies are installed
    if [ ! -d "client/nebula/node_modules" ]; then
      echo "Installing client dependencies..."
      cd client/nebula && npm install  # Or use yarn if you prefer
    fi

    # --- Server setup ---
    # Check if the .uploads folder exists, create it if not
    if [ ! -d "server/.uploads" ]; then
      echo "Creating .uploads folder in the server directory..."
      mkdir -p server/.uploads
    fi

    # Check if the .env file exists in the server directory, create it if not
    if [ ! -f "server/.env" ]; then
      echo "Creating .env file for NestJS backend..."
      cat <<EOF > server/.env
# Sample environment variables for NestJS backend
DB_HOST="localhost"
DB_PORT="5432"
DB_USERNAME="default_username"
DB_NAME="default_name"
DB_PASSWORD="default_password"
SECRET="default_secret"
SECRET_REFRESH="default_refresh"
EOF

fi

    # --- Docker setup ---
    # Check if Docker is running, if not, try to start it
    if ! docker info > /dev/null 2>&1; then
      echo "Docker is not running, attempting to start Docker..."
      sudo systemctl start docker
    fi

    # Start the Docker container for Postgres (via docker-compose)
    if [ ! "$(docker ps -q -f name=nestjs-postgres)" ]; then
      echo "Starting Docker container for Postgres..."
      cd server && docker-compose --env-file server/.env -f docker-compose.yml up -d
    else
      echo "Postgres Docker container is already running."
    fi

    # --- Server setup ---
    # Install server dependencies if necessary
    if [ ! -d "server/node_modules" ]; then
      echo "Installing server dependencies..."
      cd server && npm install
    fi

    echo "Environment setup is complete. You can now run the backend and frontend servers."
  '';
}
