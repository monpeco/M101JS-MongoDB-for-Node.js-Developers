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

Tags: [Text Indexes](https://docs.mongodb.com/manual/core/index-text/)


---

### dot notation in node js

https://youtu.be/vHpW3l0wOmA

okay so we've come quite a long way in
our understanding of the mongo DB query
language let's take a look now at using
dot notation in the node j s driver and
will do this by extending our
application where we pass command-line
arguments on to our app and build
queries based on those arguments so here
we're going to add an option for
querying with respect to an IPO if you
remember when we walked through our
example document there's a top-level IPO
field and the IPO field has as its value
in embedded document including entries
for valuation amount currency when the
IPO happened and the stock symbol so
we're going to use that data to extend
the flexibility of our application in
terms of the types of queries that we
can do with it so if you remember we
take our command line options and pass
them to our query document function
where we build the query document that
we passed along to find taking a look at
our query document function we can see
that there's now a little bit of
additional code for dealing with IPO but
before we look at that I want to show
you that we've added now an entry to the
acceptable command line argh stipulating
IPO is a name with the alias I the type
being string okay so with this entry
here parse well now look for a
command-line argument for IPO and if it
finds one make it part of the options
object that it creates okay so
everything in our query document
function is the same up to this point so
now let's take a look at how we deal
with IPO now just to make things a
little bit more interesting this IPO
parameter allows us to specify yes or no
as the value for the parameter so on the
command line here I can specify shy and
yes or dash I and no okay and you see
that it get very different numbers of
matching documents and I can also leave
it off or rather than do both employees
and IPO I can leave off employees and
use the IPO parameter with either yes or
no specified there okay so what
of the semantics for this particular
parameter well if the user specifies yes
as the value for the IPO command-line
argument then that means we want to
query for documents where the valuation
amount for IPO is a field that exists
and is not equal to null okay so where
this field exists and has an actual
value as opposed to just being set to
know if no is specified then we're
looking only for documents where there
is no evaluation amount specified now
that can happen in one of two ways
either the value for this field can be
set to null or it can simply not exist
okay now at a higher level what we're
saying here is if I specify yes for IPO
then I only want to see companies that
have gone to IPO if you're not familiar
with the term IPO IPO stands for initial
public offering if I specify know that
means i want to see only companies that
have not had an IPO and finally if I
leave off this option altogether so do
something like this or like this then
I'm saying I don't care show me
companies that have gone to IPO and
those that haven't either way is fine
now let's take a look at the syntax that
we use for amending our query document
and then also exactly what we're using
as the portion of the query document
that pertains to IPO okay so again we
initially constructed our query document
using this syntax okay this is exactly
the same thing as doing something like
this okay exactly the same however it's
more common to write this this way in
our code because it's far more readable
okay so once this statement is done we
will have an object with one property or
field founded underscore year whose
value is another object with two fields
one with a key dollar GTE and another
with the key dollar LTE then if there is
an employee's value specified on the
command line we will add another field
to our query document using this syntax
specifying that we only want to see
documents with a number of employees
greater than or equal to whatever was
specified as
number of employees on the command line
in this last case that number was 100
okay and then finally here what we're
doing is we're using dot notation to
specify something about the valuation
amount for the IPO embedded document
okay so first let's take a look at what
this looks like in terms of the query
that gets constructed here we see our
range for the year in which the company
was founded our one ended range for a
number of employees and then finally we
see IPO dot valuation underscore amount
okay so here we're using dot notation to
reach into this nested document here and
take a look at the value of IPO dot
valuation amount for all documents in
our collection and what we're saying
here is I only want to see documents
where IPO that valuation amount is a
field that exists and remember this is
an implicit and here are not equal to
null so where the IPO valuation amount
field exists and where its value is not
null so let's contrast that with
entering no is our value we're here
again using dot notation but now just
specifying null as the value for IPO dot
valuation amount okay meaning that I
only want to see documents where the IPO
dot valuation amount is either set to
null or it doesn't exist at all that's
the semantics of specifying null as a
field value in a query document as we've
done here are there any questions if so
i encourage you to hit the forums and
ask for any clarification you may need
about what we're doing here okay now the
last thing that i want to touch on is
how we're setting the query document
value for this IPO debt valuation amount
ok we have represented here essentially
the three different ways in which i can
set field values in javascript objects I
can use this very explicit convenience
index here something that looks very
much like how we construct JSON objects
in the mango shell I can use this dotted
syntax on the query object itself
accessing a property of that field and
assigning a value to that property I can
also access
my JavaScript object as if it were an
array now in JavaScript objects
effectively are arrays they're
associative arrays basically being a
list of key value pairs so I can specify
the key that I'm interested in inside
square brackets much like I could if I
were indexing into an array using a 0 or
1 2 and so on whatever the index value
was I was interested in in this case I'm
actually interested in a field for which
I'm going to designate this string as a
key IPO dot valuation underscore amount
okay the end result there then for a
call to this application like this is
that I will have a query object that has
a founded year field an employee's field
and an IPO that valuation amount field
okay the value for my founded year field
will be this embedded or nested document
the value for my IPO dot valuation
amount if I specified yes for IPO on the
command line will be this embedded
document which essentially specifies two
constraints on the IPO debt valuation
amount field and in the case where I
specified no on the command line the
value for IPO that valuation amount will
simply be null and that's how I arrived
at query documents that look like this
or which look like this so in
constructing your queries within
JavaScript using the nodejs driver we
simply use standard techniques used in
JavaScript to create and assign values
to JavaScript objects there are three
primary ways in which we can do this one
using this convenience syntax using
curly braces another being this means of
referencing a field of an object using a
dot much in the same way that we would
reference a method of an object using a
dot and then finally we can access
fields within an object in JavaScript
using this array like syntax so this
provides us with a nice example of using
dot notation in the nodejs driver and
provides a nice meaty example for some
of the things we can do in terms of
taking an input and using that input to
query MongoDB


---

### dot notation on embedded documents in arrays in node js

https://youtu.be/nYcV-N3QlBk


continuing our discussion of dot
notation in the nodejs driver I'd like
to look at one more example in this case
using dot notation to access documents
that are embedded as elements of an
array field so going back to our
Facebook example you'll remember that
there is an offices field okay and as we
discuss offices is an array field where
each element in the array describes one
of the company offices it's sometimes
interesting to see what companies have
offices in which countries so this
particular document indicates that
Facebook has offices in California in
Dublin Ireland and in New York so what
I'd like to do is demonstrate using dot
notation to allow us to query for
companies who have offices in a
particular country so we'll have to use
dot notation to access the offices dot
country code field in order to do that
now the reason why we can use dot
notation in this case a way to think
about it is that for every element in an
array MongoDB essentially conceives of
the data as if there were a separate
document in this case a document
representing all of the facebook data
for each one of these entries here so
it's very much like there is a facebook
document that has an offices field that
has a single embedded document for the
menlo park office and then there's a
completely separate facebook document
that has a a single embedded document
for the ireland office now in point of
fact that's not actually how MongoDB
works but that's a good mental model to
keep with you as you think about using
dot notation to reach into embedded
documents like this that is documents
that are embedded within a raise so
going back to our application here's an
updated version of our command line app
and here in our query document function
in addition to dealing with founded year
employees and IPO we're now dealing with
country and I can specify country on the
command line using this see alias in
this case I want to query for all
companies founded
between 2004 and 2008 with more than 100
employees who have an office in Ireland
how am I going to do that well similar
to the way we use dot notation here I'm
going to use that notation here to add
yet another field to our query document
I'm going to take the value for country
as specified on the command line and I'm
going to assign it to the offices dot
country code field offices dot country
code okay so running this okay we can
see we got five matching documents our
query document has a range for founded
year number of employees is greater than
100 and we've stipulated offices that
country code of IRL or Ireland ok now
the output looks a little interesting
let's talk about that in order to do
that we need to go look at our
projection document within our
application ok so our projection
document says exclude underscore ID
include name include offices dat country
code and IPO dot valuation amount ok so
by including offices that country code
we're saying for the offices array make
sure you include in the output the
country code field the semantics of that
in MongoDB are that for every element
within the offices array field I will
get country codes print it out okay and
what's valuable to us in this case is
that not only do I get to see for each
company in this case FleetMatics that
yes they do in fact have an office in
Ireland but I also get to see other
countries in which they have offices in
fact I can see here that there are
actually five different offices in the
US and this company here populace has
offices in both Ireland and Italy
central reservations in Ireland and
Spain and of course Dropbox with offices
in the US and Ireland okay so you can
use that notation to specify fields
within embedded documents you can also
use dot notation to identify fields
within documents that are embedded
within a raise and again that's because
MongoDB essentially treats each one of
these entries and embedded documents in
other arrays as if there were multiple
copies of this document
chipwich had a single document like this
as an embedded document value for this
offices field

---

### sortSkipLimitInNodeJSDriver

https://youtu.be/l4D7n0ntD9Y

now when we're retrieving documents from
a MongoDB collection it's often the case
that we would like the database to
support us in paging through the results
now here I'm not talking about batching
but rather think about the search
engines you've used or a site like
Amazon where you do a search for a
product and you get back a number of
pages of results to support something
like that we don't want to render the
entire result set on a page because that
would take too long and for a variety of
other reasons but databases in general
are designed to support that kind of
paging mechanism first of all it's
important to be able to specify a sort
on the results of my query I may be
sorting by year price or some other
feature of my results and then as I move
to page two that's likely implemented by
another query to the database where I'm
skipping say the first 10 results and
just taking the second 10 likewise I may
simply limit altogether because I may
have millions and millions of records in
my collection I may simply want to limit
the number of documents that the
database will hand back to me to some
reasonable number that my app is
prepared to deal with maybe perhaps
several hundred thousands or maybe even
tens of thousands because these concepts
of skipping limiting and sorting our
most important when we're building
MongoDB applications we're going to talk
about them now in conjunction with the
nodejs driver so the first one I'd like
to look at is sort okay so here we have
a version of the application that we've
been looking at throughout our
discussion of the nodejs driver and this
application takes command line
parameters for first year last year and
employees allowing us to specify a range
of years in which a company and our
collection was founded and a minimum
number of employees for companies that
we'd like to see returned so just remind
ourselves how this application works
let's go ahead and run it the one we're
interested in running is app dash sort
and I'll get my expected usage message
so now let's actually specify command
line parameters here for first year i'm
going to use 2006 for last year 2009 and
for number of employees 100 I do my
query 200 for total documents and you
can see that the years founded 2006 2008
2007 2008 2009 and so on as I scroll
back through I set up the output here a
little bit so that we can more easily
see when our sort takes effect note that
we're printing the name of the company
and
and what year it was founded and finally
the number of employees now let's go
back to the app and actually impose a
sort and the cool thing about sort skip
and limit beyond the functionality they
provide to us is that in the node.js
driver these are cursor methods that we
can simply chain on to our existing
cursor object much in the same way that
we did with project let's take a look at
sorting our results now by founded here
okay so let me talk about the syntax of
this briefly to sort we use the same
syntax we use for just about everything
else with regard to the mongo DB query
language in that we specify a document
and for sorting we specify the field to
sort on and one if we want to sort in a
sending order so 2006 2007 2008 2009
versus if we specified minus one then we
would sort into descending order so
larger values would occur first 2009
2008 2007 and so on okay so we create
our cursor object with a call to find
then we specify a project document on
that cursor and finally a sort now it's
still the case that not until we call
this for each here that the driver
actually says oh I better go get some
documents from the database instead it's
building up its representation of our
query here in this cursor object as we
make additional cursor method calls
adding additional detail to the command
that we do eventually want to issue to
the database so now let's run this again
and now we can see that our results have
in fact been sorted we have all the
2009's preceded by all the 2008 preceded
by 2007's and so on if we change the
direction of our sort the minus 1 then
when we run our query we can see that
now the results are sorted in the
reverse order with all of the earlier
years appearing last so that's how we do
sort in the nodejs driver at least at a
simple level but what if we actually
want to sort on multiple fields for
example I would actually like to see
these results sorted by year but then
sorted by number of employees and I
think it would be most useful because
the kind of thing I'm interested in here
is how are companies over the course of
their lifetime growing so companies that
were founded in 2006 are there a lot of
those that have grown too large numbers
of employees versus say later years of
founding 2009 2013-2015 just to get a
sense for how rapidly
companies in this database are growing
and again we're just doing some very
cursory exploration here when we talk
about the aggregation framework in other
lessons we'll see how we can really do a
rigorous analysis on data sets like this
if I want to sort on multiple fields
there's something that we need to know
about JavaScript in the nodejs driver
you can see did here I was using an
object as the value that I was passing
the sort but here I'm actually using a
list or array the reason for that is
because the order in which these sorts
are applied is important here we want to
sort first by founded year in a sending
order so two thousand six to two
thousand nine or whatever years we
specify and then within each year sort
by number of employees and we want to do
that into descending order so companies
with larger numbers of employees will
appear first within an individual year
the probably run into if we try to pass
an object here again remember object and
document i'm using those two terms
interchangeably if i try to pass an
object here is that it's possible that
the fields will be reordered there is no
guarantee of order of fields for
javascript objects but the order of
array elements is guaranteed so if I
want to make sure that I sort first by
founded year and then by number of
employees the nodejs driver allows me to
pass an array to sort and within that
array I specify all of my elements as
two element tuples with the field i'm
interested in sorting on and the sort
order as the two elements of each of
those nested arrays let's take a look
now at what happens when we use this
sort going back and running our same
command and we can see that we're
sorting now by year in what looks like
sure enough a sending order let's take a
look at where 2009 starts here note
we've got square with 600 employees
appearing first followed by four square
170 urban airship 165 and so on so we
are in fact sorting our search results
by year in a sending order and then
within each year in descending order by
number of employees and just as a side
note we can see that we've got some
dupes in this data set so there's a
little bit of cleanup that we could
still do and lots of different companies
are contained within this database
beyond the startup companies that we've
mostly been talking about so we've
talked about sort so now let's talk
about skip and limit and in fact we'll
look at all three of these together skip
limit and sort here is an extended
version of this applet
we've just been looking at note that the
same sort that we ended up with when we
were looking at the earlier version of
this application is present here but
we're also going to skip and limit now
skip and limit are also cursor methods
and as with project and sort they merely
modify the description of the operation
that we want to execute against the
database calling skip and calling limit
do not force a call to the database it's
only in this application when we call
for each year that will send this
operation the details for which we've
been building up here to the database
complete with the query the projection
we've specified the sort we'd like to
see how many search results to skip and
to what size we'd like to limit our
results set now we're taking these skip
and limit as command line parameters
much in the same way we have done in the
past so I'm not going to go into detail
on those except to point out one thing
and that is that for each of them were
specifying a default value so if skip
isn't specified we specify its value in
the options object that gets passed back
from command line options will simply be
zero and limit has a default value of
20,000 I said it at 20,000 because I
know there are between 18 and 19
thousand documents in this collection
and so a default value of 20,000 means
that I could potentially retrieve all of
the documents from the collection one
last piece of detail here is that we're
not specifying an alias reader skipper
limit so at the command line we're
actually going to have to specify the
full skip and full limit labels for
these command line options and therefore
have to use a double dash in front of
each of them that's just the way our
command shell works for command line
parameters whose names are longer than
one letter you've got to use double
dashes in front so let's take a look at
an example of calling this application
now roughly the same parameters as
before the only difference is I'm
putting the lower bound on number of
employees at 250 that's just so i have a
few less appear in each year and i'm
limiting my results to 10 and actually
going ahead and specifying a skip of 0
even though that's the default value and
you'll see why in just a moment so now i
do my query you can see that if i scroll
up i only got 10 documents back you can
also see that they're all from 2006
because i only requested the first 10
documents all of the employee numbers
are greater than 250 the nice thing
about the way this application is set up
is that it's very soon
allure to what I was talking about
earlier where you do a search to Amazon
you see 10 results on a page or maybe 25
and then in order to see results beyond
that first page of results you click a
next button on the back end what's
happening is the application is actually
submitting another query to the database
same query just skip the first ten if
that's how many we have on the page
that's what we're doing here I can look
at the first 10 results and then I can
say okay I'm ready for the second ten
now and the third page you can see now
from 2006 I'm crossing over into 2007
the fourth page skipping the first 30
results and so on this is because in our
application with these parameters that
were passing in we are specifying that
we want to in our cursor skip whatever
was passed at the command line and limit
our results to whatever limit value was
passed on the command line so this is
very powerful functionality that allows
us to make the database really work for
us we don't have to keep track of too
much state in our application in order
to do something like this we simply need
to know how many to skip for example if
we want to page through results and
there are a number of other ways we can
use this type of functionality to our
advantage now there's one last thing
that I want to talk about and that is
the order in which these things are
applied imagine if we had a result set
and we applied the Skip operation before
the sword operation that's almost
certainly not what we want it for
example if I really want to sort by
founded year but the database actually
applied skip first then I might actually
end up missing some of my 2006 results
because they were in that group that was
skipped before I actually did the sort
one thing that's important to bear in
mind is that I can completely reverse
the order in which I've applied these to
the cursor run my query and what happens
is I get exactly the same results as I
did previously when these were ordered
by sort then skip then limit the reason
for that is that it doesn't matter what
order we apply these constraints to our
cursor MongoDB will always sort first
skip second and limit third so that is
skip limit and sort or should I say sort
skip and limit within the note jas
driver


---

### insert one insert many

https://youtu.be/tDd4PBOmlMk

to this point we've talked about all
kinds of read operations using the
nodejs driver now let's talk about
writing data to MongoDB in nodejs in
particular we're going to look at the
insert one and insert many methods for
collections now for this lesson I'd like
to mix things up a little bit and look
at a different type of data Twitter
provides a pretty amazing REST API that
is exactly the type of thing that we
would use to harvest a bunch of data for
some sort of analysis to say test an
architecture for a social media
application and a variety of other uses
what I like about the rest api is that
it's particularly well suited to a
couple of nice examples that'll allow me
to illustrate the use of insert one and
insert many in the driver now within
this API we are going to be making use
of the statuses user timeline endpoint
and a portion of the API that allows us
to stream tweets on a particular subject
as they happen now a detailed discussion
of how to use the Twitter API is beyond
the scope of this particular class
however the documentation Twitter
provides is excellent and all you really
need in order to get started as a
Twitter account and to set up your
account with a couple of keys that will
allow you to send queries to the API now
one thing we're not going to look at but
which is a fantastic part of this API in
my opinion is the fact that I can
actually create tweets using post
methods to the API so I can
programmatically create tweets and this
is in fact how a lot of websites you see
that allow you to essentially tweet
about something on their site work they
use the Twitter API to allow you to push
content to a Twitter feed from a
third-party application for example at
MongoDB University we might provide a UI
that with a click of a button would
allow you to push a tweet out that says
I just completed a homework NM 101 j/s
so let's look now inserting data into a
MongoDB collection using this API very
briefly I want to touch on the data
model for statuses or tweets and point
out that tweets have a date a unique
identifier here's the text for a tweet
as part of the text field and then
there's a user embedded object that
contains the screen name this is the
tweet posted on MongoDB s Twitter handle
and there are a variety of other details
in
here having to do with media if there
were pictures and retweets etc for
purposes of this lesson we're going to
keep things simple so let's look at an
example of using insert one now all of
this here is simply me using environment
variables that I've set up that contain
the keys that I need in order for
Twitter to actually allow me to
authenticate and pull data so scrolling
down what i'm doing here is connecting
to MongoDB note that i'm connecting to
the social database and then with the
twitter client that i created here i'm
going to use this stream method
accessing statuses and filtering using
the keyword marvel i'm a big spider-man
fan and in general marvel comics so I
kind of like to see what's being tweeted
on those subjects now what we're going
to do here in the callback to stream is
first log the text of the tweet remember
that the text field holds the actual
what we consider to be the tweet itself
or the status update and then we're
going to access the statuses collection
of our social database and we're going
to call the insert one method now to
insert one we're going to pass the
status status is going to be a JSON
object of this kind which MongoDB will
readily accept as a document in the
callback for insert one well simply
report that we inserted a document and
what the inserted ID was okay now one
thing you may have missed as we went
through this is that in the event
handler for this call to stream what
we're actually doing here is setting up
to event handlers okay the first one is
in the event of data meaning a tweet
came in we are going to actually do this
insert and the second one is if there's
an error will simply throw the error
okay so the main job for the call back
here is simply to set up these event
handlers this callback will be called
every time a tweet is generated that
matches this filter term here marvel
okay so we're keeping our HTTP
connection open and the Twitter API is
streaming data to us as it has data that
matches our request so now let's run
this thing ok so I connect and I can see
the tweets start to come in ok so now
I'll
kill this and let's go in to the Mongo
shell and see what we got so I'm going
to use the social database and what I'll
do is query the statuses collection and
we can see that there's quite a bit of
data here and so since the tweets are
big what I'd like to do instead is
project out just the text and filter out
underscore ID okay and so we got this
Marvel cleaners tweet not what we were
expecting but then there are a lot of
Marvel Comics related tweets here as
well ok and you'll remember seeing some
of these stream by as we watched our
application run okay so that is an
example of insert one using the Twitter
NPM module which relies on the Twitter
API as an exercise to you the student
you might take a look at getting this
code up and running with your own
Twitter account there are pretty good
instructions on the documentation for
the Twitter package and as I said the
twitter api docs are quite good okay so
for the second application i want to
show you in this lesson we're going to
look at pulling tweets from a set of
user timelines that we want to follow
continuing with this theme of Marvel
Comics I'm going to use this as an
example of insert many so we're setting
things up again using the Twitter module
four men p.m. but what I'm going to do
here is rather than stream data to this
application I am instead going to make a
get request to the user timeline
endpoint for the API now let me talk
about the basic idea for this
application so imagine that we're
harvesting tweets because what we'd like
to do is build up a collection of social
network data for some analysis that
we're doing so imagine that we have this
app running daily it kicks off say at
6am every day and what we're going to do
is pull all the tweets in the past day
that have been produced by these three
different screen names now of course for
an application like this we'd probably
have hundreds and hundreds of screen
names that were following potentially
thousands or maybe we'd use some other
mechanism for acquiring tweets this is
the one we're going to use in this
example because it's relatively
straightforward okay so the first thing
that I'm going to do here is I'm going
to loop through each screen name and I'm
going to do a find against my existing
statuses collection so for each of these
screen names
I'm going to do a query and sort all the
statuses that I have for each screen
name and limit to one now here I'm
sorting in descending order and limiting
to one because what I'd like to know is
what is the status ID for the very last
tweet that I pulled for each of these
screen names now what that's going to do
for me is it will allow me to request
from the Twitter API all tweets that
have occurred since that particular
status ID so I won't be pulling down any
duplicates wasting bandwidth and
creating some noise in my data set so
having issued this query we can see that
we're pulling in some of what we've
learned from earlier lessons I'll then
call to array on the cursor knowing that
I should just have one document or
perhaps 0 if this is the first time I'm
running this program ok so the very
first thing I do inside the callback for
two array is I checked the length of the
docs array that's passed in if it's
equal to 1 then I know that I've
previously pulled some tweets for that
particular screen name if I haven't they
neither this is the first time I'm
running the program or I've say just
added a new screen name ok the next step
here then is i'm going to set up this
parameters object because i'm going to
end up passing that in my request to the
twitter api so some of the parameters
that are of interest to me here are
screen name because i want to get all
statuses produced by this particular
user and then there's this sense ID
parameter this is going to allow me to
pull all statuses since the last one
that I saw for a particular user and
finally I'm going to specify a count I'm
going to limit the number of statuses I
pull from an individual screen name to
10 primarily so I don't hit my limit in
working through this example and then
showing it to you guys so here then if I
have in fact pulled statuses for this
particular screen name in the past I'm
going to specify my sense ID value in
addition to the screen name as well as
the count if I've not previously pulled
statuses or at least there are none in
the collection here then what I'll do is
I'll simply leave the sense ID off of
the parameters object that I'm building
here ok so with the parameters object
built then what I'm going to do is use
my Twitter client issue a call to the
get method for this client again
provided in the two
NPM package I'm going to pass the params
that I constructed here and then wait
for my call back to be called with all
of the statuses that the API is going to
provide back to me for this particular
screen name okay once I get those
statuses back then I'm going to go ahead
and call the insert many method on the
statuses collection okay so insert many
much like insert one functions more or
less as we would expect it so happens
that this callback will be passed an
array of statuses from the response we
get back from the Twitter API we're
going to pass those along to insert many
and then execute this callback now this
callback does a little more than log
what happened and then just make sure
that we've successfully processed all of
the screen names before we close the
database connection okay so let's go
ahead and run this okay so ran through
pretty quickly and here we get a chance
to see some of the statuses we pulled
back and the IDS for those statuses as
they went into the database so now we've
looked at an example of using insert one
to process tweets that come in from the
streaming interface to the Twitter API
and we've looked at insert many to
process status updates that we've
requested in bulk from a variety of
different users timelines the key
takeaway here is that both insert one
and insert many function as expected in
that insert one expects to receive a
single document as its first parameter
and insert many expects to receive an
array of documents as its first
parameter both of them take a callback
that allow us to process errors or the
results in some fashion and the results
that we get back in both cases tell us
what IDs were inserted whether it was
one ID in the case of insert one or
multiple IDs in the case of insert many


---


### delete one delete many

https://youtu.be/gNPsatcQPUA

ok now let's finally talk about deleting
documents from MongoDB in the note j/s
driver as an example I'd like to take a
look at cleaning up our company's
collection a little bit as we
encountered previously there are some
duplicate records in this collection and
we can see one example if we do a search
for the permalink thomson reuters now
permalinks should be unique within our
collection however if we do this query
and then project out the name and the
updated at fields will see that there
are in fact two records both for
companies named Thomson Reuters same
company both of which were updated at
exactly the same time stamp but with
different object ids now for a real data
cleaning operation we'd probably want to
do a fairly rigorous assessment to see
whether there were some subtle or
significant differences between these
two records and other records that
appear to be duplicates but for purposes
of learning a little bit about the
delete operations in MongoDB we'll just
assume that any records that have
identical permalinks and updated at
values are duplicates and we'll build a
little application to eliminate those
duplicates now before we get into
actually deleting any records let's get
a sense for the size of the problem in
this data set now one way in which we
can approach this is to do a query for
all permalinks if we sort them those
that are identical should occur in
sequence and if we use our cursor for
each method will stream them in without
using very much memory at all really and
we can simply compare successive values
for permalink to see whether or not we
have duplicates this is a pretty
standard technique for identifying
duplicates when you have a collection of
items okay so what I'm going to do here
is create a query document I'm going to
specify that I want to see permalink
values that exists and that are not
equal to true something we've seen
several times now and I'm going to
project out the permalink and the
updated at values and because I'm not
excluding it the underscore ID value
will also come through okay so then we
go into defining our query passing in
the query document and then we're going
to apply a projection and
finally a sorting here I'm sorting by
permalink into a sending order now I
want to keep track of the number that
need to be removed so I'll do that with
this variable here and I'm also going to
create a variable called previous to
which I could compare each document as i
iterate through them in my callback
function here again remember if I see
the current document having the same
permalink and updated at value as the
previous document then I'll know I've
got a duplicate and I will identify that
second document as one to be removed ok
so looking at the iterator for each I
can see that I've got a permalink here I
can see that I'm comparing the
permalinks for the current document and
the previous one and the updated at
value for the current document and the
previous one ok if both of those are
equal then I'm going to go ahead and log
that permalink update my number to
remove and then i will call delete one
here ok but first what I'd like to do is
just get a sense for how many documents
we have that are duplicates ok and then
at the bottom of this iterator of course
I'm going to update the previous
document to the current one that I've
just finished processing so the next
time through previous will be that one
that I've just concluded processing ok
so let's run this and we've got a big
error here let's see what's going on
we've got a big stack trace it just
print it out let's see what the problem
is ok so this is interesting let's take
a look at it executor error during find
command operation failed sort operation
used more than the maximum bites
permitted ok so let's talk a little bit
about what's happening here note that
we're stipulating that we want to do a
sort here ok in a later section when we
talk about indexes we will learn that we
can actually do sorting on the database
side so within MongoDB itself provided
we have set up an index that MongoDB can
use to do our sort so for example one
index in this case would be an index on
permalink we don't have such an index
set up so what's going to happen is the
system is going to try to do a sort in
memory rather than in the database so as
a little bit of foreshadowing what I'd
like to do here is just go into the
Mongo
and I'm going to create an index again a
little bit of foreshadowing we're not
quite ready to talk about indexes yet
but if I execute the create index
command then I will create an index on
the permalink field on this collection
and this will enable MongoDB to be able
to sort my query using this index merely
by walking the keys in the index and
that's all I'm going to say about
indexes for now but this will solve the
problem that we've just seen over here
so now if I try to run this okay what I
get out is a list of all of the
permalinks that seem to be duplicates
okay so let's check a couple of these
how about this one RSS mixer if I go
into the Mongo shell and I search for
that permalink again to documents same
updated at Value going back here let's
check another one swap logic okay and
again duplicates okay so now I think
we're ready to actually go ahead and
delete these documents so let's talk
about how delete one works so again
remember that what I'm going to do here
is loop through a sorted list of all the
permalinks and when I find two
successive documents that have the same
permalink and updated at I know i found
a duplicate and i'm going to call delete
one now delete one takes a filter which
is basically a query document and it
will delete the first document it finds
that matches this query or filter okay
now remember that I am not getting rid
of the underscore ID on my projection
here as part of this query where I'm
getting the sorted list of permalinks so
I have that underscore ID available to
me and the reason why I didn't get rid
of it was because I want to specify the
underscore ID as my filter to delete one
there will be only one value that
matches that because under squared D
values of course have to be unique so i
will delete the second of the two
documents i found that have the same
permalink and updated at value each time
I find myself in that situation in this
iteration call back okay and then in the
callback for delete one I'm just going
to check for an error and print out the
result that I got back ok now let's run
this
and this time when I run delete one it's
actually going to do the deletion okay
and we can see here that we got back
same output but we're also getting back
what looks like responses from a call to
MongoDB and in fact that is what we're
seeing because we're printing out the
result of having done our delete one
when we see an okay of one we know that
it succeeded and n of 1 indicates how
many records were deleted because we're
calling delete one we expect to see just
one document deleted each time now if we
try to run this again what will happen
basically is nothing because we've
already deleted all of those duplicates
if we go back to our Mongo shell and
check these values now swap logic has
just won let's look at RS mixer again
just one how about thomson reuters and
just one because we've deleted all the
duplicates okay now you may have noticed
that calling delete one every time
through this iterator is a pretty
inefficient means of performing this
task okay there are more than 900
duplicates here so we're doing a round
trip to the database more than 900 times
that's crazy so delete one is perfectly
fine for small one off operations where
you need to delete a document but when
you've got a larger task like what we
have here what you really want to use is
delete many okay so here's an alternate
version of that same application the
only real difference here is that rather
than deleting documents each time
through my iterator instead what I'm
doing is I am simply marking the
documents for removal by the underscore
ID field so I'm keeping track of a
marked for removal array every time I
find one of those matches for permalink
and updated at i push the document ID on
to my march for removal array so the
callback that gets called as soon as I'm
done iterating is the place where I
really want to be doing my delete and
you can see here that I'm making a call
to delete many now delete many like
delete one also takes a filter or query
document as its first argument what i'm
doing here is i'm saying as my filter
look at the underscore ID field and for
every underscore ID found in this array
that I'm going to specify as the
argument for dollar in delete those
documents now delete many and contrast
to delete one will delete all documents
that match our filter okay so I'm going
to use the dollar in operator on the
array that I've built up here pushing an
additional document ID on each time I
find a match and then i will call delete
many identifying every single one of
those document IDs for the documents
that need to be deleted and in this call
back then i can report on the results of
the delete many operation report how
many documents were removed and finally
close the database connection alright so
now let's run this however if you'll
remember I've actually already deleted
all of those documents using the earlier
version of this application that we
looked at so what I'm going to do is
basically just reset our database we're
using the crunch based database so I'm
going to simply drop the database and
then I'm going to mongo import it once
again again remember the way Mongo
import works is I specify the database
and the collection into which I would
like to dump all of those JSON records
held in whatever JSON file I'm passing
to Monaco import in this case it's my
company's JSON file ok so my collection
is built again if I go and look for
Thomson Reuters sure enough i'm going to
see two of them again so now let's call
this delete many version of the
application and again I'm getting that
same sort operation issue so I can take
care of that by once again creating the
index when I drop the database all the
indexes disappear as well so I need to
recreate the index and now I run my
delete many operation note that the
operation succeeded there were 907
documents removed and I'm actually
reporting that as well based on the
length of the mark for removal array so
what the database report says the number
of documents to be removed matches what
i calculated inside my own application
as the number of documents that needed
to be removed ok and now if we go back
to the Mongo shall we look for thomson
reuters
just one RS mixer just one of those and
swap logic just one of those okay so
that is a good overview of using delete
one and delete many what they need to be
passed as parameters and what they
return to the callback that we provide


---

### multikey

https://youtu.be/KtIY4Q1tUao

One of the reasons that linking and embedding works
so well within MongoDB is because of the existence
of a feature called multikey indexes.
I'm going to talk a little bit about multikey indexes
and why they're so useful within MongoDB.
Now, let's say you had a schema that included students
and teachers, and this is a schema that we've seen before.
And these are two example documents
from these collections.
The students collection might have
a separate document for each student
with a unique underscore ID, a name for each student,
and a key for the teachers, where
the value is a list of the underscore ID values for all
the teachers that the student has.
And on the other side, we have this teachers collection,
which has a document for each teacher
with a unique underscore ID, an integer
value, and a name for each teacher.
And here you can see we have Tony Stark is
the only teacher in the collection right now.
And so this says right here that Andrew has had four teachers
and that one of them is Tony Stark.
Now, there are two possible queries,
or I should say two obvious queries.
And one is, how can I find all the teachers
that a particular student has had?
And the other is, how can I find all the students who
have had a particular teacher?
Now, let's go over the first one which
is, how do I find the teachers for a particular student?
Now, that one is straightforward because I can simply
search this collection.
I can query the students collection.
I could do db.students.find.
I can specify the student I'm looking for,
and then return the teacher's key with its values,
and then I'll know the teachers.
But what about finding all the students who
have had a particular teacher?
That's a more difficult query.
That query is going to use our set operators.
And in order for that to be efficient,
we need to be able to use an index.
And it's going to be a multikey index that makes this possible.
So let me show you in the shell how this looks.
All right.
So we have two different collections already
set up here.
We have a students collection, and we
have a teachers collection.
Here's the students collection, and here's
the teachers collection.
And we can see that the students collection has
a list of students, including myself,
and the teachers that I had.
And here in the teachers collection,
we have a list of professors, and these
are the professors that were teaching
when I was at Stanford.
And we can see that, for instance, I
had the teacher 0 and 1, which are
Mark Horowitz and John Hennessy.
Now, if we wanted to add a multikey index on this teachers
key, we could do it as follows, db.students.ensureIndex
'teachers' 1.
And we haven't gone over indexes yet,
but this is how you'd create them.
And now the shell returns information
that before there was one index, which
was the index on underscore ID which is in every collection,
and now there are two.
And now we're going to do a query that's
going to use that index and be efficient.
So let's find all the students who
had Mark Horowitz and John Hennessy as professors.
So Mark Horowitz is 0, and John Hennessy 1.
So we'll db.students.find 'teachers," now we're all.
There we go.
So now, we do a query, and we ask,
find me all the students that had
both 0 and 1 in their teacher's value.
And we find that it's me, Andrew Erlichson,
and it's also Richard Kreuter.
He has also 0 and 1 in the teacher's value.
Now, the question is, how do we know that that used an index?
Well, there's a little command that we haven't talked
about yet, but it works like this.
We can append explain at the end of this query.
And if we append explain at the end of this query,
it will tell us what it did when it was performing the query.
And if we do that, we can see here
that it returns a bunch of information,
but what it tells us is that it used the BtreeCursor
teachers underscore 1 index, which is a multikey index.
And that's how multikey indexes work
and why they make linking and embedding an efficient way
to represent information within MongoDB when you query it.


---

### m101 17 benefits of embedding

https://youtu.be/XIN0Dqht08Q

The main benefit of embedding data from two different
collections and bringing it together into one collection
is performance.
And the main performance benefit comes from improved
read performance.
Now, why do we get improved read performance?
The reason is the nature of the way these systems are
built, the computer systems are built, which is they often
have spinning disks, and those spinning disks have a very
high latency, which means they take a long time to get to the
first byte.
They often take over one millisecond to get to the
first byte.
But then, once they get to the first byte, each additional
byte comes pretty quickly.
So they tend to be pretty high bandwidth.
So the idea is that, if you can co-locate the data that
you're going to use together in the same document, embed
it, then you're going to spin the disk, find the sector
where you need this information, and then you're
going to start reading it.
And you're going to get all the information
you need in one go.
And it also means, if you have two pieces of data that would
normally be in two collections or in several relational
tables, but instead they're in one document, that you avoid
round trips to the database.
Because now, in one round trip, you can go in, you can
read the data, and you can get back out.
Same thing with a write.
In one trip, you can go to the database, you can write the
data you need, which would normally potentially go into
multiple different parts of the system and parts of disk,
write one location on the disk, and then get back out.
And the only real caveat on this is, as I said earlier, if
a document winds up getting moved a lot more often because
you've brought the data together because the document
needs to be expanded, then you could create a problem.
You could slow down your writes
because of the embedding.
So again, it all comes down to your access patterns with
MongoDB and trying to design a schema around the access
patterns that you see in your actual application.



