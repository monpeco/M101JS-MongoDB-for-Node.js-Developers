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


---

# queryOperatorsInNodeJSDriver

https://youtu.be/b39cyy75Lbs

so it last it's time to take a look at
more programmatic access to MongoDB
through the nodejs driver and what I
mean by that is we're gonna begin to
look at using the driver for
applications that respond to input and
query MongoDB accordingly rather than
simply passing along some sort of static
query document or projection document
that we've hard-coded in so what I'd
like to look at here is a simple
application that will take command-line
parameters and query MongoDB differently
depending on what we've specified as
options on the command line this is the
type of thing we might do in a web-based
application or some other type of
application but allows us to focus on
the driver and it's interaction with
MongoDB without too many additional
packages and details
one additional NPM package we are using
here is command-line arts and this gives
us a nice convenient way of dealing with
arguments passed to our application on
the command line so here we're requiring
that package it's also in the package
JSON file that will accompany this
handout and here we'll create this
command-line arts function that will
allow us to pull in the options from the
command-line before we do anything let's
try to run this now our attempt to run
this prints out this usage message
saying first two options below are
required the restoration --all the
intention of this application is that we
can actually pass a few arguments into
this application and use these values
we've passed in to create queries to
MongoDB through the driver let's go see
how options are parsed and where this
message comes from in the app okay
so what I've done is written this
commandlineoptions function and it uses
the command line Argan that we got from
our import of the command line arcs
package now what we've done here is
defined the command line arguments that
this particular application will accept
first year last year and employees these
we will use to specify a range of years
or founding years or starting years of a
company with which we'll query our
company's collection and a number of
employees value we've also specified a
one letter alias for each of these to
make it more convenient when
constructing a call and passing in these
parameters note that what we'll end up
with here is is something much
like what we saw with mango import where
we specified the database in collection
where we wanted to import our company's
data using - D and - C respectively in
this case we're looking at designators
for the first year last year and
employees command-line arguments now
this method of constructing command-line
arguments is defined by the command-line
arts package for more detail on the
semantics of this I encourage you to
look at the documentation within the NPM
repository the last thing I'll mention
here though is that we are stipulating
that each one of these command-line
arguments should be a number the reason
for that is because when they're typed
on the command line even though we may
be typing a series of digits we could
conceivably pull them in as a string
basically this tells the command-line
arts package how to parse them and what
type they should be cast to in order to
ensure that we can use them as desired
within our application this command line
are call gives us then an object on
which we can call methods so this
constructor creates a CLI object with a
parse method that parse method then will
parse everything that we've typed in on
the command line let's go actually enter
some command line parameters so instead
of just node fjs I'll actually enter a
value for first year let's say 2004
value for last year 2008 and a number of
employees and for this let's do 100 the
intention of this application is that
it's going to query MongoDB for all
records where the year in which the
company was founded falls in the range
2004 to 2008 inclusive of those two end
points and where the number of employees
is less than 100 before we run it let's
go back to our application and just
finish off this discussion of how the
arguments are parsed the results of
having called parse is passed to this
options variable now options is merely
an object and there will be one field
created within that object for each one
of the values specified here so for
first year last year and employees even
though we're just using the alias in
each of these places the way we'll
reference each of those values in this
options object is by the full name so
this line here and forces the
requirement that first year in last year
always be present in the command line
arcs pass to this application if they're
not that's when this usage message gets
printed out that we saw here the reason
that was printed out was because there
was no first year and there was no last
year from this call to fjs finally if we
make it past this then I simply return
the options object so where does this
call happen happens right here options
will be set here in the global context
and then I go and make my connection to
the database note that I don't bother
making a connection to the database
until this function returns this
function will only return if this
condition does not hold and we don't
need to print the usage message and then
just exit if we get past this check here
then we'll return options and we know
we've got a good set of command line
options and can go ahead and create our
connection and get started with what
this application does okay so now let's
go ahead and run it and what I'm going
to do first is just demonstrate that
check I'm still getting my message now
what if I just do e nope not good enough
how about if I now do a first year and a
last year and there we have it I see
results and in fact I've got almost 8000
results let's go ahead and add that
employee's parameter now and now we can
see we've significantly reduced the
number of results so what's happening
here is we're doing a query using these
values that we've entered again
specifying a range on the year in which
the company was founded and a number of
employees cap so looking for all
documents that match this these
constraints and we're printing them out
here or at least we're printing a
projection of them out here
I'm also displaying what query was
actually sent to the database you can
see here that founded year is being
queried for a range 2004 to 2008
inclusive of those two years and number
of employees greater than 100
I actually misspoke earlier I believe I
said this value specifies a cap on the
number of employees in fact in this
particular application it specifies a
minimum number of employees ok so that's
why we're seeing the query come out the
way it did here all right so now let's
go back into our app and take a look at
how all this works there's a call to a
function called query document here and
note that we're passing those
command-line options that object that
contains all of our command line
options or command-line arguments and
what we get back is this value query
that we end up passing to find here
we're building our projection document
and doing so statically we'll look at a
couple of examples a little bit later on
where we build a projection object
programmatically as well okay so we pass
the query in the projection here to find
making the call synchronously just
getting the cursor back okay and then
we're tracking number of matches here
now before we go any further let's go
take a look at how our query document is
being built what's happening here is
that I'm constructing a query object
here I'm doing so using the options that
were passed in on the command line so
I'm accessing this options object that
was passed in remember we passed it in
to the query document function you can
see here that I'm building the query
object by specifying founded year if we
take a look back at our Facebook example
we can see that founded years it's a
top-level key as you might imagine
specifies the year in which the company
was founded so what I'm doing then is
I'm saying okay founded year in my query
object that I'm building up here has a
value that is itself an object okay
remember in the parlance of JavaScript
using this type of syntax or this type
of syntax here which amounts to the same
thing is how we go about constructing
objects these things are objects in
JavaScript and these are the things that
we are interacting with or that we call
documents in a MongoDB context it just
turns out that because we're working
with JavaScript these objects end up
looking a lot like documents that we
interact with through the Mongo shell
and generally when we talk about Mongo
DB schema remember that JSON actually is
an acronym for JavaScript object
notation this object that we're
constructing is the value for founded
here this object or document that we're
constructing as the value for the
founded year field has two fields within
it the key for the first field is this
dollar gte if you'll remember that is a
query operator and the second one is
dollar l2e by stipulating as the values
for each of these keys the first year in
the last year respectively we construct
this range right here and
note that this is one reason why the
query language works the way it does so
I can specify a field and then use query
operators to specify a range the next
piece here in this query document
function is where we're dealing with the
employees parameter passed here whatever
that value is now remember that we don't
need to specify an employee's value here
the first thing that we're doing is
we're checking to see whether this key
employees is in fact in the options
object that was passed in this is the
syntax we used for checking for the
existence of a key in an object in
JavaScript we use this in operator if
employees is in fact in options that
means that on the call to this run of
the application the user did in fact
specify a value for employees so we need
to build that into our query document in
building it in we're going to use the
GTE operator and we're going to access
that employee's value much in the same
way we did the first year and last year
we're using a different syntax here
though in order to set this property of
the object or in order to assign this
value to the number of employees field
within this object the reason why we can
do this is we've already got this query
object that we constructed here
javascript allows us to use a dot
notation to reference properties of an
object or field names and I can use an
assignment statement to specify that
number of employees should have the
value that results from constructing
this object or document now I'll point
out that the only reason why we're doing
this as a second step is because
employees is optional we may not in fact
have a value here if we did we could do
something like this and be done with it
now the problem here is that I've
actually put this in the wrong place
it's not actually part of the embedded
document for founded year rather it
would go here and now the end result of
doing this would have exactly the same
effect as this and we could set up our
query document this way if we were
guaranteed that employees would always
be there as a command-line argument it's
not and I did that on purpose so that I
could show you this alternate syntax but
I want you to understand that the end
result of doing this followed by this
and Subang there is an employee's value
passed
the command line is exactly the same as
if we had constructed our query object
this way let's run this both with
employees and take a look at the object
that gets constructed so founded year
with that nested document number of
employees with it's nested document just
specifying one end of a range okay and
then take a look at a run without
specifying employees and we can see that
all we have in our query document is
arranged for founded year okay so now
let's close off our discussion of this
application by just running through
what's left here in the main body of the
code here we've talked about how we get
the command-line options and how we use
those options to construct a query
document you can see here how we're
specifying the projection document note
that we're excluding underscore ID but
including the name of the company the
founded year the number of employees and
the CrunchBase URL everything else is
excluded we call find synchronously
passing the query object and the
projection object or a query document in
projection document and with that cursor
then we call the for each method on the
cursor now again remember that for each
takes two functions as parameters the
first function is the one that's used to
iterate through the documents the second
function is the one that gets called if
there's an error or when the cursor has
been exhausted this gives us a way of
doing some cleanup or some other exit
sort of work that we'd like to do when
the cursor is exhausted in the iteration
through the documents matching our query
I'm keeping a count of the number of
documents that matched note that we
initialize that variable here and set it
to zero this variable is in scope for
this callback and then when the cursor
is exhausted and we hit this function
here for each we'll take care of calling
this call back for us we simply check to
see whether there was an error and
finally print out those last two
messages we saw one being whatever the
query object was and then the number of
documents that matched based on discount
that we maintained here and finally we
close the database and exit our program
so the last piece to explain here is
just this JSON dot stringify is a
convenience method that allows us to
pass an object this method will generate
a string representation of this object
now there's just one more thing that I
want to show you here and that is if
instead I don't exclude underscore ID
let's take a look at what our output
looks like this is a minor point but
something I want to call your attention
to because
you're gonna see it and you're gonna
wonder underscore ID if we take a look
at how it prints out we see that this is
just a big hex string but it does look a
little bit different from what we're
used to seeing in the Mongo shell so if
I go to the Mongo shell and do a query
where I look at only underscore ID
values as you remember we always have
this representation of the object ID
note that it's got the word object ID
with parens enclosing something that
looks very much like what we're seeing
here and here and here there is no
difference in terms of the value type
itself the only difference is in how the
shell chooses to stringify or create a
string representation for object IDs and
how JavaScript or the nodejs driver
chooses to stringify object ID values
this is just a printed version of an
object ID from the nodejs driver and
this is a printed version from the Mongo
shell same value types just a different
way of printing them out that wraps up
our first look at doing things a little
bit more programmatically within a
MongoDB nodejs application and along the
way we looked at using some query
operators and how to construct query
objects from variable values within our
application


---

### regexInNodeJSDriver

https://youtu.be/JOzJcUVK-RY


now I'd like to take a look at the use
of regular expressions using the dollar
regex operator in the nodejs driver now
regular expressions are handy as a
quick-and-dirty means of searching
string valued fields such as say tag
list or overview here for particular
words phrases more complicated regular
expressions of one kind or another if
you wanted to do something search engine
like we'd recommend that you use a text
index for full text search capability
but in many cases being able to search
text fields using regular expressions
it's a great way to explore your data
and even support some simple use cases
in production here we're going to use
the dollar regex operator in a simple
application as a means of exploring our
data set a little bit we're going to use
the same mechanism we've been working
with supplying command line parameters
to our application here we're going to
look at a very simple application that
is only taking a regular expression on
the command line so let's look at our
app so the structure is very similar to
the kinds of applications we've been
looking at as we are taking our deeper
dive into the nodejs driver if we scroll
down we can see that we're specifying
exactly one command line argument with
that command line parameter coming in
for a regular expression we need a way
of adding it to our query document so
using this mechanism that we've seen
previously if overview was passed in two
options then we're going to set the
overview key in our query object to have
a value that is this document and that
document has two fields one has the key
dollar regex with whatever value we
specified on the command line as the
value of the regular expression will
simply specify a string representation
of a regular expression there in the
command line and that's what we'll end
up as the value here we also have a
second field here and that's because I
want to ensure that this query is
executed in a case insensitive manner
meaning that a capital a is treated the
same as a lowercase a for all characters
we match against so the way I do that is
by using the dollar options operator and
dollar options is designed to be used
with dollar regex and I simply specify a
lowercase I here this indicates to
mongodb that I want to do case
insensitive matching okay now one more
thing I want to point out about this
application is that I've created a
projection document function
here will be passing in options and here
I'm creating my projection document and
returning it you might wonder why I'm
actually checking to see whether there
is an overview option because as we saw
when we attempted to run this without a
dash oh I got my usage message the
reason why I implemented the query
document function and the projection
document function the way I did is
because we're going to extend this a
little bit and in that case it's going
to be much simpler if we simply build on
to what we have here what I haven't
mentioned yet is exactly what we're
going to be searching against in our
company's collection as we look for this
regular expression as you might have
guessed from the field naming here we
are going to be searching for the
regular expression supplied on the
command line in the overview field of
documents in this collection let's run
this and what I'm going to specify as my
regular expression as actually just a
simple phrase this is not a class about
regular expressions there's a lot of
power and regular expressions but what
I'm trying to demonstrate here is a way
that we can simply explore text fields
within our collections using the dollar
regex operator the semantics of this
when it's applied in our query document
are that we will look for this phrase
note that these two words are separated
by a single space anywhere within the
text that makes up the value for the
overview field for documents in our
collection so let's run it and if we
take a look through the results that we
get back we can see we've got a company
called gross domestic product and here
we can see that personal finance appears
right here so again as I said our
regular expression simply needs to match
somewhere in the overview text likewise
if we scroll up we see mint com this is
a company you may be familiar with and
we can see that right here mints
overview uses the phrase personal
finance that's a simple example of using
the regex operator in the nodejs driver
now let's look at a slightly more
complicated example and here for this
application we are going to add the
ability to search either the overview
field or the milestones field and now
our options are dash 0 if we want our
regular expression to be matched against
the overview field and dash mne if we
want to match against the milestones
feel let's just remind ourselves what
the milestones field looks like so going
back to our Facebook example if we
scroll down to milestones we can see
that there are actually several text
fields we're reminded that milestones is
an array field and the elements of the
array are embedded documents the
are a number of text fields in these
milestones documents the one that we're
going to be matching against is this one
the source description here you can
begin to formulate in your head what our
query document has to look like we're
going to have to use some dot notation
and specify milestones dot source
description because MongoDB creates keys
for all elements in array valued fields
when it stores documents we can use a
very simple dot notation expression
milestones that source description in
order to match our regular expression
using the dollar regex operator so now
let's look at how we've implemented that
so as I mentioned we're going to extend
our query document function and we're
also going to extend our projection
document function right so let's look at
the query document one first we've set
up our command line parameters so that I
can specify one or the other or both the
example we'll look at here is simply
searching against milestones as an
alternative to overview as we specified
before this is where we specify the
value of the overview key in our query
document to do something similar for
milestones we need to use this array
indexing syntax because we're using dot
notation here so we enclose milestones
dot source underscore description in
double quotes this stipulates that for
our query object we want to set the
value for a key defined as milestones
dot source underscore description and
then we set the value using the dollar
regex operator here we're using the
regular expression that was passed in as
the value for our milestones
command-line argument and again
specifying that we want to do a
case-insensitive match based on the
discussion in earlier lessons where we
went into this type of setup in greater
detail it should be clear to you what's
going on here now I want to point out
that we're performing something that's
analogous to what we did in the query
document function here in the projection
document function if you'll remember
from our previous implementation the
implementation for the projection
document function in the application we
looked at at the beginning of this
lesson we simply built an object here
using javascript object notation and
handed that back as our projection
document in this application because if
it's possible to have an overview field
or a milestones field or both we have to
check to see whether overview is in the
command line options it was passed in
and if it is then we want to make sure
that we're including that field in the
values that we project out likewise with
milestones if
milestones was specified in our command
line options then we want to make sure
that the milestones dot source
underscore description field is included
in documents that are returned from the
database looking at the main body of the
application there's nothing different
here from the applications that we've
been looking at with one exception and
that is now we're calling a projection
document function to build up the
projection document that we then send to
the project cursor method so let's run
this app everybody want to look for
again remember the milestones which are
important moments in the history of a
company is the following regular
expression note that i'm enclosing this
regular expression in quotes as i did
when we looked for personal finance and
here i want to look for two words in
succession but they might be separated
by a couple of other words so the tumors
I'm interested in are billion and
valuation but it's unlikely that this
phrase will appear I might see
billion-dollar valuation I might see a
number of ways of expressing this notion
of a company having a valuation that's
measured in billions of dollars or some
other currency using some regular
expression syntax I can specify that I
want to see the word billion followed at
some point in the text by the word
valuation in between there can be any
number of characters and in fact to be
more precise since this would actually
match this expression I should really
say dot plus which means there must be
at least one character separating the
word billion from the word valuation for
example a space character again this is
a very coarse-grained means of searching
within text fields but a very powerful
and handy tool to have one we're
exploring collections again remember
that milestones is an array and so there
are many documents within that array
that contain a source description field
and in matching against that field I
only need to find one document that
matches my regular expression for each
document returned to me here's square
founded in 2009 here are all the
milestones that were listed here we have
the word billion again remember i'm
doing case insensitive search separated
by space dollar space and then valuation
so here is at least one place where the
document foursquare matched my query and
now air B&B; this is kind of an
interesting example of a match it's not
something I would have imagined but
certainly makes sense so here I've got
the word billion separated from the word
valuation by a plus character and a
space and then for livingsocial here
are a very simple match where I've got
billion space valuation so you can see
the variety of different types of
matches that this regular expression can
have and this hints at the real power
and value of the dollar regex operator
and the kinds of things that we can do
with it if you're interested I encourage
you to take a look at a regular
expression tutorial any of a variety of
regular expression tutorials available
online little googling will get you
where you need to be MongoDB supports
perl-compatible regular expressions the
perl programming language kind of
defines the standard for regular
expressions because they are first-class
entities in that language and MongoDB
supports the syntax and operations for
those regular expressions
