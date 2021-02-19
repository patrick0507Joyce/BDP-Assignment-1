
# Deploy
### MongoDB Cluster 
the Cloud Mongo Atlas shared Cluster can be connected by the following string, which I also included in the _.env_ file. 
```
mongodb+srv://admin:rootbdp2021@bdf-a1-cluster1.padsg.mongodb.net/?retryWrites=true&w=majority
```
In the Network Access control, we shall set the Cluster open to 0.0.0.0/0, so that users won't be blocked out.

###  Kakfa VM: a _Google Cloud Platform Kafka Certified by Bitnami_ virtual machine
please include the firewall rules:
-   Set the direction of traffic as "Egrees", the destination IP ranges as "0.0.0.0/0", and the protocols and ports as "Allow all".
    
-   Set the direction of traffic as "Ingrees", the destination IP ranges as "0.0.0.0/0", and the protocols and ports as "3000-5000".

ssh configuration:
```
ssh bitnami@35.232.158.113
```
# Setup Node.js environement and Run code
```
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
apt-get install -y nodejs

npm install
//run the mysimbdp-daas service:
npm run dev
//run the mysimbdp-dataingest
node mysimplebdp_dataingest.js --dataset calendars
//run the concurrent dataingest
node mysimplebdp_parallel_dataingest.js --slaveCount 20
```
# API tables
all the APIs can be found in api_test.rest under RESTful folder. Please use postman to test it.
# Git Logs
```
commit ef76c92898383e729dc3357360a114b373b075a2 (HEAD -> streamProcessing/1.0, origin/streamProcessing/1.0, origin/HEAD)
Author: Patrick0507Joyce <sxh20150609@gmail.com>
Date:   Fri Feb 19 09:55:52 2021 +0000

    multiprocessing script and finishing report

commit a47ffdad84fa14c06a80d88e2b92aafae86abae1
Author: Patrick0507Joyce <sxh20150609@gmail.com>
Date:   Thu Feb 18 19:50:44 2021 +0000

    assignment 1 report

commit 0db97c56c0d1b8d72b67fb14f91a8d0f5dda86c5
Author: Patrick0507Joyce <sxh20150609@gmail.com>
Date:   Thu Feb 18 00:16:48 2021 +0000

    daas platform API module complete

commit d1e707bc2b8b6d23016daf8b4b94d0b35fc7695b
Author: Patrick0507Joyce <sxh20150609@gmail.com>
Date:   Wed Feb 17 21:50:18 2021 +0000

    mysimplebdp_dataingest module polished

commit 876539222f349a79373cc40d954eafa6fee613f8
Author: Patrick0507Joyce <sxh20150609@gmail.com>
Date:   Wed Feb 17 21:49:55 2021 +0000

    mysimplebdp_dataingest module complete

commit 791a026abf5ff793b174b704a919a0dca9433aa3
Author: Patrick0507Joyce <sxh20150609@gmail.com>
Date:   Wed Feb 17 21:10:31 2021 +0000

    format change

commit 985fc248ddeeff356e49b5fc85d65feed35ae8a9
Author: patrick0507Joyce <sxh20150609@gmail.com>
Date:   Wed Feb 17 11:28:03 2021 +0000

    remove unnecessary part

commit 65ad5f33201c19e8b54d677987533c6c2fff6bf5
Author: patrick0507Joyce <sxh20150609@gmail.com>
Date:   Wed Feb 17 11:25:55 2021 +0000

    stream Processing module

commit 558925edd30c81e8b4f4e8558a4cc9b144058b85 (origin/dev/1.0)
Author: patrick0507Joyce <sxh20150609@gmail.com>
Date:   Mon Feb 8 18:56:27 2021 +0000

    assignment 1
```




