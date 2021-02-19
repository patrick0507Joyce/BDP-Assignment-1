# Part1 Design
#### Explain your choice of data and technologies for mysimbdp-coredms
In this Assignment, I mainly focus on the Airbnb dataset, which comsists of rooms, reviews and calendar data respectively. 

I choose MongoDB as the Dataset. More Specifically, in this assignment, I employ a shared cluster on the Mongo Atlas Cloud. On top of the MongoDB, the native Mongo driver in Node.js(https://mongodb.github.io/node-mongodb-native/) is used together to build the infrastructure of **mysimbdp-coredms**.

#### Design and explain interactions between main components in your architecture of mysimbdp
The general architecture of **mysinbdp** can be found below.  This is the description of each part in the diagram.
*  **Client**: Client represents those individuals who want to connect to the service to store information into database. In order to handle concurrency matter, the whole API part is designed with Asyncronous First rule.
* **RESTful API**: this part represents the main part of **mysimbdp-daas** , which defines and provides APIs in the remote cloud VM and opened to the Clients. Clients can generate requests accordingly. For example, they can find specific row by the key in the document or post a new record into the specific collection in the database.
* **Data Processing**: this part is built with native Mongo driver in Node.js and interacts with the MongoDB directly. This part serves as the final component for both the APIs and Ingest part to access the Database.
* **MongoDB Cluster**: this part is a shared cluster on Mongo Cluster https://cloud.mongodb.com/. This Cluter provides Access Control and Network Control options, and it is easy to connect via the URL.
![Architecture](figures/Graph1.jpg)

As we can see from above, there remains a lot of ways to connect between compoennts, let's take a further look one-by-one:
*  **Client ->Data Processing**:  this part use the script in **Tools/mysimbdp-daas.js**  and it can be run from the shell individually.  It consists two parts: 

	* **ParseArgs**: Reading and Parsing Arguments from the command line
	* **IngestData**: Ingest the local CSV files into the Database.

the former one is quite straightforward, while the latter is designed as stream processing logic, in case of handing huge CSV file if necessary.
**IngestData**:
1. **openCsvInputStream**: read the local CSV into file stream and parse rows into a csvInputStream 
2. **openMongodbOutputStream**: read the csvInputStream from the pipe and store into the database.

*  **Client ->RESTful API**:  this entry for the RESTful API is index.js, the specific route table is included in the **Routes** folder, which includes routes cases for reviews and rooms collections.
*  **RESTful API ->Data Processing**:   this part is connected via the native MongoDB driver in Node.js, which is included in dataBaseToolKits folder.
*  **Data Processing ->MongoDB Cluster**:  this part is built by the native MongoDB driver in Node.js, which helps us manupulate the Database easily.
*  **MongoDB Cluster ->Client**:  In order to help the user fetch the result easily, I created the GET APIs inside the router table, more specific APIs can be found there, so that the user can fetch the data easily.

The RESTful API and Ingesting part are deployed on Google Cloud Platform Kafka Certified by Bitnami, so that the service can be kept available all the time.

#### Explain a configuration of a cluster of nodes for mysimbdp-coredms so that you do not have a single-point-of-failure problem for mysimbdp-coredms for your tenants 

In the Shared Cluster, we have 3 nodes altogether, which is also the minimum requirement  for a replica set. The Primary node will interact with the request while the Secondary node do the backup asyncronously.

#### You decide a pre-defined level of data replication for your tenants/customers. Explain how many nodes are needed in the deployment of mysimbdp-coredms for your choice so that this component can work property (e.g., the system still supports redundancy in the case of a failure of a node)

As we mentioned above, the minimum node numbers for a replica set is 3. The Primary node will interact with the request while the Secondary node do the backup asyncronously.

#### Explain how would you scale mysimbdp to allow many tenants using mysimbdp-dataingest to push data into mysimbdp

My solution is sufficient to handle the request from many tenants to fetch from or post  into the Databse via the exposed APIs. The whole architecture is designed so that the users won't have access to the Database. To sum up, the whole system could handle concurrent request and protect the Database in the same time. In addition, the Mongo Cluster cloud-based service helps to handle the requests queue, too.

# Part 2 - Implementation
#### Design, implement and explain the data schema/structure for mysimbdp-coredms

My  **mysimbdp-coredms** in this assignment  is based on MongoDB. 
According to Wikipedia, MongoDB is a cross-platform JSON document-oriented database that uses optional JSON data schema. Unlike ORM, MongoDB doesn't impose strict requirements on the Schema.  In addition, it doens't have normal tables in the Database, on the contrary, the data structure in the MongoDB, namely collection, consists of a lot of BSON files. Let's see how it looks like so far in my Mongo Cluster:
![Mongo Cluster](figures/Graph2.jpg)
Let's take a quick look at the JSON dat schema. Although MongoDB is a schemaless database, it is still possible to build the Schema and validate data beforehead.
![Collection Schema](figures/Graph3.jpg)

#### Design a strategy for data partitioning/sharding and explain your implementation for data partitioning/sharding together with your design for replication in Part 1, Point 4, in mysimbdp-coredms
the capacity of a single node database server is quite limited, especially when handling with high throughput. we have to handle with the extreme case,  we have to employ data sharding to increase the storage capacity of the whole cluster. **Data Sharding** is a method for distributing data across multiple machines or the shards in the cluster, allowing each shard to contain a subset of the total cluster data documents. 

Specifically, MongoDB divides the span of shard key values (or hashed shard key values) into non-overlapping ranges of shard key values (or hashed shard key values). Each range is associated with a [chunk](https://docs.mongodb.com/manual/reference/glossary/#term-chunk), and MongoDB attempts to distribute chunks evenly among the shards in the cluster.

For example, as for our Airbnb dataset, we can spread the database into each node of the cluter by the location of citys:
* Shard 1: reviews in Europe
* Shard 2: reviews in Asia

#### Write a mysimbdp-dataingest that takes data from your selected sources and stores the data into mysimbdp-coredms. Explain possible consistency options for writing data in your mysimdbp-dataingest
As I mentioned above in Part 1 Point 1,  we provide the script mysimplebdp_dataingest.js which took the command line args and transform the local files into the stream and tranfer the stream to the Mongo Cluster. Besides uploading local files by the dataIngest script, it is also available to call the POST API to insert the record in JSON fromat into the database.

As for the consistency options, there are two options in my mind:
-   **ACID Consistency :** ACID means that once data is written, you have full consistency in reads.
-   **Eventual Consistency (BASE):** BASE means that once data is written, it will eventually appear for reading.

#### Given your deployment environment, show the performance (response time and failure) of the tests for 1,5, 10, .., n of concurrent mysimbdp-dataingest writing data into mysimbdp-coredms with different speeds/velocities. Indicate any performance differences due to the choice of consistency options
Although Node.js is a single-thread language, we could simulated the multiprocessing situation by running several Node.js to do the data ingest together. More details can be found in mysimplebdp_parallel_dataingest.js script. As we can see from the graph below, the dataingest runs properly and the performance is not affected a lot. 
![Concurrency Performance](figures/Graph4.jpg)
#### Observing the performance and failure problems when you push a lot of data into mysimbdp-coredms (you do not need to worry about duplicated data in mysimbdp), propose the change of your deployment to avoid such problems (or explain why you do not have any problem with your deployment)
The potential failure may happen when multiple users ingest huge CSV files together. While since I already design the stream processing module, It's unlikely that we may face the fault. we may see that the performance decrease a lot when a lot of users ingest data together, then we have to do the horizontal or vertical sharding.

# Part 3 Extension
#### Using your mysimdbp-coredms, a single tenant can create many different databases/datasets. Assume that you want to support the tenant to manage metadata about the databases/datasets, what would be your solution?
As I mentioned above, the MongoDB is a schemaless, while it doens't mean that we cannot have the schema in the Mongo collection. In the architecture, I adopted native mongo driver for Node.js to interact with the database, in this case, we don't have to build the Schema beforehead. While we can also manipulate the Database using ORM tool such as Mongoose. Mongoose is built on top of native driver, and we have to specify the Schema, the reference information, too. In this case, the users could mange the metadata for the databases. I think there will be a lot of similar tools in other programming languages.

#### Assume that each of your tenants/users will need a dedicated mysimbdp-coredms. Design the data schema of service information for mysimbdp-coredms that can be published into an existing registry (like ZooKeeper, consul or etcd) so that you can find information about which mysimbdp-coredms is for which tenants/users

In this case,  we would have to store the client id and the corresponding MongoDB service information in a registry service such as ZooKeeper, which is useful to manage configuration information in a centralized and secure way providing distributed synchronization. In this case, the client user would be matched and connected with its corresponding database. 

#### Explain how you would change the implementation of mysimbdp-dataingest (in Part 2) to integrate a service discovery feature (no implementation is required)
Since we already register the MongoDB  in  a registry service such as ZooKeeper, then the client side module **mysimplebdp-dataingest** will be possible to query the specific address from the registry service, which means that the client side is not tightly coupled with database node.

#### Assume that now only mysimbdp-daas can read and write data into mysimbdp-coredms, how would you change your mysimbdp-dataingest (in Part 2) to work with mysimbdp-daas?
Actually in the very beginning, my implementation of **mysimbdp-dataingest** relies on **mysimbdp-daas** to privoide the service, while there remains a significant potential risk: what if the API web serive is down? go back to this question, if only **mysimbdp-daas** could access to the **mysimbdp-coredms**, then we have to make sure  **mysimbdp-daas** works as we expect. Secondly, since we generate the csv data stream, we could call the POST API to insertMany into the Database, even if the local file is huge, we can still handle it chunk by chunk via the stream.

#### Assume that you design APIs for mysimbdp-daas so that any other developer who wants to implement mysimbdpdataingest can write his/her own ingestion program to write the data into mysimbdp-coredms by calling mysimbdp-daas. Explain how would you control the data volume and speed in writing and reading operations for a tenant?
They can make use of existing APIs I have created in the service to ingest data into the databse. Let's go through the APIs that needed for any other developer to write their own ingestion:

* APIs for insert dataset into the Mongo Cluster, for example, http://35.232.158.113:3001/reviews/ingest is the entry for inserting records into the Reviews table.
* the connect string to the MongoDB Cluster, in my case, it is: mongodb+srv://admin:rootbdp2021@bdf-a1-cluster1.padsg.mongodb.net/?retryWrites=true&w=majority

