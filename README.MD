## Projekti käivitamise ettevalmistamine dockeriga (Linuxis)

* Tee käesolevast projektist enda GIT-is kas koopia või haru.
* Tutvu saadaoleva dokumentatsiooniga ja tee oma uue projekti failidesse vajalikud muudatused. Tavaliselt on vaja muuta faile
  * config_dist.js
  * Dockerfile
  * README.MD
* Salvesta tehtud muudatused
  * git commit -a
  * git push

## Püüa loodud projekti paigaldada
* Kui su serveris veel pole Dockerit, siis paigalda see: http://docs.docker.com/engine/installation/
* KÄIVITA REDIS SERVER:
  ```
  $ docker run --name kl_redis -d redis
  ```
* Lae alla oma teenuse Dockerfile
  * wget https://github.com/username/kl_teenus/raw/master/Dockerfile
  * Muuda allalaetud faili vastavalt vajadusele. Näiteks muuda #Expose port parameetrit vastavalt sellele, millisel pordil hakkab loodud teenus töötama.
* Loo dockeri Image fail (kl_teenus - Image nimi):
  ```
  $ docker build -t kl_teenus .
  ```
* Soovi korral loo teenuse seadistuste faili jaoks dockeriväline kaust:
  ```
  $ mkdir -p /etc/wrapper/kl_teenus
  ```
* Käivita loodud kl_teenus:
  ```
$ docker run --name kl_teenus -it -d --link kl_redis:redis -p 3000:3000 -v /etc/wrapper/kl_teenus:/config kl_teenus
  ```
* Muuda vajaduse korral teenuse seadistusi failis /etc/wrapper/kl_teenus/config.js
* Soovi korral saab konteineris teha toiminguid, aga eeldatavasti ei ole vaja midagi täiendavat teha:
  ```
  $ docker exec -it kl_teenus bash
  ```
  * Konteinerist saab väljuda käsuga: Ctrl+P Ctrl+Q
* Kui muutsid midagi, siis uuenda teenust:
  ```
  $ docker exec kl_teenus /src/docker_update.sh
  ```
