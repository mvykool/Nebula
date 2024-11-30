{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs       # Node.js for the client and backend
    pkgs.npm          # NPM for managing client dependencies
    pkgs.dockerTools  # Docker for managing Docker containers
    pkgs.docker       # Docker CLI tools to interact with Docker
    pkgs.git          # Git for version control
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
DB_USERNAME=${toString (builtins.getEnv "DB_USERNAME" or "default_user")}
DB_NAME=${toString (builtins.getEnv "DB_NAME" or "default_name")}
DB_PASSWORD=${toString (builtins.getEnv "DB_PASSWORD" or "default_password")}
SECRET=${toString (builtins.getEnv "SECRET" or "default_secret")}
SECRET_REFRESH=${toString (builtins.getEnv "SECRET_REFRESH" or "default_refresh")}
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
