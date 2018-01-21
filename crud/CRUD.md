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