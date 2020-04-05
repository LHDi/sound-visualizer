#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.106.0/containers/javascript-node-12/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-12

# set inotify and start the node application, replace yar with your command
RUN echo "#!/bin/sh \n\
    echo "fs.inotify.max_user_watches before update" \n\
    cat /etc/sysctl.conf\n\
    echo "______________________________________________updating inotify ____________________________________" \n\
    echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p \n\
    echo "updated value is" \n\
    cat /etc/sysctl.conf | grep fs.inotify \n\
    " >> /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh


# ** [Optional] Uncomment this section to install additional packages. **
#
# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get update \
#    && apt-get -y install --no-install-recommends <your-package-list-here> \
#    #
#    # Clean up
#    && apt-get autoremove -y \
#    && apt-get clean -y \
#    && rm -rf /var/lib/apt/lists/*
# ENV DEBIAN_FRONTEND=dialog

