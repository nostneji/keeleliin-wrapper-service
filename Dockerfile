# DOCKERi skript
#   OMA TEENUSE ettevalmistamisel asenda nii käesolevas failis kui ka failis README.MD string 'kl_teenus' sobiva nimega, 
#   näiteks sõnade loendaja 'wc' korral 'kl_wc'.
#   Nimed 'github.com' ja 'username' tuleb asendada vastavalt kasutatavale GIT repositooriumile.
#
# DOCKERi paigaldamiseks ja käivitamiseks:
#   cd /soovitud/asukoht/oma/teenuse/koodile/serveris
#   wget https://github.com/username/kl_teenus/raw/master/Dockerfile
#   docker build -t kl_teenus .
#   docker run --name kl_redis --rm --restart=no redis
#   docker run --name kl_teenus -d --link kl_redis:redis -p 3003:3003 -v /etc/wrapper/teenus/:/config kl_teenus
#
# DOCKERi seiskamiseks:
#   docker kill kl_teenus
#   docker rm kl_teenus
#

FROM    debian:jessie

RUN apt-get update && \
    apt-get -y install curl sudo && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs && \
    apt-get -y install git && echo "Installed 2"

RUN npm install -g forever

RUN mkdir -p /src && mkdir -p /config && mkdir -p /wrapper/files && mkdir -p /wrapper/tmp && \
cd /src && \
git clone 'https://github.com/username/kl_teenus.git' . && \
npm install && \
echo "NPM is installed"

# SIIA ALLA lisa kõik installeerimise käsud, mis on vajalikud sisulist tööd tegeva tarkvara X paigaldamiseks.
# Tarkvara X paigaldamine algab 

# Tarkvara X paigaldamine lõppeb

#Expose port
EXPOSE  3003

VOLUME ["/config"]

CMD /./src/docker_start.sh