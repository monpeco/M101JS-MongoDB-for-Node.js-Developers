### find and cursors in node js

https://youtu.be/XCjpSq7H_G4

now we're going to talk about the no js'
driver and crud operations using MongoDB
you've already been using the Mongo
shell to do credits having them
converted to beasts on by the shell and
then sent to the Mongo D process which
is our running instance of the MongoDB
database this section is just going to
be about how to use the node J S driver
and what the crud interface is within
the driver let's work with a new data
set for these examples we'll also look
at how to import data into MongoDB using
another command so here I have a file of
startup company data from the TechCrunch
database called CrunchBase in case
you're not already familiar with it you
can find CrunchBase at CrunchBase comm
here you can find all sorts of details
about start-up companies such as what
rounds of funding they've gone through
so far who are the current executives
and so on now this file contains a dump
of more than 18,000 company records from
CrunchBase it contains one JSON object
per line to import this data into
MongoDB we can use a command called
Mongo import now rather than working
with a binary dump file as does Mongo
restore which you've already used Mongo
import allows us to import human
readable JSON into a specific database
and collection to import this data set
we'll type the following now there's
quite a bit of data there so it took a
second or two to import all of these
documents now let's check this in the
Mongo shell we can use the CrunchBase
database and now we can do a quick find
on the companies collection and we see
that we've got in fact that number of
Records just take a look and sure enough
here's one of the documents we'll take a
look at the structure of documents in
this collection in a little bit now
let's look at an example of using this
data set this program is an example of
using find with the nodejs driver will
quickly review this and then extend it
to cover some essential material about
using the node.js driver now the first
thing we have to do is make sure that we
have a reference to the driver as we do
here so we say for our Mongo client
require Mongo client the next thing we
do is connect to the database here now
you can look through the
for the format of the connection string
for things like a replica set or a
sharted cluster we discussed those more
advanced concepts in other lessons for
now we're just connecting to a single
mangodi now I know we've looked at
earlier examples of connecting to
MongoDB within the driver but let's make
sure we understand the components of the
connection string in particular the host
the port and the database I want to make
sure you realize that if we want to
connect to MongoDB running on a
different host say on a machine other
than your local computer we would need
to change local host to the name or IP
address of that host the port and
database are values that we'll see being
different as we move from one topic to
another throughout this course just give
you an example if we want to connect to
the video database I would need to
change this portion of the connection
string now let's do that and run now we
see that one of my assertions failed
because the number of documents returned
is now 0 let's go back to the code and
see where that happened ok that
assertion statement is right here I'm
expecting the documents lengths to be
greater than 0 this assertion fails
because I'm trying to find documents in
the company's collection however because
I'm connected to the video database no
such collection exists so let's change
our database back to CrunchBase save and
run this one more time and the results
we get back are as expected and again
we'll go through the code in a little
bit more detail just so we make sure we
understand what's happening here
before we do that I'd like to look first
at changing the port now by default when
I start a Mongo D it binds to port 2 701
7 we can see that with this example you
can see that the last statement the
Mongo D prints out when it starts up is
that it's waiting for connections on
port 2 701 7 so what happens here if I
change this port number to something
like 2 700 1 8 save and go back and run
my application again now I can see that
I'm getting a connection refused at
localhost 2 701 8 because there is no
Mongo D running at that port let me stop
this Mongo D
and started again but this time I'm
going to tell it to instead of running
on the default port go ahead and run it
to 701 8 and we can see that now it's
waiting for connections on to 701 8
which is the port we've specified here
in the connection string now let's
attempt to run this and there we have it
the application runs as expected
now I'll start this back up on the
default port and go back and change the
connection string so that it references
the default port again check to make
sure we're running and sure enough we're
all set while for single node
deployments of MongoDB as we've been
looking at we'll continue to use the
default port when we discuss replica
sets and charted clusters we'll see that
we have to have mangodi processes
running on several different ports on a
machine as part of a cluster of
processes that support and scale our
read and write operations now let's talk
a little bit more about this application
so as we've seen before we're using the
DB handle passed into the callback from
making a connection to the database
doing a find query on the company's
collection and with the cursor we get
back from find we're calling the - array
method which of course will consume the
cursor and hand the callback function we
specify here an array of documents on
success or an error if something went
wrong then we've got a couple of
assertions here one to make sure that
there was no error and the second one as
we've already seen to make sure that we
got more than zero documents back
finally what we're doing here is using
the for each method for this array
object and in the callback for for each
we're printing out whatever the name of
our dock is each time through is a
whatever the category code is of the
document this is a field of documents in
the collection that tells us what type
of company a particular company is and
finally concatenated on just the word
company so that we get output that looks
like this for every company in our
company's database that matches this
query we're printing out a message for
example no vyses is a biotech company so
why did we get that well let's take a
look at what query we're passing so what
I'm doing here and what I'll do for most
of the exercises in this section is
we'll construct a query document and
will actually pass that object on to
find or
or whatever method were using to
interact with the database as a means of
separating the task of constructing the
query from actually issuing the query
itself okay so in this case our query
says give me all documents where the
category code field is equal to the
string biotech and as I said category
code is merely a way that documents are
classified within this collection so in
this for each each document in turn will
print its name its category code as a
verification that in fact we are
matching only biotech companies and so
we end up with results that look like
this now let's discuss in detail the use
of cursors in the nodejs driver we've
talked about cursors before but I want
to take a little bit of a deeper dive to
discuss a couple of issues that are of
particular relevance when we're using a
driver as opposed to the Mongo shell
this is a slightly different version of
the application we just looked at note
that we have a call to the find method
here but don't give it a callback
remember that find returns a cursor and
here we're assigning the value returned
from find the cursor to a variable as we
discuss in other lessons chaining a call
to the to array method onto a call to
find as we did here in the initial
version of this application consumes the
cursor and gives us an array of
documents we can work with with code
written this way instead of consuming
everything at once and pulling it all in
to memory we're streaming the data to
our application fine can create the
cursor immediately because it doesn't
actually make a request to the database
until we try to use some of the
documents it will provide the point of
the cursor is just to describe our query
in the initial version of this
application it was to array that
provided the need to actually retrieve
documents from the database when we did
that to a rake all the driver said okay
the client app is actually looking for
all the documents and wants them back in
an array so I'll actually have to go
execute the query in this case we
haven't actually asked for anything yet
so it can just make the cursor object
and return it now cursor objects provide
a for each method note that this is not
the for each method on arrays because
we're dealing with the cursor here as
opposed to an array object in the form
of this method that is to say what
arguments it expects are different the
cursor for each method expects as its
first argument a callback for iterating
through the documents it will call this
callback one time for each document in
the result set
the second argument two cursors for each
method is what to do when the cursor is
exhausted or in the case of an error
when we call the for each method here as
with two array this is an indication to
the driver that needs to actually go get
us some documents now let's just run
this and instead of running app this
time we're going to run our app explicit
cursor and we get the same set of
results the difference is that with the
code written this way we're streaming
the documents into the application as we
need them as we need them here is
defined by how this callback works and
all we're really doing here is printing
them out one at a time now to wrap up
this discussion I just want to remind
you that when the cursor requests
documents from MongoDB triggered by
something like the cursor method to
array or the cursor method for each the
response from the database system isn't
necessarily the entire result set so
consider a situation where you have a
massive database with many many
documents and you don't actually want to
return the whole set of documents all at
once what actually happens is that when
the cursor has to go off and get some
documents say because we called for each
MongoDB will return a batch of documents
up to a certain batch size so in this
example when the cursor gets back that
first batch of results it can actually
start passing documents to the callback
we've handed for each here once that
initial batch runs out the cursor can
make another request to get the next
batch and once that batch runs out can
make another request and so on until it
reaches the end of the result set now
this works very nicely with a method
like for each because we can process
documents as they come in in successive
batches contrast this was to array where
the callback doesn't get called until
all documents have been retrieved from
the database system and
the entire array is built which means
you're not getting any advantage from
the fact that the driver and database
system are working together to batch
results to your application now batching
is meant to provide some efficiency in
terms of memory overhead an execution
time so take advantage of it if you can
in your applications


---

### crunchbase dataset

https://youtu.be/pdun3EPqwDs


now what I'd like to do is walk through
this CrunchBase data that we're going to
be looking at over the course of the
next several lessons I want to make sure
we have a pretty good feel for what
fields documents in this collection
contain and the values for those fields
now here's an example document that I
pulled from the company's collection
this is the record for face book now the
reason why I chose to look at this
document it's because as you're aware
documents in a MongoDB collection need
not all have exactly the same set of
fields and in this particular collection
companies that are younger or have had
less success or simply less activity for
whatever reason may be missing fields or
values that the records for more
prolific companies may contain so the
face book record has a nice
representation of all of the fields
you're likely to encounter in this data
set so the first thing to note is that
there is a name for the company and a
permalink now the permalink is a unique
identifier of sorts in the sense that
using this root we can always find the
web page that represents this company by
using this permalink there's also of
course an underscore ID for every record
in this collection and the underscore ID
is an object ID value for every document
now you'll also notice that there are
URLs that pertain to the company itself
some mention of the number of employees
the eart was founded as well as month
and day and I should also point out that
the most recent records in this data set
are about two years old this is a big
dump of CrunchBase that was pulled some
time ago before they put in place the
API that they now have I'm using this
data set because it's already been
curated somewhat and cleaned up a little
bit so we're not likely to run into too
many problems using it there are some
fields in this data set that are very
crunchbase specific these dead pool
fields reference a particular section on
CrunchBase for companies that fall into
what they call their dead pool and the
dead pool as you might imagine our
companies that are closing have been
acquired and shut down or something of
that nature these documents contain a
list of tags
some contact information a very brief
description of the company and the space
that it's in and then there's an
overview field which is depending on the
company anywhere from a sentence to
several paragraphs on what the company
is what business they're in etc now a
couple of the fields I'd like to drive
into our relationships competitions and
a couple of the others that are here
let's look at relationships
essentially relationships identifies
people who have played one role or
another in the company typically these
are executives listed and for every one
of these entries in this relationships
array there is an is passed field and if
it's false that indicates that at the
time this record was last updated this
person either still had the title or did
not is past being false indicates that
Mark Zuckerberg still has these titles
and as we scroll through here we can see
that the relationships array has a great
many entries for Facebook as it does for
a lot of these companies now I want to
pause here for a moment just to make
sure we understand the structure now
relationships is a top-level key meaning
that it's not within a nested document
the value of relationships is an array
and the elements within that array are
documents that represent a brief summary
of a person each of those elements has a
nested document within it that specifies
the first name last name and a permalink
for the individual again this being a
unique identifier across CrunchBase for
Mark Zuckerberg or anyone else in this
array or a similar array for another
company okay so that's relationships
let's look at competitions this is
really a list of competitors similar in
structure to relationships provider
ships is a list of companies that have
provided services for in this case
Facebook again similar structure to what
we saw for relationships and for
competitions funding rounds is
interesting lots of detail here in terms
of what was raised when it was raised
and from whom it was raised and
typically there's also a link to an
article that talks about the round of
funding with a bit of a description
often the title of the art
we can also look at offices and here
we'll find the address what type of
office whether its headquarters or just
a satellite office for every office that
the company maintains and then the last
field I wanted to look at is this
milestones field so milestones is
essentially a chronology or timeline of
major events in the lifetime of the
company and a lot of the ones for
facebook
as you can see from what we've scrolled
through here have to do with numbers of
users for Facebook and here's another
one so with each of these milestones
there's typically an article there is a
year month and day called The Stoned
year stone month stone day and the
source description field that contains a
title or a brief summary of the event
and typically these two were linked
together this being a description of the
article that's here and actually though
I said milestones it was the last field
I wanted to talk about I'd actually also
like to talk about IPO now given the
number of records in this collection
there aren't actually that many
relatively speaking that have gone to
IPO but of course Facebook has and so
here with the IPO record we have an
embedded document that describes the
valuation amount at the time the IPO
occurred when the IPO occurred and what
the stock symbol is okay so that gives
you a nice overview of the fields in the
company documents in our collection and
what I've tried to do here is point out
some of the fields that we'll be working
with as we look at using the no js'
driver to do more and more with MongoDB
Inglés (generados automáticamente)


