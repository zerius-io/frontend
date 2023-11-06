# Zerius server

docker build -t zerius-server .
docker run -p 3000:3000 --restart unless-stopped --name zerius-server zerius-server