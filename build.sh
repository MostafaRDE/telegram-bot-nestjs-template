#!/bin/bash

docker compose stop app

NOW="$(date +'%Y-%m-%d.%I-%M-%S')" # As date and time
# NOW="$(date +'%s')" # As timestamp
CURRENT_USER=$(whoami)
# CURRENT_SERVICE_NAME="$(basename $PWD)"
CURRENT_SERVICE_NAME="$(pwd | rev | cut -f2 -d'/' - | rev)"
RELEASE_DIR="../releases/$CURRENT_SERVICE_NAME/release-$NOW"

sudo rm -rf ./dist
docker run --rm -i -v $(pwd):/opt nestjs/base:10.1.17-alpine3.18 npm run build
mkdir -p $RELEASE_DIR
sudo cp -R ./dist $RELEASE_DIR/dist
cp -R ./package.json $RELEASE_DIR/package.json
cp -R ./package-lock.json $RELEASE_DIR/npm-shrinkwrap.json
sudo rm -rf ./dist


echo "#!/bin/bash

sudo rm -rf ../../../main/dist
sudo rm -f ../../../main/package.json
sudo rm -f ../../../npm-shrinkwrap.json
sudo cp -R ./dist ../../../main/dist
cp ./package.json ../../../main/package.json
cp ./npm-shrinkwrap.json ../../../main/npm-shrinkwrap.json" >> $RELEASE_DIR/update.sh
sudo chmod 744 $RELEASE_DIR/update.sh

docker compose start app