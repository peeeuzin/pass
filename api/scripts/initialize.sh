# This is a script to run prisma commands in the docker container
echo "Running prisma commands"
yarn prisma migrate deploy
yarn prisma generate
echo "Building"
yarn build

node .