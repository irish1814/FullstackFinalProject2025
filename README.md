
## Deployment

### Requirements
To deploy this project run

```bash
  npm install
```

within the root directory where the package.json is located.

### Docker compose file

deploy a mongo Database using docker like we did or your own service:

```bash
version: '3.8'

services:
  mongodb:
    image: mongo:4.4.18
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ROOT_USERNAME
      ME_CONFIG_MONGODB_ADMINPASSWORD: PASSWORD
      MONGO_INITDB_ROOT_USERNAME: USERNAME
      MONGO_INITDB_ROOT_PASSWORD: PASSWORD
      MONGO_INITDB_DATABASE: DB_NAME
    
    command: ["--bind_ip_all"]
    volumes:
      - MongoDb:/data/db

volumes:
  MongoDb:
```

change usernames and passowrds of your choice then
copy this config to a *.yaml file and run 

```bash
docker-compose up -d
```

### env development file

Copy the following environments to a file named .env.development.local inside server foler
```bash
PORT=SERVER_PORT
NODE_ENV=development
DB_URL=MONGO_DB_URL
JWT_EXPIRES_IN=1d
JWT_SECRET=superS3cretP4ssw0rd
ADMIN_SECRET_KEY=adm!nKey1234
```

### Run the server
Goto server folder and run

```bash
npm run dev
```

### Run the client
Goto client folder and run

```bash
npm run dev
```
