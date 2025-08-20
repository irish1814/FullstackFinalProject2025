# FullstackFinalProject2025

## docker compose file
version: '3.8'

services:
  mongodb:
    image: mongo:4.4.18
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      MONGO_INITDB_ROOT_USERNAME: mongo
      MONGO_INITDB_ROOT_PASSWORD: secret
      MONGO_INITDB_DATABASE: fullstackdb
    
    command: ["--bind_ip_all"]
    volumes:
      - MongoDb:/data/db

volumes:
  MongoDb:


## env development file
PORT=5500
NODE_ENV=development
DB_URL=mongodb://mongo:secret@192.168.33.51:27017/fullstackdb?authSource=admin
JWT_EXPIRES_IN=1d
JWT_SECRET=superS3cretP4ssw0rd
ADMIN_SECRET_KEY=adm!nKey1234
