# M101JS: MongoDB for Node.js Developers

### Week 1: Introduction

### Welcome to M101JS 
https://youtu.be/04N3Z0k5RuA

---

### What is MongoDB
https://youtu.be/L-v-PBVLSe4

so what is MongoDB MongoDB is many
things but most of the features and
functionality of MongoDB rests on the
fact that it's a document database when
discussing MongoDB data models queries -
MongoDB and data stored in MongoDB we
use JSON or JavaScript object notation
this JSON document provides an example
that illustrates the type of data
MongoDB stores as a single record
important advantages of this design are
that development teams can design data
models to support common data access
patterns for example a team building a
news website can design their data model
so that the most frequently viewed pages
may require only a single query to the
database and can do this in an elegant
way that is fully supported by MongoDB
in this example we're combining copy
author info tags and comments to enable
rendering a news article with a single
database query contrast this with a
relational design which would probably
require several joins across tables or
an ugly means of storing multiple values
in single table fields since mime gonna
be data models are not predicated on
joining data from multiple tables
together it's much easier to distribute
or shard data across multiple servers
this means in MongoDB you have a wide
variety of options when considering
database deployments from many
inexpensive commodity machines to a few
larger more powerful servers MongoDB
natively supports scaling out through
its sharding feature and does so in a
way that is abstracted away from
application logic so developers can
build their application in a way that is
agnostic about the deployment model used
whether a single node or a few nodes or
hundreds of nodes are used
makes no difference from the perspective
of the application in contrast since
joins and multi table transactions are
difficult to do in parallel for a
relational system your best option is
usually scaling up acquiring
increasingly expense
Esav hardware so that your data can be
served from a single server while not
always true multi-table joins and
transactions are typically not missed in
a MongoDB database because the schema
design capabilities support models that
require atomic reads and writes only to
individual documents so in summary
MongoDB enables application developers
to design data models that make sense
for their applications that is those
that efficiently support common data
access patterns as we'll see as we move
through this course MongoDB is designed
to support agile software engineering
practices and meet the scalability and
performance needs of modern applications


---

### Overview of Building and App with MongoDB
https://youtu.be/iIhgggzzeoA

all right so right now we're going to
talk about an application from 20,000
feet so this is going to be a very
high-level overview of all of the pieces
of an application that uses MongoDB and
how they interact and briefly talk about
the Mongo shell and how it fits into all
of this
all right so the very beginning you have
some application so this is your app and
it provides some service over here you
have some clients and these clients are
making a request to your application
they may be web browsers they may be
various other applications they don't
necessarily have to be web browsers they
could be anything that you know needs
some service from your application that
could be consuming a REST API basically
you'll have no clients and you'll have
your server so that's the kind of the
model we're dealing with right here so
this server will be running nodejs in
this class and basically at a high level
what nodejs is is it's basically a C++
program that you control using v8
JavaScript so any applications you write
using node.js will be written in
JavaScript and it'll just control this
C++ application and you'll be able to
say something like they made a request
for this resource and your application
actually in JavaScript will say okay if
they made a request for this resource I
know how to respond to that and I'll
respond accordingly so that's basically
the application part but if your
application needs to store persistent
data now that's where MongoDB would come
in so here the way this will work is
that your application will actually make
a request to MongoDB it'll either be
trying to store data it'll be trying to
retrieve data update data and it will
make a request to MongoDB to perform
this operation and MongoDB will reply
with the return status or you know if
you actually specify write concern which
we'll talk about later it will respond
when you know the appropriate
persistence is reached you know you can
say write concern of my entire replica
set and it will only respond when your
entire replica set has been written to
and also the core server of MongoDB if
you're curious is written in C++ as well
so that's
how the components work together we
basically have this application server
interacting directly with clients and
when the application server needs to
store data persistently it actually acts
as the client communicating with Mongo
DB which is listening for incoming
requests and will actually respond you
know when the request has been completed
so the other part of this is that we
actually have an administrative shell so
this is the Mongo shell and it's a
useful tool for performing various
administrative tasks if you just want to
take a quick look at what's in your
database this is very useful tool so
what is the Mongo shell exactly so the
Mongo shell is actually has a lot of
similarities with nodejs itself in that
it's also just a C++ program that you
control using v8 so actually when you
open up the Mongo shell you get a prompt
and you can type various commands into
this prompt and the Mongo shell will
then interpret these commands using its
own v8 bindings and make requests to
MongoDB among the DB will respond and
you can see the immediate response in
the shell so this is useful for doing
things like asking various questions
about your configuration or even seeing
a bit of what you actually have stored
in your database or debugging of your
application so this is sort of you can
just think of this whole part as the
administrative interface and this part
is the actual production interface for
your clients so one last part of this
that'll be important just for
understanding this once you actually
start writing applications nodejs
applications which is what we'll be
focusing on for this course is the way
that node.js actually communicates to
MongoDB is through the driver so there's
actually a library that is available
that you can install and use in your
node.js application that actually
handles all of the connections to
MongoDB all of the failover all of the
wire protocol and basically in your
application all you have to do is use
this API provided by the driver and
it'll handle the communication to
MongoDB for you so you can use this API
to insert documents find documents
remove documents and that will all be
handled by the driver

---

### Overview of Building and App with MongoDB
https://youtu.be/sBdaRlgb4N8

all right so right now we're going to
talk about an application from 20,000
feet so this is going to be a very
high-level overview of all of the pieces
of an application that uses MongoDB and
how they interact and briefly talk about
the Mongo shell and how it fits into all
of this
all right so the very beginning you have
some application so this is your app and
it provides some service over here you
have some clients and these clients are
making a request to your application
they may be web browsers they may be
various other applications they don't
necessarily have to be web browsers they
could be anything that you know needs
some service from your application that
could be consuming a REST API basically
you'll have no clients and you'll have
your server so that's the kind of the
model we're dealing with right here so
this server will be running nodejs in
this class and basically at a high level
what nodejs is is it's basically a C++
program that you control using v8
JavaScript so any applications you write
using node.js will be written in
JavaScript and it'll just control this
C++ application and you'll be able to
say something like they made a request
for this resource and your application
actually in JavaScript will say okay if
they made a request for this resource I
know how to respond to that and I'll
respond accordingly so that's basically
the application part but if your
application needs to store persistent
data now that's where MongoDB would come
in so here the way this will work is
that your application will actually make
a request to MongoDB it'll either be
trying to store data it'll be trying to
retrieve data update data and it will
make a request to MongoDB to perform
this operation and MongoDB will reply
with the return status or you know if
you actually specify write concern which
we'll talk about later it will respond
when you know the appropriate
persistence is reached you know you can
say write concern of my entire replica
set and it will only respond when your
entire replica set has been written to
and also the core server of MongoDB if
you're curious is written in C++ as well
so that's
how the components work together we
basically have this application server
interacting directly with clients and
when the application server needs to
store data persistently it actually acts
as the client communicating with Mongo
DB which is listening for incoming
requests and will actually respond you
know when the request has been completed
so the other part of this is that we
actually have an administrative shell so
this is the Mongo shell and it's a
useful tool for performing various
administrative tasks if you just want to
take a quick look at what's in your
database this is very useful tool so
what is the Mongo shell exactly so the
Mongo shell is actually has a lot of
similarities with nodejs itself in that
it's also just a C++ program that you
control using v8 so actually when you
open up the Mongo shell you get a prompt
and you can type various commands into
this prompt and the Mongo shell will
then interpret these commands using its
own v8 bindings and make requests to
MongoDB among the DB will respond and
you can see the immediate response in
the shell so this is useful for doing
things like asking various questions
about your configuration or even seeing
a bit of what you actually have stored
in your database or debugging of your
application so this is sort of you can
just think of this whole part as the
administrative interface and this part
is the actual production interface for
your clients so one last part of this
that'll be important just for
understanding this once you actually
start writing applications nodejs
applications which is what we'll be
focusing on for this course is the way
that node.js actually communicates to
MongoDB is through the driver so there's
actually a library that is available
that you can install and use in your
node.js application that actually
handles all of the connections to
MongoDB all of the failover all of the
wire protocol and basically in your
application all you have to do is use
this API provided by the driver and
it'll handle the communication to
MongoDB for you so you can use this API
to insert documents find documents
remove documents and that will all be
handled by the driver

---

### JSON
https://youtu.be/YgE9GugiB58

okay now let's dive a little deeper into
JSON just to make sure we're clear on
all of the key details there may be a
few among us who need a little refresher
on the ins and outs we're going to work
from this example and the first thing
that I want to review is that JSON
objects are composed of key value pairs
as you can see here Keys must be strings
and keys and values are separated from
one another using colons
fields within a JSON object are
separated using comma as the delimiter
and of course JSON objects are opened
and closed using curly braces JSON
supports a number of different value
types those types include string as we
can see with the headline date and a
number of the nested fields here number
is another supported value type as we
can see here with views the published
field provides an example of the boolean
value type and with the tags field we
have an array value finally the author
field provides an example of the object
value type the author field naturally
leads to a discussion of nesting and in
this object we have several different
types of nesting to consider because
among the supported value types object
is included we can nast one object
within another as the value of a field
again as we see here with author the
value of author is actually another
object with fields of its own turning to
the tags field we can see that arrays
may be composed of any combination of
legal values including strings numbers
objects and other arrays now let me step
back for just a second and say that in
this example we're assuming there's
actually a good reason to have the tags
field support three different types of
tags in this case we have a simple
string as the first element of the tags
array this being the ticker symbol for
Apple there is also a structured or
typed kind of tag for location in this
case the city Cupertino finally the tags
are
also includes a nested array that
represents the parent categories into
which this story falls in this case the
computers subcategory of electronics as
the author and tags fields illustrate
here I'm going to be data models
commonly make use of nesting and even
what we might call deep nesting for
example nesting an object within an
array the flexibility JSON provides
makes it possible to efficiently support
a variety of data access patterns by
creating objects that contain all the
data required to render a webpage full
of content or say to provide another
type of data view for users with very
few requests to the database for more
detail on JSON I encourage you to visit
JSON org where you can review the JSON
spec and read further about this data
format

---

### BSON 
https://youtu.be/Iun2ei_XlWw

MongoDB actually stores data as beasts
on or binary JSON you can find the spec
for beasts on at beasts on spec org
we'll take a look at the spec in a
moment MongoDB drivers send and receive
data as beasts on and when data is
written to MongoDB it's stored as beasts
on on the application side MongoDB
drivers map beasts on to whatever native
data types are most appropriate for a
given programming language beasts on was
designed to be lightweight meaning that
the space required to represent data is
kept to a minimum
beasts on is also traversable to support
the variety of operations necessary for
writing reading and indexing MongoDB
documents finally beasts on is efficient
meaning encoding data to beasts on and
decoding data from beasts on as the
drivers need to do can be performed very
quickly so let's take another look at
the JSON example we looked at previously
and here I want to point out that the
JSON value types are somewhat limited
for example there's a single number type
meaning within JSON you can't
distinguish between integers and
floating point types in addition JSON
doesn't support dates so you have to
encode a date either as a string or as
some sort of nested object for this
reason be some extends the JSON value
types to include integers doubles dates
and binary data to support say images
and a number of other types of data if
you're interested in learning more about
beasts on I encourage you to look at
beasts on spec org and in particular
take a look at the spec and how data is
actually encoded as beasts on as a quick
example let's take a look at how this
JSON document would be encoded as beasts
on you can see the key and value as part
of the encoding the rest of what's here
takes care of specifying the length of
the entire document the type of the
value that's applied for this field the
length of the field value and then there
are things like null terminators for
Strings all this part of the encoding if
you're interested in the details of all
of this I encourage you to take a look
at beasts on spec org
though we spent just a few minutes
talking about beasts on as we consider
MongoDB data in this course we will
almost exclusively look at data
formatted using JSON syntax
however we will use the term document to
describe such records primarily because
a lot of the data we look at isn't
strictly speaking JSON due to the
additional value types MongoDB supports
and some syntactic shortcuts that the
Mongo shell and other tools use in
presenting data for example you may see
something like this a little later on
where we represent a date value type in
something that looks a lot like JSON
syntax


---

### Intro creating and reading documents
https://youtu.be/8To9enkSUHI

now that we have a pretty good
understanding of MongoDB documents let's
begin to explore some basic crud
operation concepts in case you're not
familiar with the term crud is an
acronym for create read update and
delete these are the basic operations
for working with data in MongoDB or in
any other database management system for
that matter to get started with some
simple crud operations it's easiest to
use the Mongo shell that ships with
MongoDB you should now have a working
installation of MongoDB let's start up
the Mongo DS server and then we can
launch the Mongo shell and connect if
you don't already have the server
running you'll want to launch it by
typing Mongo D at the command line so
here I'm going to do that in the
terminal utility on my Mac next I'll
launch the Mongo shell by typing Mongo
in another terminal window in the Mongo
shell I'm going to type help to see a
list of commands available note that
there are commands for show D B's and
show collections in MongoDB documents
are stored in collections collections
are organized into databases let's see
what databases are present in the
instance of MongoDB I just started up
there are two databases one called local
and another one called test the Mongo
shell is a fully functional MongoDB
client application all crud operations
are supported so to insert a document
into a collection we first need to know
how to specify that collection in a
command in MongoDB a collection in the
database that contains it form a
namespace so if we wanted to create a
database called video that contained
collections for say movies television
and actors the namespace video dot
movies would specify the movies
collection in the video database when
doing crud operations in the Mongo shell
we always work with a global variable
called DB this variable holds a
reference to the database we are
currently using to use a particular
database I can simply type use and the
name of whatever database
I'd like to use even if it doesn't
already exist if I use a database that
doesn't already exist
MongoDB will create the database for me
in a lazy fashion when I insert the
first
document into the first collection in
that database now let's create a single
movie document to do that we'll need to
use one of a few different commands
supported by the MongoDB query language
will discuss the MongoDB query language
in detail in a later chapter here we'll
just briefly introduce the insert one
command answer one was added to the
Mongo shell in MongoDB 3/2 so let's
finally create a document we can do so
with the following command and then we
simply need to specify a document to
insert since neither the video database
nor the movies collection existed prior
to us executing this command MongoDB
will create both and insert the document
the return value also a document by the
way indicates two things one that the
write was acknowledged meaning it
succeeded and what unique identifier was
assigned to the document in my go DB all
documents must have an underscore ID
field if no underscore ID field is
specified when a document is inserted
MongoDB will add the underscore ID field
note that we did not specify an
underscore ID field here this is an
additional value type supported by
Beeson MongoDB assigns a unique object
ID as the value of underscore ID object
ID is an additional value type supported
by beasts on each document within the
same collection must have a unique
underscore ID value the inserted ID
field of the returned document for
insert one tells us what object ID was
assigned as the value of the underscore
ID field for the document we inserted in
just a moment we'll look at reading
documents from a collection but before
we do let's insert a couple of
additional documents let's insert Mad
Max to the road warrior and will also
insert Raiders of the Lost Ark Raiders
was actually the first movie I ever saw
in the theater ok now let's read these
documents we've just created the command
we want to use here is find the fine
takes a number of optional parameters we
often use it to simply explore a
collection to see what it contains in
the MongoDB shell without passing any
parameters in the case of the movies
collection we can do that with this
command we can get more readable output
if we chained the pretty command with
find as I did here note here that the ID
field values for each document match the
value of the inserted ID field provided
in the return document for each insert
operation we perform so let's take a
look at jaws 5 6 8 a 1 you'll find a
similar match for this object ID and the
subject ID for each of the other movies
that we inserted the fine command we
specified here returned all documents in
the movies collection the real power of
find is in the rich language we have for
specifying selection criteria in a later
chapter we'll go into detail on the find
command query operators and other
parameters for now the takeaway I want
you to have is that at the heart of the
query language for MongoDB is a query by
example strategy as the first parameter
to find we can pass a document that
illustrates the shape of documents we
want to match with our query now our
initial find query is the same as if we
had issued find but passing this empty
document as the first parameter to find
based on the document passed as the
first parameter find will match all
documents that match all of the
constraints we specify if we don't
specify any constraints on what should
match all documents will match if
instead we wanted a query by title we
can do the following to query by year we
can do this note that in each case only
documents matching the constraints we
specified are returned both for a query
by title and the query by year one last
thing I want to mention before we move
on is that the return value of find is
not simply an array of documents it is
instead a cursor object you can see this
if we assign the return value of find to
a variable in the shell the shell is a
fully functional JavaScript interpreter
so we can do this just as we would in a
JavaScript program we can then use the
has net
and next methods of this cursor object
to iterate through the return documents
as follows as next returns true meaning
there is a document yet to be visited
via this cursor C dot next we'll grab
that document we know there are three
documents in this collection so we
expect to be able to call next three
times
there's Raiders of the Lost Ark now if I
call C dot has next we get a return
value of false meaning we've exhausted
the cursor now it's important to
understand cursors as you use the shell
and as you implement applications that
use find via one of the MongoDB drivers
you'll have a lot of opportunity to use
cursors as we move through this course
and we'll cover much much more in the
manga to be query language later but
with what we've covered in this lesson
you should be well prepared to insert
any type of document in the collection
and perform a few types of queries if
you're anxious to do more I'd encourage
you to experiment with what you know of
the MongoDB query language so far and
maybe even review the MongoDB
documentation for some hints on other
aspects of the query language

---