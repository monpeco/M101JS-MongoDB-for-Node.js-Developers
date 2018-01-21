creating documents

https://youtu.be/UYz8EYa2TnA

ok so now we're going to dive in and
talk about crud operations in MongoDB in
more detail we're going to start here
with creating documents so for creating
documents we're going to do a detailed
introduction to how we get data into
MongoDB what we're interested in here
are specific commands for inserting
documents as well as other ways in which
we can create data in MongoDB we're
going to look at the insert one and
insert many commands and also talk
briefly about the ways in which new
documents can be created in MongoDB
through update operations so as we saw
before we can insert a document into
MongoDB using the insert one command
this creates a document in this
collection and creates the collection if
the collection did not already exist now
here we're just going to do a little bit
of experimentation inserting this
document first we can see from the
results that the object ID created was
this and if we do a find in this
collection we see that in fact this is
the ID that was assigned for that
document that we just inserted now as I
mentioned in another lesson all
documents in MongoDB must contain an
underscore ID this is the unique
identifier for a given document within
the collection
therefore all underscore ID values
within a single collection are unique
but we can also insert a document and
provide the ID in advance so let's do an
example of that so what I'm going to do
in this case is insert as the underscore
ID the IMDB value you could make the
argument that this should be the
underscore ID in our movies collection
for a couple of reasons I prefer not to
do that not terribly important for
purposes of this lesson but this
provides us a good example of a
reasonable ID that we might include
for all documents in this collection so
now we can see that the response we got
back has the same form as what we got
back up here the difference is that the
inserted ID value is the one that we
specified for underscore ID and now if
we do a search we see that we actually
have two documents okay they have the
same data in them it's because we
inserted the same document twice in the
first case we did not supply an
underscore ID in the second case we did
so MongoDB does not interpret this as
being a duplicate because it has a
different underscore ID in practice you
wouldn't actually have two different
documents that contain the same data but
simply had different underscore IDs and
in practice you'd want to make sure that
your underscore IDs were all of the same
form in a given collection I did this
merely to illustrate the difference
between letting MongoDB create the
underscore ID value and inserting an
underscore ID value ourselves for the
same data now in many cases we have
multiple documents that we would like to
insert at once in some sort of batch
operation MongoDB provides a command for
that and it's called insert many let's
take a look at an example of this
command I'm actually going to pull it up
in sublime text so here's an example of
insert many now I suppose I should point
out that I'm using my movie scratch
collection that's just so I can easily
do a little bit of noodling around here
demonstrating these commands and then
just get rid of this collection without
corrupting any data that I actually want
to maintain with regard to movies so the
syntax of this command is as follows
insert many note the capital M and then
instead of passing a single document as
the first argument to insert many we
pass an array the array can list as many
elements as we like each element is a
separate document that we would like to
insert into our collection and if we
scroll down you can see that we close
the array and then close off the command
now there are additional options for
insert many and we will take a look at
those a little bit later on so now let's
run this command I'm just going to copy
it here and then paste it into my shell
and we can see that what happens here is
about what you would expect given our
understanding of the return value from
insert 1 instead of a a single inserted
ID value we have instead an array that
lists the object IDs for all of the
documents that were inserted note that
here for these documents that we
inserted we did not specify an
underscore ID so am I going to be
created one for us and insert many is
telling us what the IDS were that
MongoDB is signed for these documents
now as you might imagine if you're doing
this kind of
bulk inserting it's entirely possible
that there will be an error more an
exception thrown for one of the
documents that you're inserting
especially if you're doing something
like some sort of data cleaning
operation where there may be some noise
in the data or errors of some kind so to
deal with this type of scenario there
are a couple of different options for
insert many so you can choose to do
either ordered inserts or unordered
inserts so a good example of this would
be if we did in fact decide to use these
IMDB values as underscore IDs for the
documents in this collection so let me
convert all of these real quickly ok so
now I have all of my documents and I'm
specifying an underscore ID value as the
IMDB identifier for each one of these
movies in order to simulate the kind of
error we might see what I'm going to do
is I'm actually going to create a
duplicate entry here definitely the type
of thing that might happen when you're
doing bulk inserts so let's take the
Wrath of Khan movie and I'm just going
to duplicate it here now let's go back
to our shell and I am going to drop this
collection so just get rid of the data
that's in there already now let's take
our insert many command and run it again
so this is what I wanted to show you
note that we got two inserted okay so
why did that happen well by default
insert many does and ordered insert so
if we take a look at the options we
specified here no additional parameters
so insert many is doing an order to
insert meaning that as soon as it
encounters an error it will stop
inserting documents so in this case what
happened was we inserted this document
no problem inserted this document no
problem but when we got to this one
because the underscore ID we're
specifying here is exactly the same as
this one
and because underscore ID values must be
unique within a collection this caused
an error meaning that this command just
bailed out this means that two were
inserted but this write error value in
the exception that comes back to us
indicates that we have a duplicate key
error and in fact the duplicate key is
this one which again is this and it
happened when we were attempting to
insert that second Star Trek to the
Wrath of Khan movie entry now
many applications we might simply want
our app to keep going if it encounters
an error because either we're fine with
the documents that aired out not being
inserted or we have a separate process
for dealing with them some other way so
let's look at this same insert many
command the only difference being that
here I'm specifying as part of a
document that makes up a second argument
to our insert method command that we
want ordered to be false now what this
means is that MongoDB will run an
unordered insert many command meaning
that if it encounters an error it will
still try to insert the rest of the
documents let's go ahead and run this
now and bear in mind that we still have
those first two documents in our
collection that were inserted from the
ordered insert many requests and just to
be sure let's take a look at what's in
our collection see that we've got four
documents Wrath of Khan Star Trek star
trek into darkness and star trek first
contact those are in fact these two and
these two these two were inserted in
that ordered insert many command that we
ran these two were inserted by the
command that we just ran if we go back
and look at the error that we got back
note that there are actually three right
errors we received one for the first
three entries in this insert many
command that's because these two were
already there their IDs were already
there so we got duplicate here's for
both of those and of course we got a
duplicate key error for this one as well
but the insert menu command kept
chugging along
and in fact inserted these two despite
the three errors that it had encountered
previously so for creating documents
we've so far looked at insert one and
insert many these are the two principal
commands for creating documents in
MongoDB now there are a couple of other
ways in which we can create documents
primarily through the use of the update
series of commands update commands can
result in documents being inserted we
call these operations up certs up certs
occur when there are no documents that
match the selector use to identify
documents that should be updated we
discuss up certs in detail in another
lesson
so with this we've discussed in some
detail the primary ways in which we
create documents in MongoDB and
hinted at the third way in which data
can be inserted into a MongoDB
collection and with that we've addressed
the create portion of our crud material
how we read documents from MongoDB is
next

---

### the id field

https://youtu.be/EZAuZv4Rz3U

okay so we've talked about the
underscore ID field a couple of times
now let's speak in more detail about
this field and about object ID values in
particular
mown gonna be if we don't supply one
creates an or described a field by
default all collections have a unique
primary index on the underscore ID field
this enables us to retrieve documents
based on their ID very efficiently we
can of course also create secondary
indexes on MongoDB and we discuss
secondary indexes in other lessons by
default
MongoDB creates values for the
underscore ID field of type object ID
this is a value type defining to biess
on spec and it's structured this way
meaning that the database uses these
values in order to construct an object
ID value all object ID values are twelve
byte hex strings the first four bytes
are a value representing these seconds
since the UNIX epoch so a timestamp the
next three bytes in this string are a
machine identifier they are the MAC
address for the machine on which the
mangodi server is running then two bytes
contain the process ID finally the last
three bytes are a counter to ensure that
all object IDs are unique even if a
couple of Rights happen under a set of
conditions such that the first nine
bytes would end up being the same as a
second right so these are the components
of the object ID this is how an object
ID is constructed and it's these types
of values that you'll see as the value
for the underscore ID field in a lot of
the documents that we'll look at in this
class and generally when working with
data in MongoDB


---

### the id field
https://youtu.be/EZAuZv4Rz3U

okay so we've talked about the
underscore ID field a couple of times
now let's speak in more detail about
this field and about object ID values in
particular
mown gonna be if we don't supply one
creates an or described a field by
default all collections have a unique
primary index on the underscore ID field
this enables us to retrieve documents
based on their ID very efficiently we
can of course also create secondary
indexes on MongoDB and we discuss
secondary indexes in other lessons by
default
MongoDB creates values for the
underscore ID field of type object ID
this is a value type defining to biess
on spec and it's structured this way
meaning that the database uses these
values in order to construct an object
ID value all object ID values are twelve
byte hex strings the first four bytes
are a value representing these seconds
since the UNIX epoch so a timestamp the
next three bytes in this string are a
machine identifier they are the MAC
address for the machine on which the
mangodi server is running then two bytes
contain the process ID finally the last
three bytes are a counter to ensure that
all object IDs are unique even if a
couple of Rights happen under a set of
conditions such that the first nine
bytes would end up being the same as a
second right so these are the components
of the object ID this is how an object
ID is constructed and it's these types
of values that you'll see as the value
for the underscore ID field in a lot of
the documents that we'll look at in this
class and generally when working with
data in MongoDB


---


### Reading Documents
https://youtu.be/yP0Islq0kBo

let's move on to reading documents to
begin our discussion of read operations
we will discuss equality searches well
first look at equality searches
involving scalar-valued fields then
nested documents and finally on array
fields this discussion will set the
stage for more sophisticated types of
queries involving the rich set of
operators provided by the MongoDB query
language you've already seen a couple
examples of equality matches on scalar
valued fields let's look at a couple
more to get us started for this lesson
I'd like to look at a new collection of
movie data in this collection we have
much more detail on each movie and this
will provide a good basis for a lot of
the topics I'd like to look at with
respect to reading documents for MongoDB
so in this example we're querying on a
single field and specifying that we want
to see only documents rated pg-13
performing the query we can see that
each document returned is in fact rated
pg-13 we can get a count for the number
of documents matching this query using a
count command and we can see we have a
hundred and fifty-two documents matching
this query in this particular collection
we can restrict the results set further
by adding additional selectors to our
query document and I'm going to be query
language we refer to the first argument
to find as a query document the fields
in this document are selectors that
restrict the result set to only those
matching these criteria and we can see
that adding the restriction for year
being equal to 2009 significantly
reduces the number of documents on our
result set so what's important to notice
here is that selectors in the query
document for find are implicitly ANDed
together meaning that only documents
matching both of these criteria are
retrieved in other lessons we consider
query operators including dollar or for
use cases requiring documents matching
any of two or more conditions now let's
turn our attention to how we can match
for equality against embedded documents
arrays and other nested structures let's
take a look at this document and think
about some of the queries that are
likely to be important in working with
this data so for example we might be
interested in only documents with a
certain tomato meter rating
in case you're not familiar Rotten
Tomatoes is a movie review site good
movies score highly on the tomato meter
with 100 being the highest bad movies of
course score lower so how would we do in
a quality match for say all movies with
a Rotten Tomatoes rating of 100 in the
MongoDB query language our query would
have this form so there's a total of 34
documents matching this query let's take
a look at a couple of them and let's
make that pretty here we can see tomato
meter 100 tomato meter 100 and so on
throughout the rest of the query results
taking a closer look at the syntax here
we're using what we call dot notation in
order to identify a field of a document
nested within the field tomato taking a
look again at our example document you
can see that at the top level of our
movie details documents we have a tomato
field and the tomato field stores a
nested document with a number of fields
one of which is meter that provides the
Rotten Tomatoes tomato meter score for a
given movie now the dot notation syntax
works for documents nested at any level
you must enclose the key in quotes as
you may be aware it's not strictly
necessary to use quotes in some clients
the shell is actually one example so
while I can do this
not putting quotes around my key here I
cannot do this one thing I very much
liked about the MongoDB query language
is that it's fairly intuitive in many
respects dot notation is in my opinion
one example to sum up to drive down the
hierarchy of nested documents you reach
into documents at each additional level
of nesting by stringing field names
together using dot notation and don't
forget the quotes let's move on now and
talk about exact matches for array
fields so far we've talked about and had
several examples on how did you exact
matches for scalar fields and for fields
that contain nested documents again
we're setting the stage here for a
complete understanding of the MongoDB
query language including use of a
variety of operators that allow us to do
a number of very sophisticated types of
queries so in considering equality
matches on arrays we can consider
matches
on the entire array matches based on any
element in the array those based on a
specific elements a matching only arrays
whose first element matches specific
criteria we can also look at more
complex matches using operators and we
will do that in another lesson here
we're going to look at these three in
this first example our search is going
to identify documents by an exact match
to an array of one or more values now
for these types of queries the order of
elements matters meaning that I will
only match documents that have Ethan
Coen
followed by Joel Coen and those are the
only two elements of the array writers
just remind ourselves what the documents
look like again let's look at our
example one more time and here we find
our writers component of this document
note that writers is an array and the
documents in this collection may have
one or more writers so let's run this
query so we get one document and let's
actually take a look at what the
document is in this data set there is
one movie that matches these criteria
the big lebowski note that it has an
array filled writers that have Ethan
Coen and Joel Coen listed in the order
we specified here note that due to the
semantics of array matches the following
does not match the same document or in
fact any documents in this data set
because we've switched the order of the
writers now I think it's more common
that we match documents for which a
single element of the array matches
selectors in our query here's an example
the semantics of this query are that
document matches will be those that
contain the string Jeff Bridges as one
element of the array actors no other
constraints are placed on the query
results and you can see that in fact
Jeff Bridges does occur in this document
and this one and this one and for the
other results retrieved by this query
what's nice about this syntax is that
it's exactly the same as selectors for
scalar values people just learning to
use MongoDB sometimes forget that just
be aware that in your query you don't
need to enclose the value you're looking
for in an array field or square brackets
unless you actually want to do an exact
match on the entire array value for
documents in your collection as we did
with the Coen Brothers example
so again just to sum up if you have an
array field and you want to find all
documents where any element in that
array field matches a specific value you
can do a query of this form that will
locate all documents where the string we
supplied in this case Jeff Bridges is
any one of the elements in this array in
some situations we want to match a
specific element of an array actors' and
writers' are frequently listed in some
sort of order of precedence with those
whose contributions to a film that are
highest occurring earlier in a list for
example the star of a movie will appear
before supporting actors as we see in
this document for Ironman in which
Robert Downey jr. starred and Jeff
Bridges provided a supporting role in
our data set this type of ordering is
for the most part an implicit part of
all array fields the MongoDB query
language enables us to specify that we
want to match array elements occurring
in a specific position in an array so in
this data set we might be interested
only in those movies where Jeff Bridges
was the star in this case that means
he's likely to occur as the first actor
listed now the way to do this in MongoDB
is to use dot notation similar to what
we do with embedded documents but in
this case we specify the element of the
array in which we're interested and if
we do this query we'll see that we get
two documents back one for The Big
Lebowski and one for Crazy Heart
so before where we had four movies
returned for a search we now have two
again those being the movies in which
Jeff Bridges stars so now we've looked
at equality matches on arrays against
the entire array matching any element of
the array and then those based on a
specific element for example the first
element of an array we discuss other
aspects of querying against arrays in
later lessons in addition to arrays we
discussed equality matches on scalar
valued fields and on embedded documents
this discussion provides a good
foundation on the MongoDB query language
you should now have a solid
understanding of the syntax for reading
documents in MongoDB before we wrap up
this lesson there
two additional topics that are important
here for understanding reads in the
MongoDB query language before we wrap up
I want to discuss cursors and protection
with regard to cursors as we discussed
in another lesson the fine method
returns a cursor to access documents you
need to iterate through the cursor in
the Mongo shell if we don't assign the
return value from find to a variable
using the VAR keyword the cursor is
automatically iterated up to 20 times to
print an initial set of search results
as we see here in response to this query
in general the MongoDB server returns
the query results in batches now bat
size will not exceed the maximum beasts
on document size and for most queries
the first batch returns 101 documents or
just enough documents to exceed one
megabyte subsequent batches will be four
megabytes now it's possible to override
the default batch size but that's out of
scope for this class as we iterate
through the cursor and reach the end of
the return batch if there are more
results cursor dot next we'll perform a
get more operation to retrieve the next
batch now since these documents are
relatively small our initial batch is
gonna be 101 documents so by typing IT
repeatedly here at the cursor we've just
iterated through two batches the first
one with 101 documents and then a second
one composed of just seven documents now
if you want to see how many documents
remain in a batch as you iterate through
the cursor or just in general look more
closely at how cursors work in the shell
you can use something like the following
so first we'll assign our cursor to a
variable using the VAR keyword next
we'll create a function that uses this
cursor checking first to see whether
there are any more results and if there
are getting the next one otherwise
returning null now before we do anything
we can check to see how many objects are
in our batch by using this method on our
cursor object and we can see that in
fact we do have 101 documents in this
initial batch I can iterate through this
batch by calling this doc function that
I setup and then I can call this method
again to see how many documents are left
in our batch now if you're particularly
interested in cursors adding
urge you to have a look at the MongoDB
documentation on cursors at Docs MongoDB
org now last but certainly not least in
this lesson is a discussion of
projection projection is a handy way of
reducing the size of the data returned
for any one query as we know by default
MongoDB returns all fields in all
matching documents for queries to limit
the amount of data that MongoDB sends to
your application you can include
projections in your queries projections
reduce Network overhead and processing
requirements by limiting the fields that
are returned in results documents now
projections are supplied as the second
argument to the find command now if I
want to limit my documents so that they
just contain a title I can do that using
this or almost now you'll see that
instead of returning all of the fields
for all of the documents that match now
I get just the title now I also get the
underscore ID field so let's talk about
why that's true the projection syntax
allows me to explicitly include fields
and documents returned I can also
explicitly exclude fields if I
explicitly include fields those are the
only fields that will be returned the
one exception is underscore ID
underscore ID is always returned by
default if I don't want to see
underscore ID in return documents I need
to explicitly exclude it and I can do
that by simply specifying a 0 for ID in
my projection document and now we see
that we just have titles and as we
iterate through all of our results
merely contain titles now if we have the
reverse situation where we actually want
to explicitly exclude a couple of fields
we can do that as follows
so rather than include title I'm going
to exclude writers and actors now my
results contain all fields except for
the ones I explicitly excluded here and
you see if we scroll up where we used to
find writers and actors we don't find
any fields at all now so if you need to
limit the fields returned by your
queries projection is the tool to use


