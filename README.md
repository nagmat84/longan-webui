# Longan Web UI

[![Build Status](https://github.com/nagmat84/longan-webui/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/nagmat84/longan-webui/actions?query=workflow%3A%22Node.js+CI%22)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nagmat84_longan-webui&metric=alert_status)](https://sonarcloud.io/dashboard?id=nagmat84_longan-webui)

#### A great looking and easy-to-use photo-management-system.

*Longan is a fork of Lychee v4.*
*The original Lychee project is located at [LycheeOrg](https://github.com/LycheeOrg).

Longan is a free photo-management tool, which runs on your server or web-space.
Installing is a matter of seconds.
Upload, manage and share photos like from a native application.
Longan comes with everything you need and all your photos are stored securely.

Longan is split into two repositories:
 - the [Longan Server](https://github.com/nagmat84/longan-server) and
 - the Longan WebUI (this repository).
The Longan Server implements the backend and runs on the web server.
The Longan WebUI implements the frontend, runs inside the user's browser and interacts with the Longan Server.
For installation one only needs the Longan Server as the Longan Server includes the Longan WebUI as a submodule.


## Installation

Follow the instructions how to install the [Longan Server](https://github.com/nagmat84/longan-server).


## How to Build

If you want to contribute and edit CSS or JS files, you need to rebuild Longan.

```sh
# Clone Longan Server
git clone https://github.com/nagmat84/longan-server.git

# Initialize the submodule Longan WebUI
git submodule init

# Get the Longan WebUI
git submodule update

# Go into the frontend
cd Lychee-front
```

### Dependencies

First you have to install the following dependencies:

-   `node` [Node.js](http://nodejs.org) v10.0.0 or later
-   `npm` [Node Packaged Modules](https://www.npmjs.org)

After [installing Node.js](http://nodejs.org) you can use the included `npm` package manager to download all dependencies:

```sh
npm install
```

### Build and Generated Files

The Gulpfile is located in `<path to Longan>/Lychee-front/` and can be executed using the `npm run compile` command.
The generated files will placed into `../dist/` or `<path to Longan>/dist/`.

### :warning: Style formatting

Before submitting a pull request, please apply our formatting rules by executing:

```sh
npm run format
```

You can also just incorporate a git hook: `.git/hooks/pre-commit`

```sh
#!/bin/sh
NO_COLOR="\033[0m"
GREEN="\033[38;5;010m"
YELLOW="\033[38;5;011m"

printf "\n${GREEN}pre commit hook start${NO_COLOR}\n"

PRETTIER="./node_modules/prettier/bin-prettier.js"

if [ -x "$PRETTIER" ]; then
    git status --porcelain | grep -e '^[AM]\(.*\).php$' | cut -c 3- | while read line; do
        ${PRETTIER} --write ${line};
        git add "$line";
    done
else
    echo ""
    printf "${YELLOW}Please install prettier, e.g.:${NO_COLOR}"
    echo ""
    echo "  npm install"
    echo ""
fi

printf "\n${GREEN}pre commit hook finish${NO_COLOR}\n"
```

This can easily be installed by doing:

```sh
cp pre-commit ../../.git/modules/public/Lychee-front/hooks
chmod 755 ../../.git/modules/public/Lychee-front/hooks/pre-commit
```

### Watch for changes

While developing, you might want to use the following command to automatically build Longan everytime you save a file:

```sh
npm start
```
