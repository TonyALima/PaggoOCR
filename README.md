# PaggoOCR

## Environment Variables
The project requires three `.env` files for configuration: one for Docker (`./`), one for the backend (`./paggo-backend/`), and one for the frontend (`./paggo-frontend/`). Each of these folders contains a `.env.exemple` with the necessary variables for their respective components.

Please ensure all `.env` files are properly filled out before building the project. Variables with the same name across files must have identical values.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/TonyALima/PaggoOCR.git
    ```
2. Navigate to the project directory:
    ```bash
    cd PaggoOCR
    ```
3. Set all `.env` files.
4. Build the Docker containers:
    ```bash
    docker-compose build
    ```
5. Start the db:
    ```bash
    docker-compose up -d 'db'
    ```
6. Init the database:
    ```bash
    docker-compose run backend npx prisma migrate dev --name init
    ```
7. Restart containers:
    ```bash
    docker-compose down && docker-compose up -d
    ```

## Usage
1. Start the project:
    ```bash
    docker-compose up -d
    ```
