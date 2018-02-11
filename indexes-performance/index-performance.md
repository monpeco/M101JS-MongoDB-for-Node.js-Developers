### Storage Engines Introduction

https://youtu.be/YvK7I9fYpK4

Pluggable storage engines were introduced in MongoDB 3.0. Though this video makes repeated reference to MongoDB 3.0, that is not the latest release. In MongoDB 3.2, WiredTiger became the default storage engine. So simply running mongod from the command line will launch MongoDB with WiredTiger as the storage engine used. You can find the most recent release of [MongoDB here](https://www.mongodb.com/download-center?jmp=nav&_ga=2.93723796.869222156.1517881720-1609354327.1514341564#community)

this week is mostly about indexing and
at the very end of the week we're gonna
talk about sharding which is
distributing database queries across
multiple servers but before we do that
we need to introduce you to the idea of
what a storage engine is inside the
database because this was a big year for
MongoDB knew and MongoDB 3.0 is that we
offer pluggable storage engines now what
is the storage engine a storage engine
is the interface between the persistent
storage which we'll call the disks which
might be a solid-state disk and the
database itself MongoDB and this is the
MongoDB server so the MongoDB server
talks to the disk the persistent storage
through a storage engine so this that's
the storage engine right there and you
the programmer you're going to be
writing let's say a Python program and
so you'll be writing in Python and it'll
be using the PI Mongo driver which talks
to the database server using the wire
protocol and when it wants to create
data read data update and delete data
it'll talk to the storage engine which
will then talk to the disk and all the
different structures that hold the
documents that hold the indexes and the
metadata involving the documents are all
written to the persistent storage by
this storage engine now it may be the
case that the storage engine itself
decides to use memory to optimize the
process so in other words the disk is
really slow so since the idea of
database is to store stuff persistently
what happens is the storage engine has
control of memory on your computer and
it can decide what to put in memory and
what to take out of memory and what to
persist the disk and win so database
server itself defers the handling of the
memory on the server as well as the disk
itself to the storage engine now we
offer a pluggable storage engine
architecture where you can use more than
one the idea here is that let's say you
had a car and you wanted to have
different engines you could put the
engine in the car and then it would
probably change the cars performance
characteristics for instance it might
accelerate faster or might get better or
worse gas mileage because of the type of
engine
you put into your car and similarly
depending on the type of engine that you
put into MongoDB you're going to get
different performance characteristics
and that's why it's important that we
have some basic understanding of this
before we move on to this week there are
two main storage engines that ship with
MongoDB that we support and one of them
is called M map and the other one is
called Wired tiger a map is the default
it's what you'll get if you don't give
any options to Mongo D when you started
at the command line and M app we're
gonna go through how this works it's
been the storage engine for quite a
while
wire tiger came in through acquisition
in 2014 MongoDB acquired the wired Tiger
company this is the same team that built
Berkeley DB and also a lot of them were
at the company sleepycat if you know
your computer history all right so now
you have some basic understanding of
what a storage engine is so what is the
storage engine not what about some of
the things the storage engine doesn't
handle well if you have a bunch of
MongoDB servers all running in a cluster
the storage engine doesn't affect the
communication between those different
MongoDB servers and the storage engine
doesn't affect the API that the database
presents to the programmer for example
it's the same pretty much whether or not
you use M map or wire tiger but there
are going to be some differences in
performance and that's why we're going
to discuss it all right now it's time
for a quiz the storage engine directly
determines which of the following check
all that apply the data file format
architecture of a cluster the wire
protocol for the drivers and the format
of the indexes
I didn't directly talk about some of
these so you might have to guess based
on what I said


---

### Introduction to MMapStorage Engine


https://youtu.be/os3591KviNM


let's talk about the nmap storage engine
we call it a map v1 it's the original
storage engine of MongoDB and it uses
the M map system call under the covers
in order to implement storage management
let's look at what the M map system call
looks like it's right here if you do on
any UNIX machine if you man M map you'll
see that it talks about allocating
memory or mapping files or devices into
memory causes the pages starting in
address and continuing for most length
bytes to be mapped from the object
described by the file descriptor and an
offset so what does that really
practically mean well MongoDB needs a
place to put documents and it puts the
documents inside files and to do that
initially allocates let's say a large
file let's say allocates 100 gigabyte
file on disk so we want it with 100
gigabyte file on disk right here and
this disk may or may not be physically
contiguous on the actual disk because
there are some algorithms that occur
beneath that layer that control the
actual allocation of space and a disk
but from our standpoint it's 100
gigabyte contiguous file if my I'm going
to be calls the M map system call it can
map this file it's hundred gigabyte file
into 100 gigabytes of virtual memory now
to do that of course we need to be on a
64-bit computer because you could never
get a hundred gigabytes of virtual
memory space on the 32-bit computer
you'd be limited to 2 or 4 gigabytes and
these are all page sized so pages on an
operating system are either 4k or 16 K
large so there's a lot of them that I'm
not showing here and the operating
system is going to decide what can fit
in memory so if the actual physical
memory of the box is let's say 32
gigabytes then if I go to access one of
the pages in this memory space it may
not be in memory at any given time the
operating system decides which of these
pages are going to be in memory I'll
just say the green ones are in memory
and so when you go to read a document if
it hits a page that's in memory then you
get it and if it hits a page that's not
in memory let's say this page then the
operating system has to bring it from
disk this is on disk here as to bring it
from disk into memory before you can
access it and that's the basics of where
the M map storage engine works now the a
map storage engine offers collection
level concurrency or we sometimes call
it collection level locking
each collection inside MongoDB is its
own file if you look in data slash DB so
what that means is that if you have two
different operations going on at the
same time and they are in the same
collection one's gonna have to wait for
the other one if they are right because
it's a multiple reader single writer
lock that it takes so only one right can
happen at a time to a particular
collection but if there are different
collections then it could happen
simultaneously in addition the way this
story dungeon works and map v1 we allow
in place updates of data so the document
is sitting here in this little page
right here and you do an update to it
then we'll try to update it right in
place and if we can't update it then
what we'll do is we'll mark it as a
whole and then we'll move it somewhere
else where there is more space so well
maybe move it over here or something and
then we'll update it over there in order
to make it more likely that we can
update a document in place without
having to move it we use power of two
sizes when we allocate the initial
storage for a document what that means
is that if you try to create a three by
document you're gonna get four bytes if
you try to create a seven by document
you're gonna get eight bytes a 19 byte
document you're gonna get 32 bytes and
this way it's more likely that you can
grow the document a little bit and that
space that opens up that we can reuse it
more easily so that's the EM map storage
engine and you'll notice that since the
operating system is what makes a
decision about what is in memory versus
what is in disk we can't really do much
in terms of controlling that the
operating system is pretty smart about
managing memory so it's usually not a
bad algorithm but database doesn't get
to decide or contribute its opinion
about what winds up in physical memory
versus what winds up on disk and if
you're curious what the way virtual
memory works in general just Google
virtual memory and storage systems and
you it's the same algorithms that are
used to manage memory inside the
operating system for all programs okay
now it's time for quiz which of the
following statements about the N map v1
storage engine are true check all that
apply
the first is that M map offers document
level locking the second is that M app
automatically allocates power of two
sized documents with new documents are
inserted the third is an nmap is built
on top of the M map system call that
map's files into memory and the final
one is that my I'm going to be managing
the memory you
by each map file deciding which parts to
swap the disk so check the ones that you
think are correct


---

### Introduction to MMapStorage Engine

https://youtu.be/os3591KviNM

* man mmap (Unix system)
* 64 bit OS
* 100GB physical = 100GB Virtual Memory

**Characteristics**

1. Collection level concurrency (collection level locking) => Multiple reader - single writer
2. In-place updates
3. Power-of-2 size for initial allocate

storage engine of MongoDB and it uses
the M map system call under the covers
in order to implement storage management
let's look at what the M map system call
looks like it's right here if you do on
any UNIX machine if you man M map you'll
see that it talks about allocating
memory or mapping files or devices into
memory causes the pages starting in
address and continuing for most length
bytes to be mapped from the object
described by the file descriptor and an
offset so what does that really
practically mean well MongoDB needs a
place to put documents and it puts the
documents inside files and to do that
initially allocates let's say a large
file let's say allocates 100 gigabyte
file on disk so we want it with 100
gigabyte file on disk right here and
this disk may or may not be physically
contiguous on the actual disk because
there are some algorithms that occur
beneath that layer that control the
actual allocation of space and a disk
but from our standpoint it's 100
gigabyte contiguous file if my I'm going
to be calls the M map system call it can
map this file it's hundred gigabyte file
into 100 gigabytes of virtual memory now
to do that of course we need to be on a
64-bit computer because you could never
get a hundred gigabytes of virtual
memory space on the 32-bit computer
you'd be limited to 2 or 4 gigabytes and
these are all page sized so pages on an
operating system are either 4k or 16 K
large so there's a lot of them that I'm
not showing here and the operating
system is going to decide what can fit
in memory so if the actual physical
memory of the box is let's say 32
gigabytes then if I go to access one of
the pages in this memory space it may
not be in memory at any given time the
operating system decides which of these
pages are going to be in memory I'll
just say the green ones are in memory
and so when you go to read a document if
it hits a page that's in memory then you
get it and if it hits a page that's not
in memory let's say this page then the
operating system has to bring it from
disk this is on disk here as to bring it
from disk into memory before you can
access it and that's the basics of where
the M map storage engine works now the a
map storage engine offers collection
level concurrency or we sometimes call
it collection level locking
each collection inside MongoDB is its
own file if you look in data slash DB so
what that means is that if you have two
different operations going on at the
same time and they are in the same
collection one's gonna have to wait for
the other one if they are right because
it's a multiple reader single writer
lock that it takes so only one right can
happen at a time to a particular
collection but if there are different
collections then it could happen
simultaneously in addition the way this
story dungeon works and map v1 we allow
in place updates of data so the document
is sitting here in this little page
right here and you do an update to it
then we'll try to update it right in
place and if we can't update it then
what we'll do is we'll mark it as a
whole and then we'll move it somewhere
else where there is more space so well
maybe move it over here or something and
then we'll update it over there in order
to make it more likely that we can
update a document in place without
having to move it we use power of two
sizes when we allocate the initial
storage for a document what that means
is that if you try to create a three by
document you're gonna get four bytes if
you try to create a seven by document
you're gonna get eight bytes a 19 byte
document you're gonna get 32 bytes and
this way it's more likely that you can
grow the document a little bit and that
space that opens up that we can reuse it
more easily so that's the EM map storage
engine and you'll notice that since the
operating system is what makes a
decision about what is in memory versus
what is in disk we can't really do much
in terms of controlling that the
operating system is pretty smart about
managing memory so it's usually not a
bad algorithm but database doesn't get
to decide or contribute its opinion
about what winds up in physical memory
versus what winds up on disk and if
you're curious what the way virtual
memory works in general just Google
virtual memory and storage systems and
you it's the same algorithms that are
used to manage memory inside the
operating system for all programs okay
now it's time for quiz which of the
following statements about the N map v1
storage engine are true check all that
apply
the first is that M map offers document
level locking the second is that M app
automatically allocates power of two
sized documents with new documents are
inserted the third is an nmap is built
on top of the M map system call that
map's files into memory and the final
one is that my I'm going to be managing
the memory you
by each map file deciding which parts to
swap the disk so check the ones that you
think are correct


**The correct answers are:**

* MMAPv1 automatically allocates power-of-two-sized documents when new documents are inserted
This is handled by the storage engine.
* MMAPv1 is built on top of the mmap system call that maps files into memory
This is the basic idea behind why we call it MMAPv1.

Wrong ones are:

* MMAPv1 offers document-level locking
It has collection level locking.
* MongoDB manages the memory used by each mapped file, deciding which parts to swap to disk.
The operating system handles this.

---

### Introduction to WiredTiger

https://youtu.be/aNsugW7r3mM


1. Document level concurrency (one write at the time)
2. Compresssion (of data and indexes)
3. No In-place update (append only)
4. `db.foo.stats()`

All right.
Now you know about the MMAP storage engine.
Let's talk about the Wired Tiger storage engine.
This storage is not turned on by default inside MongoDB in 3.0
but it offers some interesting features,
and for a lot of workloads, it is faster.
The first is that it offers document level concurrency.
Now, we don't call it document level locking because it's
actually a lock free implementation which
has an optimistic concurrency model where the storage
engine assumes that two writes are not going
to be to the same document, and if they are
to the same document, then one of those writes
is unwound and has to try again, and it's
invisible to the actual application.
But we do get this document level concurrency
versus collection level concurrency in the MMAP storage
engine, and that's a huge win.
The second is that this storage engine offers compression,
both of the documents themselves, of the data,
and of the indexes.
And it's beyond the scope of this course
to go over exactly how all this works, but just very broadly,
the Wired Tiger storage engine.
We talked before about having a 100 gigabyte file,
and if you had a 100 gigabyte file on disk using Wired Tiger,
Wired Tiger itself manages the memory that
is used to access that file.
So the file is brought in in pages,
and the pages can be of varying sizes,
and Wired Tiger decides which blocks
it's going to keep in memory and which
blocks to send back to disk.
So it's because Wired Tiger is managing its own storage
that Wired Tiger can, for instance, compress.
You don't want to keep it compressed in memory
because when you have read access to a document,
if they hit memory and they hit your cache of data
that's in memory, you don't want to have to decompress it.
And with Wired Tiger, you don't have to
because it's kept in the clear in memory,
but before they write out the disk, they can compress it,
and that saves a tremendous amount of space
for certain types of data.
And if you think about MongoDB, the keys
are often repeated in every single document,
so there's a lot of opportunities for compression.
Wired Tiger is also an append only storage engine.
There are no in place updates.
That means that if you update a document in Wired Tiger, what
they're going to do is they're going
to mark that the document is no longer used
and they're going to allocate new space somewhere
else on disk and they're going to write it there.
And eventually, they reclaim the space that is no longer used.
This can result in writing a lot of data sometimes.
If you have very large documents and you only update one item,
Wired Tiger is going to have to write that entire document
again, but it's this append only nature
of the way they store the data that
allows it to run without locks at the document level
and gives them the document level concurrency.
So overall, it's often faster.
If you want to start the database with the Wired Tiger
storage engine, you can do it using
the flag -storageEngine and then after that, wired tiger.
My handwriting's kind of poor, so I'm
going to show you on the screen what this looks like.
So the first thing you want to do
is kill your existing mongod process,
and then you can create a new directory, for instance, called
WT for Wired Tiger, and then you could start Mongo
by telling it to use that directory, dbpath Wired Tiger.
That tells it to use this Wired Tiger directory.
I'll do .WT, although I don't think I need that.
Actually, I don't think I need that.
dbpath WT, put the files in that directory,
and then I would need to give it the storageEngine flag
and then say Wired Tiger.
So mongod -dbpath.
Normally, it defaults into /data/db if you don't give it
any arguments, but we need a new directory because the Wired
Tiger storage engine cannot open the files created by MMAP V1.
So if you have been running MongoDB on your computer,
on your desktop, for example, and you kill it,
and you try to start up using storage engine Wired Tiger,
it won't work because it can't read those files.
So if we hit Return, you can see that Wired Tiger is starting
and it's listening on 27017, and that if we just
clear the screen and connect using Mongo,
then we can do db.foo.insert name andrew.
And now we've written something into a Wired Tiger based
storage engine inside MongoDB.
And if I want to know that it is a Wired Tiger based storage
engine, I'm in the test database right
now and the foo collection.
If you call db.foo.stats, you can
see it tells you a bunch of things about the stats,
about this collection, including its size, which is small,
and that it has this Wired Tiger key that tells you that it's
a Wired Tiger collection.
So that's it.
Now it's time for a quiz.
Which of the following are features of the Wired Tiger
storage engine?
Check all that apply.
In place update of documents, power of two document padding,
document level concurrency, compression, and turbocharged.
Which of these are true?


---

### Indexes

https://youtu.be/U3iWPF5jP-g


okay let's talk about indexes now and
their impact on database performance now
this is an imagined collection right
here of a bunch of documents and the
documents might have the form shown
right here this is a collection and
these documents might be on disk in
essentially arbitrary order and whether
you're talking about an Map v1 or Wired
Tiger there might be no particular order
to the documents on disk now if there's
no index and you wanted to find all the
documents where let's say name was Zoe
you would need to scan every document in
the collection and there could be
millions of those and this collection
scan or a table scan as it's called in a
relational world is just death to
performance it's probably the single
greatest factor on whether or not your
queries are going to perform well more
important than the speed of the CPU more
important than how much memory you have
is whether or not you can use some sort
of index to avoid having to look at the
entire collection so how does the index
work what what is an index well an index
is an ordered set of things so imagine
that we just had a simple index on let's
say the name and so if we had a simple
index in the name you can think of it as
an ordered list of things for instance
Andrew might be on the left because it's
alphabetically early and Zoe might be on
the right in the middle might be Barry
and Charlie etc and each of these index
points has a pointer to a physical
record so it's going to have some sort
of pointer to a location on a disk or
maybe the underscore ID for the document
you can find the records so Barry record
might be right here charlie record might
be right there Zoe record might be right
there the nice thing about having
something that's ordered is it's very
fast to search it because if it was
actually a linear list like this and
it's it's not in a typical database but
if it was linear like this then you
could search it using a binary search
and it would take you log two of the
number of items in this list in real
databases and in MongoDB the actual way
that this index is structured is called
a b-tree and looking at what a b-tree is
is look beyond the scope of this course
but if you just go on Google and search
for beech tree you'll get to a great
Wikipedia page that explains it pretty
well so you're going to want to put
these indexes on the item
that you believe you're gonna be
querying on because that's gonna make
querying much faster but sometimes we
don't just want to query on let's say
name we also want to query on name and
maybe hair color so how would that work
well an index on name in the hair color
would be represented as follows you'd
write name comma hair color and that's
ordered and if you did that then all of
the index entries would be ordered by
name comma hair color so for instance
there might be an index entry for Andrew
comma blonde and that's gonna be a
single index entry which I'll represent
by making it green like this and then
there might be another index entry for
Andrew comma red and again that's just
one index entry right here so we have
another index entry here and Andrew
blonde might refer to this document here
Andrew red might refer to this document
here and then you might have one for
Barry brown hair and then that's going
to be right here and maybe that points
over here and then another one for Barry
red which might be a document that is
over there and then in the far corner
here let's say have another index entry
for Zoey and then let's say red and
maybe that document is somewhere over
there these documents which I'll show
you where they are they're in the order
of name comma hair color so you can kind
of see that if you wanted to find let's
say all the berries with a certain color
hair you could do it pretty easily
because you could again do a binary
search of the structure and then do it
again through this part of the structure
define let's say Barry with red hair you
could also do range queries so you could
say find me all the berries with hair
that's greater than or equal to brown
and less than or equal to red that would
also work but if on the other hand you
specified just the hair color you'd kind
of be stuck right because if I said just
find me all the people with hair color
red
there's sort of all over the place right
and they're not ordered in any
particular way in this larger structure
so I can't use a binary search to find
them so as a result whenever I'm using
an index I need to use a leftmost set of
things so if the index were let's say
extended and included the date of birth
then I could search on just the name
that would work in this index so then I
could just do a nice little search or I
could search on the name in the hair
color or I could search the name in the
hair color in the date of birth but I
can't come in with just the date of
birth or just the hair color because
then I have no way of searching this
this index so let me review what I just
said if you have an index and indexes
are going to be described this way when
we talk about them of a B and C then you
can search on a you can search on a B
you can search on ABC C alone no C comma
B no and if you searched on let's say a
comma C then it's sort of a partial yes
because it would use the index for the a
portion and have to search to all of
them in the C portion the other point I
want to make is that indexing is not
free because whenever you change
something in a document which affects
the index you're gonna have to update
that index you're gonna have to write it
on memory and eventually on disk now the
indexes aren't represented the way I did
linearly they were represented as B
trees but maintain these B trees takes
time so as a result if you have a
collection and you have indexes on that
collection and the writes affect items
that were indexed the writes will be
slower than if there was no index that's
right indexing actually slows down your
rights but your reads will be much
faster now if you were just writing and
you never wanted to ever ever find a
document you might not want to have an
index because then you can insert the
document it would be inserted anywhere
on the disk
it doesn't wouldn't matter where and
there'll be no index to maintain and in
fact one of the strategies when
inserting a very large amount of data
inside a database is to have no indexes
on the actual collection at all to
insert all the data and then after all
the data is inserted then add the
indexes and then build the indexes that
way you don't have to incur maintain the
indexes while you add data
mentally and the fact that rights are
slower and the fact that it takes time
to update an index on every single write
that affects anything in index is one of
the reasons why you don't just want to
have an index on every single key in a
collection because we had an index and
every single key in the collection then
you're going to slow down your writes
more and you're going to use a lot more
disk space to to maintain those indexes
and this want to point out that if you
had 10 million items in a collection and
there's no index and you search on
something anything you know look at 10
million documents and that's pretty
expensive and if you have to look at 10
million documents or 100 million
documents and the amount of memory you
have is much smaller than the amount of
disk or space that the documents
represent on disk then you're going to
wind up swapping all those documents to
memory and creating a tremendous amount
of disk i/o which is going to be pretty
slow and this is what indexing is so
absolutely critical to performance all
right now it is time for quiz which
optimization will typically have the
greatest impact on the performance of a
database you can see there are four
choices here adding memory so that the
working set fits in memory adding a
faster drives that the operations that
hit the disk will happen more quickly
replacing your CPU with the faster one
say twice as fast or adding appropriate
indexes on large collections that's only
a small percentage of the queries need
to scan the collection check the right
answer


---

### Indexes

okay let's talk about indexes now and
their impact on database performance now
this is an imagined collection right
here of a bunch of documents and the
documents might have the form shown
right here this is a collection and
these documents might be on disk in
essentially arbitrary order and whether
you're talking about an Map v1 or Wired
Tiger there might be no particular order
to the documents on disk now if there's
no index and you wanted to find all the
documents where let's say name was Zoe
you would need to scan every document in
the collection and there could be
millions of those and this collection
scan or a table scan as it's called in a
relational world is just death to
performance it's probably the single
greatest factor on whether or not your
queries are going to perform well more
important than the speed of the CPU more
important than how much memory you have
is whether or not you can use some sort
of index to avoid having to look at the
entire collection so how does the index
work what what is an index well an index
is an ordered set of things so imagine
that we just had a simple index on let's
say the name and so if we had a simple
index in the name you can think of it as
an ordered list of things for instance
Andrew might be on the left because it's
alphabetically early and Zoe might be on
the right in the middle might be Barry
and Charlie etc and each of these index
points has a pointer to a physical
record so it's going to have some sort
of pointer to a location on a disk or
maybe the underscore ID for the document
you can find the records so Barry record
might be right here charlie record might
be right there Zoe record might be right
there the nice thing about having
something that's ordered is it's very
fast to search it because if it was
actually a linear list like this and
it's it's not in a typical database but
if it was linear like this then you
could search it using a binary search
and it would take you log two of the
number of items in this list in real
databases and in MongoDB the actual way
that this index is structured is called
a b-tree and looking at what a b-tree is
is look beyond the scope of this course
but if you just go on Google and search
for beech tree you'll get to a great
Wikipedia page that explains it pretty
well so you're going to want to put
these indexes on the item
that you believe you're gonna be
querying on because that's gonna make
querying much faster but sometimes we
don't just want to query on let's say
name we also want to query on name and
maybe hair color so how would that work
well an index on name in the hair color
would be represented as follows you'd
write name comma hair color and that's
ordered and if you did that then all of
the index entries would be ordered by
name comma hair color so for instance
there might be an index entry for Andrew
comma blonde and that's gonna be a
single index entry which I'll represent
by making it green like this and then
there might be another index entry for
Andrew comma red and again that's just
one index entry right here so we have
another index entry here and Andrew
blonde might refer to this document here
Andrew red might refer to this document
here and then you might have one for
Barry brown hair and then that's going
to be right here and maybe that points
over here and then another one for Barry
red which might be a document that is
over there and then in the far corner
here let's say have another index entry
for Zoey and then let's say red and
maybe that document is somewhere over
there these documents which I'll show
you where they are they're in the order
of name comma hair color so you can kind
of see that if you wanted to find let's
say all the berries with a certain color
hair you could do it pretty easily
because you could again do a binary
search of the structure and then do it
again through this part of the structure
define let's say Barry with red hair you
could also do range queries so you could
say find me all the berries with hair
that's greater than or equal to brown
and less than or equal to red that would
also work but if on the other hand you
specified just the hair color you'd kind
of be stuck right because if I said just
find me all the people with hair color
red
there's sort of all over the place right
and they're not ordered in any
particular way in this larger structure
so I can't use a binary search to find
them so as a result whenever I'm using
an index I need to use a leftmost set of
things so if the index were let's say
extended and included the date of birth
then I could search on just the name
that would work in this index so then I
could just do a nice little search or I
could search on the name in the hair
color or I could search the name in the
hair color in the date of birth but I
can't come in with just the date of
birth or just the hair color because
then I have no way of searching this
this index so let me review what I just
said if you have an index and indexes
are going to be described this way when
we talk about them of a B and C then you
can search on a you can search on a B
you can search on ABC C alone no C comma
B no and if you searched on let's say a
comma C then it's sort of a partial yes
because it would use the index for the a
portion and have to search to all of
them in the C portion the other point I
want to make is that indexing is not
free because whenever you change
something in a document which affects
the index you're gonna have to update
that index you're gonna have to write it
on memory and eventually on disk now the
indexes aren't represented the way I did
linearly they were represented as B
trees but maintain these B trees takes
time so as a result if you have a
collection and you have indexes on that
collection and the writes affect items
that were indexed the writes will be
slower than if there was no index that's
right indexing actually slows down your
rights but your reads will be much
faster now if you were just writing and
you never wanted to ever ever find a
document you might not want to have an
index because then you can insert the
document it would be inserted anywhere
on the disk
it doesn't wouldn't matter where and
there'll be no index to maintain and in
fact one of the strategies when
inserting a very large amount of data
inside a database is to have no indexes
on the actual collection at all to
insert all the data and then after all
the data is inserted then add the
indexes and then build the indexes that
way you don't have to incur maintain the
indexes while you add data
mentally and the fact that rights are
slower and the fact that it takes time
to update an index on every single write
that affects anything in index is one of
the reasons why you don't just want to
have an index on every single key in a
collection because we had an index and
every single key in the collection then
you're going to slow down your writes
more and you're going to use a lot more
disk space to to maintain those indexes
and this want to point out that if you
had 10 million items in a collection and
there's no index and you search on
something anything you know look at 10
million documents and that's pretty
expensive and if you have to look at 10
million documents or 100 million
documents and the amount of memory you
have is much smaller than the amount of
disk or space that the documents
represent on disk then you're going to
wind up swapping all those documents to
memory and creating a tremendous amount
of disk i/o which is going to be pretty
slow and this is what indexing is so
absolutely critical to performance all
right now it is time for quiz which
optimization will typically have the
greatest impact on the performance of a
database you can see there are four
choices here adding memory so that the
working set fits in memory adding a
faster drives that the operations that
hit the disk will happen more quickly
replacing your CPU with the faster one
say twice as fast or adding appropriate
indexes on large collections that's only
a small percentage of the queries need
to scan the collection check the right
answer


---

### Creating Indexes

https://youtu.be/xi2gtzZez6Q

    db.students.createIndex({class:1 , student_name:1})
    db.students.explain().find({student_id:5})
    db.students.explain(true).find({student_id:5})

now I'd like to show you a large
collection and the impact that indexes
can have on performance so I've loaded
up ten million documents into a
collection and I'm going to show you
that in the Mongo shell it's in the
school database in the students
collection and I'm going to look at a
single document in the collection which
is a great way to get an understanding
of what the data looks like assuming its
regular and it is in this case so you
can see each document has a student ID
and a bunch of scores for the student
these are for assessments an exam a quiz
a homework and a homework this is the
grades they got in this particular class
and so there are ten million documents
so there's 1 million students that have
each taken ten classes now there's
absolutely no indexes on this collection
so let's see how long it would take to
do a query on this collection and try to
find all the information for student ID
let's say five which would be very early
in the collection because we just
inserted it it was probably inserted in
order on the disk and I'm running the EM
map b1 storage engine in this case all
right let's do that
all right that took a few seconds to
return those ten documents and this is a
fast computer this is a four gigahertz
core i7 computer with 32 gigabytes of
memory and a fusion drive that has a
combination of SSD and spinning discs on
it so that's a long time that's a lot of
cycles for a computer this fast so the
question is how can we make it faster
but before I do that I want to show you
a couple things first is that there is
an explain command that we're going to
go over in a later lesson that will show
you the secrets of what the database is
doing when it executes a query and I
want to give you a little foreshadowing
of this command it runs on top of a
collection so DB dot students students
is the collection explain is the command
and then you chain what you want to do
in this case you want to do a find you
can also change update or delete and
it's going to tell you what indexes it
would have used to satisfy this query
now in this case there aren't any
indexes it can use and it's going to
scan all 10 million documents and it
should tell us that so if we look
through the output of explain and we'll
go through it in more detail in a later
lesson the interesting part is right
here
in the winning plans section where you
can see it says it's doing a collection
scan it's looking at all the documents
and that's that's gonna be pretty slow
now if we actually did a find one versus
a find then it'll be faster and the
reason it'll be faster is that once it
finds a single document it can quit
looking and so since the documents are
probably in student ID order
approximately right now that's gonna be
fairly fast and you can see that was
fast didn't take very long for it to
return a single document for the student
95 but we want a general fine to work
well so we want to add an index so how
do we do that let's add the index DB
students dot create index and you'll
notice it's camelcase inside the shell
lower case c upper case eye and now
we're going to present the document to
create index that describes the index
and in this case we're saying we want it
to be indexed on student ID ascending
we'll talk a little bit more about what
that means later but we're gonna hit
return this is gonna take a while so I'm
gonna time this off camera so that I can
tell you how long it took on this
superfast computer here we go okay
it took about 23 seconds on this
computer to create this index and that's
important to note because even on a
really fast computer creating index
takes a while because we have to scan
the entire collection create new data
structures and write them all to disk
all right now that we have an index this
search on finding all the students with
student ID 5 should be nice and fast
let's see if it is woof
nice and fast and it was and if we run
the explain command we're gonna see that
it's now using an index so let's see
that all right so I ran the explain
command once again and you can see now
it says the winning plan for this type
of query is to use the index name
student underscore ID 1 and that's
fantastic and one little other secret
I'll tell you about explain is that if
we give it true and there's two ways to
give arguments to explain this is
actually the older one then it'll
actually run the query as well which
means it can tell us how many documents
it actually looked at in the execution
stage of the query
and you can see that number of documents
examined was exactly ten isn't that
pretty cool so once it used the index it
only had to actually look at ten
documents Wow that's fantastic
all right now we could also add a
compound index to this collection and if
we wanted to add a compound index we
would do it as such we would give a
second key and then ascending or
descending so for instance this is the
command you'd give to create an index on
student ID comma class ID where the
student ID part was ascending and the
class ID part was descending and this
won't affect the queries we just did but
it will affect things like sorting where
if the indexes aren't in the right order
and depending on how you specify the
sort you may not be able to use the
index okay
so now it is time for a quiz please
provide the Mongo show command to add an
index to a collection name students
having the index key be class comma
student underscore name and neither of
these will be in the - one direction
type your answer right here

---

### Discovering and Deleting Indexes

https://youtu.be/dX49IcmTrGA

okay now we know how to create indexes
on a collection how would you discover
what indexes are already on the
collection well we can do that with the
get indexes command so I'm going to
start the Mongo shell again and once
again I'm going to use the school
database and then i'm going to call DB
students that get indexes students is
the name of the collection and as you
remember in the last lesson we just
added an index to it for student ID
we're going to call get indexes and if
we do that we get back this result which
is a document actually it's an array of
two documents and the first one tells
you that there is an index on underscore
ID now this index exists in all
collections and you can't delete it
there's also an index on student
underscore ID and that's the index we
just created and if we wanted to get rid
of that index we would call DB dot
students dot drop index and provide this
exact same signature as when we created
it so here we're calling drop index and
we're giving the same signature student
underscore ID colon one that we gave
when we created the index and if we do
that we should be able to drop it and
there you go numb indexes was two and
now it's one and if we get indexes again
we'll see that in fact there is only one
index perfect all right one last point I
want to make is that this call get
indexes is a call that you use in
MongoDB 30 and we'll work on both wired
tiger & M map v1 and in earlier versions
of a database you could look at a
special collection system that indexes
to see what indexes existed that does
not work in wire tiger and so the
preferred way to figure out what indexes
are on a collection is to do this the
call DB dot students that it get indexes
and again is a change in MongoDB 30


--

### Multikey Indexes

https://youtu.be/_NGwn_X82Dw

let's talk about creating indexes on
arrays we call these indexes multi key
indexes so imagine you have a collection
of documents that look similar to this
this document has named Andrew tags
photography hiking and golf some of my
passions color red I don't know why I
just picked it and then location is also
an array New York comma California you
can create an index on tax and if you do
that then when MongoDB indexes the
collection and if this document were
already in there then it would create an
index point for photography hiking and
golf you could also create an index on
if you wanted tags comma color and in
that case MongoDB would create for
instance for this document index points
for photography red hiking red and golf
read now multi key indexes become multi
key indexes when the database realizes
that there is a document with an array
as one of the keys of the index and
there are restrictions on the use of
multi key indexes in particular you
can't have two items of a compound index
this is a compound index where both of
them are arrays so for instance this
index would not be legal tags comma
location if there was already a document
in the collection we're both tags and
location were arrays and when mom would
be would tell you as it can't index
parallel arrays and the reason is
there's an explosion of index points
that created because it has to create
index point for the Cartesian product of
the items in the arrays and it doesn't
permit that and the other thing to
remember is that when you first create
an index if there's let's say nothing in
the collection mom gonna be doesn't know
that there may be an array at for
instance in tags in the future and so an
index only becomes multi key when the
first document gets added and it has as
its value for one of the keys an array
so that sounds kind of complicated let's
go through it concretely and look inside
the shell to get a better understanding
of how this works all right so let's
start the Mongo shell we have a food
collection which is empty we're gonna
create a simple document where a is 1
and B is 2
okay and if we do that it gets inserted
and you can see it's in there no problem
now if we wanted to create an index on a
comma B we could do that by typing DB
dot foo dot create index a ascending B
ascending there was one of the Knicks
now there are two and if we use our
friend the explain command that we're
getting to know better and better the
food collection call explained and then
do a find where let's say a is one
perfectly reasonable query a is 1 and B
is 1 we'll say we can look here and we
can see that in the query planner stage
of this explain output it tells us about
the winning plan and the winning plan
was to use an index scan on the index a
underscore one B underscore one and
that's the name for the a comma B index
if we do get indexes we'd see that and
it tells us that it is not a multi key
index okay fair enough well that makes
sense I mean there's not much in this
thing we saw that all there is is the
single document and it doesn't have an
array as either part but now let's
insert something else into here let's
insert a document where a is 3 and B is
an array 3 comma 5 comma 7 now if we did
that now at this point if we run the
exact same query we ran before and we do
a find of a comma 1 become a 1 and we
run it through the explain command then
what output will we get let's see
well once again it tells us that's using
this index a comma B a underscore 1 B
underscore 1 index but this time it says
multi key true and if we of course
issued this command without the explain
it would find exactly no documents
because there are no documents that
satisfy this criteria now let's see what
was in the collection so we can get a
better query we have a comma 3 and B
comma 5 let's look for documents that
have a comma 3 and become a 5 that'll be
in there a comma 3 become a 5 now if we
did that then we get the 1 document
right there and again if we look at it
with explain we'll see that that query
also for
says the same result telling us that
it's using the multi key index the index
has been great it's a multi key and
again if you do get indexes on this
collection you'll see that the index is
called a underscore 1b underscore one
which is what we saw inside the explain
output but let's say we did something
else let's say that we actually now
inserted something in this collection
where both a and B were is like for
instance three four five and B is seven
eight nine if we insert something into
the collection where both a and B are
arrays it's not gonna work it's gonna
say I'm sorry I can't put anything into
this index where both a and B are both
arrays all right so this makes sense I
mean we have this collection and we can
see what's in it we can see that we have
two different documents and then the
second one B is a list or an array and a
is not well what if we wanted to insert
something where a was a list and B was a
scalar would that be okay and the answer
is yes because this is not a multi key
index in a way that says Oh B always has
to be an array it's it's a multi key
index and allows any combination so for
instance a can be an array and B can be
a scalar or B can be an array and they
can be a scalar and they're both legal
it's just that you can't have any one
document where both a and B in this
compound index are both arrays I hope
that's clear and the other thing is that
once index has been upgraded to multi
key even if you dropped all the
documents out of this collection it
would still say it was multi key we
didn't explain on the collection so the
key takeaways here is that you can add
indexes on arrays and you can create
compound indexes that include arrays but
when you have an index that is multi key
and where at least one document has a
value of being an array you can't have
multiple values of a compound index both
be an array that's not legal all right
it's time for a quiz multi key indexes
suppose we have a collection foo that
has an index created as follows foo
created an x a1 b1 this should seem very
familiar to you if you watched a lesson
which of these following inserts are
valid
this collection check all that apply

---

### Dot Notation and Multikey

https://youtu.be/wT0_ktAZbBg

**Creating index**

```
db.students.createIndex({'scores.score':1})
db.students.getIndexes();
```

**Find all scores.score with a value of 99 or above**

```
db.students.explain().find({'scores.score': {'$gt':99} })

"winningPlan": ...
	... "stage" : "IXSCAN"
	... "indexName" : "scores.score_1"
	... "isMultuKey" : true
	... "indexBounds" : { "scores.score" : [
				"(99.0, inf.0]"
				] }
```

**find all student with a exam with 99.8 or more score**
```
db.students.explain().find({'scores' : {$elemMatch: {type:'exam', score:{'$gt': 99.8} } } })
```


```
"winningPlan": {
	"stage" : "KEEP_MUTATIONS"
	... "scores" : {
			$elemMatch : {
				"$and" : [
					{"score": {"$gt":99.8} },
					{"type": {"$eq":"exam"} }
					]
				}
			}
	...
	},
	{
	... "stage" : "IXSCAN"
	... "indexName" : "scores.score_1"
	... "isMultuKey" : true
	... "indexBounds" : { "scores.score" : [
				"(99.8, inf.0]"
				] }
	}
```

The `$elemMatch` operator matches documents that contain an array field with at least one element that matches all the specified query criteria.


**Wrong query, but interesting**
db.students.explain().find({ '$and':[{'scores.type':'exam'},{'scores.score': {'$gt':99.8} }] }).pretty();


now I want to talk to you about how you
can use dot notation to reach deep into
a document and an index is something
that's in a sub document of the main
document and also doing this with things
that are arrays so combining multi key
with dot notation this is a pretty cool
feature of MongoDB it's a little tricky
to explain how it works and may not
exactly as you expect so let me show you
some examples alright I'm back in the
Mongo shell now and I'm gonna look at
this students collection once again so
DB dot students dot find one this is the
same collection we looked at in the
previous lesson and it has these
documents that have structure where
there's a student ID and then there's a
scores array and the scores array has a
bunch of documents as elements of the
array where each document has a type
exam and a score and it's also a class
ID so let's say we wanted to index on
this score itself we can do that the
call would be as follows
DB taught students that create index
scores that score is one that's how we
would do it that's what we'd create an
index that would index this array and
this sub part of this document and I did
this off camera because it took about
fifteen or twenty minutes to create this
index because there's ten million
documents there's four elements in this
array and it took a long time so you can
see what indexes are on it on the
collection we'll do that right now
and if you call DB get indexes you can
see there are now two indexes on the
collection one of them is an underscore
ID and the other one is on scores dot
score which is our multi key index so
what can you do with that well first of
all you could search for records where
any score was above a certain value so
let's look what that query looks like
this will find everything where scores
dot score is greater than 99 and I'm
actually more interested in
understanding what the query optimizer
does with it then actually seeing the
results so I'm using explain to return
that information let's do that and if we
did that query you can see that it's
gonna do an index scan it says right
here winning plan included the scores
dot score index in the forward direction
that looked for things with scores that
scores between ninety nine point zero
and infinity and that's how it retrieved
this information and if we wanted to see
that information we could just remove
the explain part of this
and then we'll get some documents back
where there is a at least one score
above 99 that's pretty printed so we can
see that more clearly and you can see
that in this case it was the homework
that was above 99 so what if we wanted
to find people that had an exam score
that was above 99 how would we do that
now I'm going to show you the query and
then I'll show you a query that I used
before I looked into it more carefully
that turned out to be wrong I think it's
an interesting example because it's easy
to get confused about this so the query
that would search for all the students
where an exam score was above 99 looks
like this and it uses this LM match
operator so we're gonna go through this
very carefully it's actually being run
with explain right now but let's look at
it so we're trying to inspect the scores
array inside the document and then we
want to find a document which has an
element of the array that is of type
exam and a score greater than 99 point 8
and to do that we use this operator
called LM match and what LM match does
and you can look this up in
documentation is it matches documents
that contain an array filled with at
least one element that matches all the
specified query criteria so in other
words there might be more than one
element and won't be more than one exam
in this array that matched this criteria
but we're going to make sure that we
match at least one with all of this
criteria so it's looking for an element
that's of type exam and score greater
than 99.8 and if we do that let's first
just get the results so we can confirm
that works so I'm gonna pretty print the
result we see that we get something that
has an exam score above 99.8 works
perfectly well it's very nice I wonder
how many records there are just a
curiosity that would satisfy this
criteria and the answer is that there
are 20,000 278 students that satisfy
this criteria of having an exam score
greater than 99 point 8 in this somewhat
random dataset of 10 million documents
all right well what does the explain
output look like for this because that's
that's sort of an interesting question
to me all right
let's run this with explain now to see
what the query optimizer is going to do
to satisfy this query and to do that I
need to remove this count at the end
I just need to do and explain tell it
that I want to see what it would do with
this find command it's gonna run that
and it's pretty interesting we're gonna
go over explain a more detail but you
can see as well a lot of information
here but the winning plan it's kind of
easier to read this from the bottom to
the top because actually you can't quite
tell but this is the first thing it runs
I believe it says that first it runs a
query on scores that score being
ninety-nine point eight to infinity okay
that makes perfect sense because that's
what the index is
so it can't do any better than to look
at the scores dot score key and then
after that it runs the output of that
this is an index scan into the next
stage where it does it finds all the
documents are satisfy that criteria
which is probably 10 X or 4 5 X the
number of documents that would have an
exam of that score and then it runs the
LM match and it says you know what I
want to find something with a score
that's greater than ninety nine point
eight and a type that's exam calls this
a fetch I don't believe it anything
special I can do here I think it
actually iterates through every single
document and inspects them and we could
confirm that by running it with value
true and let it execute the query so we
know how many documents it examines and
the answer is that it examined so right
here we can see the explained output a
little bit hard to read on the screen
but again we have the winning plan
information it's exactly the same as
before
but now we have some additional
information called execution stats and
we just kind of go through here and look
at what's interesting and then we can
see that it returned twenty thousand
documents okay it makes sense but it
examined eighty thousand documents
Wow okay and you know what that number
is it's probably the number of documents
that have score above ninety nine point
eight so let's just confirm it that's
true score greater than nine nine point
eight give me a count of those and there
are 80 thousand 54 documents that have
score greater than ninety-nine point
eight and it examined every single one
of them for this query let's see if we
can find this information here the
execution stats for the query and you
can see it examined eighty thousand
fifty-four documents to return 20200 78
documents that's because the way the
MongoDB went through this query is it
used the index it had which was on
scores dot score and then after that it
just essentially did a scan of
everything that resulted to do the Ln
match part of it all right now what
mistake did I make when I was setting
this lesson up and thinking about it
that turned out to be wrong and the
answer is I try to use this query and I
won't go through it too carefully but I
want to show it to you because it
confused me all right here's the query I
tried to use to get the answer of every
student that had the exam above 99.8 I
tried to use the and operator and said
you know what I want to find things
where scores that type is exam and
scores that score is greater than
ninety-nine point eight and when I did
that you know what I found I found
documents that look like this I found
documents where there is a scoring
greater than ninety nine point eight but
I wasn't for the exam really interesting
huh so actually if you use this and
operator there's no guarantee that when
it finds a document that satisfies this
criteria without the Ln match part that
it satisfies this criteria in the same
sub part it might be a different part
and this really comes out when you look
at the explained output actually they
explained out but it helps you
understand the way the database
interpreted this query and once you see
this explained output you're like oh
yeah of course makes perfect sense
so the explained output said here's what
we're gonna do here's the winning plan
okay it said in the first stage in this
lowest level stage I want to find
everything with scores that score above
ninety nine point eight and pass that up
to the next stage and the next stage
should look for things with scores that
type equal exam oh dear that's not right
because basically it's returning all
these documents turning a huge number of
documents from this stage well we know
how many things like eighty thousand
students have ninety-nine point eight
and above so first it does this query
finds all the students with us with any
score above ninety nine point eight then
it passed it to this next stage and says
now finding all the documents which
scores that type is equal to exam and
that's not going to work because that is
going to give you things where the score
was not for the actual exam now compare
that output - what output we got for the
correct query with the LM match when we
use the
correct query for this look at the
output very different in that case the
first stage of the query did the exact
same thing it looked for things with
scores that score above ninety nine
point eight but in the second stage we
didn't just look for things of type exam
we looked for an element match where
both conditions were true where the
score was again ninety-nine point eight
we've reaffirmed that this was true for
the document and that the type was exam
all right that's a lot of information
but I hope that helps better explain no
pun intended
how that works okay it's time for quiz
suppose you have a collection called
people the database earth and documents
in the following form you can see the
documents here what would be the command
in the Mongo shell to create an index on
company descending please type your
answer right down here

Suppose you have a collection called people in the database earth with documents of the following form:

```
{
    "_id" : ObjectId("551458821b87e1799edbebc4"),
    "name" : "Eliot Horowitz",
    "work_history" : [
        {
            "company" : "DoubleClick",
            "position" : "Software Engineer"
        },
        {
            "company" : "ShopWiki",
            "position" : "Founder & CTO"
        },
        {
            "company" : "MongoDB",
            "position" : "Founder & CTO"
        }
    ]
}
```

```
db.people.createIndex({'work_history.company':-1})
```

---

### Index Creation Options, Unique

https://youtu.be/D-Ra5TEaaL4

**Insert data**
```
db.stuff.insert({'thing':'apple'});
db.stuff.insert({'thing':'pear'});
db.stuff.insert({'thing':'apple'});
```

**Create index**  

    db.stufff.createIndex({thing:1});

**Create unique index**  

    db.stufff.createIndex({thing:1}, {unique:true});

**Remove one element**  

    db.stuff.remove({thing:'apple'}, {justOne: true})

**Check index**  

    db.stuff.getIndexes();
    ... "unique": true


okay let's talk about unique indexes so
far all the indexes that we've created
have been non unique but you can also
create unique indexes that enforce the
constraint that the keys have to be
unique within the collection that no two
documents can have the same key if it's
indexed let's go into the Mongo shell
and demonstrate what we're talking about
we're gonna create a new collection
called stuff just to make sure that it's
really gone I'm gonna drop it now I'm
gonna insert some stuff into my stuff
collection alright I have inserted an
apple into the collection now I'm going
to insert a pair into the collection and
now I'm gonna insert another Apple into
the collection and now I'm gonna see
what's in the collection and we see two
apples and a pear now if we wanted to
create an index on this we certainly
could that would be no problem could
just do a create index on thing
ascending and works just fine but if we
want to create a unique index we cannot
let me show you what a unique index
would look like so let's drop the index
we just created and now let's create a
unique index
I'm gonna call create index but this
time we're gonna give one additional
document in this command rather than
just say create index thing one we're
gonna say unique is true and if we do
that what happens well we get an error
and the reason we get an error is
because it can't create a unique index
when there's two things inside this
collection that have the same value so
let's drop the offending one so let's
look at our stuff collection again and
we see we have two apples so let's
remove one of those apples we're gonna
do it this way we're going to call
remove we're going to find a document
that has thing Apple in it and we're
going to give one option to remove we're
going to say that just one is true we
want to remove just one if we do that we
get number removed one and now if we
look in the collection again we'll see
we only have one Apple and now we should
be able to add index that we want the
unique index thing one unique true no
problem we added the index and if we
want to insert something that's already
is in there like a pair we get a
duplicate key error
in addition if you look at the indexes
on stuff by calling DB stuff get indexes
you'll notice that the database tells
you that the index on thing is unique
now oddly it doesn't tell you that the
index on underscore ID is unique
although we've told you that the
majority index is unique and it isn't
unique so it's a vagary of the database
that it won't admit that underscore ID
is unique so we can prove that of course
it is unique because if we try to put
some documents into it let's say with
underscore ID Andrew and we try to put
two of those in there we're gonna find
that does not work DB that stuff
inserted let's try another one
duplicate key error on underscore ID
which is exactly the same error that we
see on this other duplicate key error
the e 11000 error on boat in both cases
so even though the database doesn't tell
you that they don't score ID index is
unique it is unique all right
so it's time for a quiz please provide
the Mangla show command to create a
unique index on student underscore ID
class underscore ID ascending for the
collection students type it below

    db.students.createIndex( {"student_id" : 1, "class_id" : 1 }, { "unique" : true } );

---

### Sparse Indexes

https://youtu.be/ZznHByqtTMA


alright we've shown you how to create
unique indexes and now i want to show
you how to create sparse indexes which
are indexes that can be used when the
index key is missing from some of the
documents now let's look at these four
documents here the first one has a B and
C the second one has a B and C the third
one is just a and B and the fourth one
has just a and B and you'll also notice
that the a values and the B values are
unique as are the C values if I wanted
to create a unique index on a that would
be no problem because you can see that
there's a unique value for a and in all
four of the documents and a appears on
all four documents any context on be
wouldn't be a problem but unique index
on C does pose a problem and the reason
is that if you just create a unique
index on see these documents both have a
see value of null and hence it would
violate the unique constraint to index
on C for all four documents you actually
could have a single document with null
in it for C or C missing I should say
and that would work fine but you
couldn't have multiple documents what's
a possible solution well one solution is
that you can specify the sparse option
when creating the index and what sparse
tells the database server is that it
should not include in the index
documents that are missing the key so if
you say give me an index on see it'll
say fine these documents go in the index
but these documents they won't even be
indexed by this index because they have
no value for C now let's see how this
would work in practice all right I've
created a small collection that I call
employees and that collection has just a
few employees and it actually form let's
see how many employees that have it has
five employees it has Elliott Dwight
Megan Andrew and Shannon there's a real
employees at the company and actually
these are their real employee ID numbers
in the sense that this is what order
they joined the company I think Elliott
set up the database so he made himself
one and made Dwight his co-founder to
and Megan Gill was still here and she's
number nine so you can imagine that we
probably want to have you
unique index on employee ID and I added
one to this collection but you might
also want to have unique index on cell
phone number because maybe you want to
make sure that no two employees claim to
be carrying the same cell phone number
well that would work fine except that
you can see that Andrew and Shannon
don't have cell phones and so if you
create a unique index without giving the
sparse option it's not going to work so
let me show you that so first let's look
at the indexes that already exist in the
collection by calling DB employees get
the nexus and we'll see that there are
two indexes right now in the collection
one of them is underscore ID and the
other one is on employee ID and is in
fact unique so if I just try to add an
index on cell phone cell ascending and
make that unique and you can see I get a
duplicate key error because we have more
than one employee that has no cell phone
number however if I specify an
additional option sparse true now I can
happily create the index I don't have an
index on the cell phone you can see that
I've got an index to underscore ID and
one an employee ID and one on the cell
phone which is also unique even though
both myself and Shannon are missing cell
phones in this collection we have these
five employees and two of them are
missing cell phones in the collection
now interestingly enough if you go
through all the documents and do a find
and then sort the documents by employee
ID which is one of our indexes you get a
sort by employee ID which is the order I
put them in anyway so it wasn't that
interesting but maybe descending is
slightly more interesting and that works
fine and if you ask the database didn't
use an index to satisfy that query by
using the explain command which we're
learning more and more about we can see
that here in the winning plan for this
fine sorted by employee ID it sorts the
documents using the employee ID key and
IX can that's going to be a very fast
sort and this collection very large that
could yield significant performance
advantages because we you're able to use
the index however if we do the exact
same type of sort but instead of sorting
on that sort on cell phone and we'll
just sort ascending on the cell phone
then
what we're going to find is if we look
here at the winning plan and the sort we
can see it did a full collection scan it
was not able to use that index on the
cell phones now why is that that's
because the database knows that this is
a sparse index and it knows that there
are entries missing that certain
documents are not indexed and if it uses
that index for the sort it knows it's
going to omit documents and it doesn't
want to omit the documents and so
instead it reverts to a collection scan
so you should keep in mind that a sparse
index can't be used for sorting if there
are any documents that are missing from
the index and that's probably why you
use the sparse index so it basically
can't be used for sorting so keep that
in mind now the good thing about a
sparse index is that it could use a lot
less space and that's one of the reasons
why you might want to use a sparse index
and of course it lets you create a
unique index when you don't have an
entry in every single document for the
key that you want to index on all right
now it's time for a quiz what are the
advantages of a sparse index check all
that apply the index will be smaller
than it would if it were not sparse you
gain greater flexibility with creating
unique indexes your indexes can be multi
key only if they are sparse and the
index can be used to store it much more
quickly in all cases please check the
answer


---

### Background Indexes

https://youtu.be/AchmKNj2qhw

**Lecture Notes**
At 1:19, Andrew says he thinks the index creation queues up on a per-database level; with MongoDB 2.4 
and later, you can create multiple background indexes in parallel even on the same database.

Beginning in MongoDB 2.6, creating an index in the background on the primary will cause the indexes to 
be created in the background on secondaries, as well. The secondaries will begin index creation when 
the primary completes building its index.

You can read up on background index creation [here](https://docs.mongodb.com/manual/core/index-creation/#index-creation-background).

Index Creation

|Index Creation||
|----------|----------|
|Foreground|Background|
|Fast|Slow|
|Blocks writes and readers in database|Dont block reads and writes|

**Foreground (Default), blocking**

    db.students.createIndex({'scores.score':1})

**Background, non blocking**

    db.students.createIndex({'scores.score':1}, {background:true})


alright now we know how to create
indexes and how to create unique indexes
and sparse indexes but the last concept
I want to discuss with you is whether or
not you create this index in the
foreground or the background so let's go
through the different options foreground
and background now foreground index
creation is the default in MongoDB and
the good thing about foreground index
creation is that it is relatively a
necessary relatively because it still
can be slow it is relatively fast and it
blocks all writers and readers in the
database that has the collection so a
foreground index creation is going to
block the writers and the readers in the
same database as the collection exists
even though we have / collection
database locking in MF v one storage
engine and in wire tiger there is
concurrency the document level even
though that's true if you do an index
creation in the foreground which is the
default you're going to block readers
and writers to the database other
databases you can still get to so you
have to do this probably not in the
production system so you got to be very
careful if you're going to do that and
the other option is you can do a
background index creation now background
ex creations are a bit slower relative
to the foreground index creation but
they don't block readers and writers you
can only have one background index
equation going on at a time after that
the next one will queue and wait I think
that is on a per database level and this
is probably a better way to create an
index however it's still fairly high
load the other way to create an index
very efficiently in a production system
is something we haven't talked about yet
but we'll get to a little bit in this
course toward the end which is to create
the index on a different server than the
one that you're using to serve most of
the queries so if you have a mom going
to be replica set and this is a concept
we're going to get to later on which is
a group of servers working together in
tandem then what you can do is you can
take one of them out of the set
temporarily only sending requests to
let's say this one and then run the
index creation in the foreground here
which could be much faster and then
after the index creation is finished
then you could bring them back in the
set and you can rotate around which
server takes most of the requests and in
doing this you can create an index in
the foreground on a server without
creating any form
penalty from the application standpoint
that's talking to this cluster of
database servers alright so again for
indexing is the default background
indexing is something you have to ask
for now let's go through and just try
this and play with it so we can see it
in action now right here I've got my
students collection again which had 10
million records remember from the
previous lessons and it has two indexes
on it and I've dropped the index on
scores score and if you recall it was a
very expensive index to create each of
these documents has an array of scores
and it just took a 20 minutes last time
so I'm going to run this in the
foreground and it's not going to
complete any time soon and then while I
do that I'm going to also take another
manga shell and use the school database
and then do DB students not find one and
you can see that I am in fact completely
blocked I'm getting nothing from the
database blocked it's too bad not block
from other databases so there I killed
it killed that request if I'm in a test
database and I do d b dot employees dot
find which i think is a collection that
should still be there then you can see i
can access that just fine it's in a
different database ok so lets go back
and run this in the background now and
then see if that works better so i'm
going to kill this index creation in the
foreground i hit control C in the shell
offered to kill the OP I said yes seems
to have killed the shell as well which
is fine and then I'm going to run Mongo
i'm going to use school again and now
i'm going to create this index in the
background so let's confirm it there is
no index first of all alright so there's
no index on scores dots score so that's
good so let's create one DB dot students
dot create index and put it on scores
dot score ascending and then give the
option for background true so I'm going
to say true to that and let's see I'm
going to check it looks ok hit return
and now it's going to go off and do this
in the background pretty darn slow I'm
still not going to get an immediate
response from the shell it's not going
to background the actual operation the
shell standpoint but now now that I've
done that I'm going to use school again
and then do d b dot students that find
one
and you can see that I successfully
queried this collection even while index
creation is going on in the background
and so that's how background indexes
work alright time for a quiz which of
the following are true about creating an
index in the background in MongoDB check
all that apply and here are the choices
MongoDB instance can only build one back
when the next at a time for database
although the database server will
continue to take requests a backward and
expiration still blocks the Mongo shell
creating indexed in the background takes
longer than the foreground and in Mongo
22 and above index are created in the
background by default all right and
please check your answer

---

### Using Explain

https://youtu.be/liXIn8CnJaI

**Old version**

    db.foo.find().explain()

**Prefered version**

    db.foo.explain().find()
                    .update()
                    .remove()
                    .aggregate()
    //Not with .insert()

**Help**

    db.foo.explain().help()

**Use a cursor**

    var cursor = db.example.find({a:99});
    cursor.explain();

**If we want execute the cursor**

    cursor.next();

**This will show the index a query is using**

    db.example.find({a:1, b:2}).explain()
    db.example.explain().find({a:1, b:2})
    db.example.explain().remove({a:1, b:2})
    var exp = db.example.explain(); exp.find({a:1, b:2})
    curs = db.example.find({a:1, b:2}); curs.explain()

**This wont work, because** `remove` **dont returns a cursor**

    db.example.find({a:1, b:2}).explain()


okay you've seen explaining more than a
few times during this unit but we
haven't really gone into any great
detail about what it does or how it
works so explain is used to find out
what the database is doing with your
query how its executing it what indexes
it's using and how many documents it
inspected when it actually ran the query
and the thing to remember about
explained is that in all cases where you
use and explain it doesn't bring the
data back from the database it may do
most of the work to do the query but
doesn't actually bring data back all the
way to the client so it's really used to
figure out what database would do if it
were gonna complete this query
completely but it isn't an entire
simulation of what it would happen if it
if you did the query second a lot of
what we've done in this unit shows you
how to use explain from the shell which
is one of the most useful places to
examine your performance of any
particular query but you can also use it
from the drivers and from your
application if you want now a MongoDB
3.0 we change the way explain works
especially in the shell we call this
explain to do internally the first thing
is that it used to be that you would
call DB dot let's say foo if there was a
query dot find and then that would
essentially produce a cursor and then
you would call explain after that but in
300 we changed it so that instead the
preferred method of using explain is to
call DB foo that explain and that
returns an explainable object and from
there the expendable object you can run
a find on you can also run an update on
you can run a remove on it and aggregate
and a few other things most notably you
can't run an insert on it so insert is
missing so you can't find out what the
query optimizer would have done for an
insert but honestly there isn't much to
learn about inserts because inserts it
puts the data in the database and it has
to update all the indexes and that's
really it so there's no find portion of
an insert there's a fine portion of an
update obviously I find the modify is
allowed here including help and there
are now helpers so if you're inside the
shell and you call DB dot foo dot
explain that help you're going to get
help to figure out which function you
can actually use with explain and again
this right here is returning
we call an explainable object now in the
next lesson not this one we're gonna go
over what parameters you can give to
explain in terms of verbosity but in
this one
we're just gonna use it it's the fault
form and see what it produces to
understand it
alright so let's go through some shell
work so we can see this thing in action
and understand it let's start the Mongo
shell and let's fill a collection with
some data and I'm gonna do that with
cheat a little bit I'm gonna copy
something that's gonna create
approximately 1 million documents and
this is just going to you could see it's
a nested loop of JavaScript 100 100 100
and then sending the a key the B key and
the C key and it's also setting the
underscore ID value to I believe just an
increasing integer so we'll do that it's
gonna take a little bit of time to
insert a million objects into the
database all right and now that's done
we edited out some of that time but it
took about 10 seconds now we're gonna
add some indexes to the collection well
first let's look at the collection so
you can see what it looks like so I
called this example so I'm going to do a
find one on it I'll just do a find on it
so you can see it and you can see that
it's got data where these underscore IDs
are increasing and then the a BC values
they're gonna go up 100 of time until
eventually the B value will increment
there you go now the B value is
incremented so you can see this just a
lot of data varying and a B and C now
let's add some indexes on this thing
let's add two compound indexes one on a
B and one on B so DB not example create
index a comma 1 B comma 1 all right so
we're adding index on a million objects
those are actually pretty fast and now
we're gonna add another index on just be
okay now we've got two other indexes
other than a no score ID index on this
collection now let's say that we wanted
to get an explainable object well let's
let's do it this way VAR exp equals DB
dot example dot explain and exp is an
explainable object and now we're going
to call well that's just for grins let's
just call it a XP help
so you can see what that produces and
you can see it tells you all these great
things you can do I can call fine I can
call group I can call remove and call
update it's very exciting so we're just
going to call find so exp dot find and
we'll look for one where a is 17 and B
is 55 and maybe we will also sort it by
B descending and you know we have two
indexes on here one of them is on a
comma B the other ones on B so you know
we're not sure exactly what indexes are
gonna get used to perform its query
although you might have a pretty good
guess if you understand the way indexes
work and so we'll do that and we get a
whole bunch of data back and in this
form which is the default form it's
gonna run it in query planner mode and
you can see here it first gives you a
form of the query that it used in the
index and this is a JSON representation
of an internal representation that the
server uses for the query and then it
shows you the plan this is the winning
plan the winning plan is the most
interesting part of course because the
winning plan is the one that actually
got chosen and it's good to read these
things from inwards to outwards and you
can see here that it said at the bottom
level here and sometimes there are
multiple input stages but here there's
just one you can see that it did a an IX
scan and used a and B of the index and
the index users a underscore one B
underscore one which we know is the
index on a comma B if you do a DB dot
example dot get indexes you'll see that
index it's not a multi key index and
decided to use it backwards which is
probably because of the sorting order
and right there it shows you the bounds
and since we only were looking for a
single document it just looked for
something with the bound 17:17 5555 it
also shows you the rejected plans in
this case and says well you know it
considered using the index on just B but
that turned out to be a worse choice and
so it didn't do it so this tells you
that the database actually use the index
that we expected it to use now there's
no magic to the way we did this by first
creating an explainable object we could
also have done it this way
DB data example that explained dot find
but the same thing and this will give
you the exact same result at first
getting an explainable
for the collection and then calling find
no difference you can see here we have a
rejected plan a B and an accepted plan
of using a underscore 1b underscore one
index so same exact result now in
earlier versions of MongoDB the way that
you would actually do an explain of this
is by calling example not find dot
explain that does something a little
different what that does is it gets back
a cursor because example that fine will
bring back a cursor with the explain set
on it but the results is saying when you
see it in this shell so you won't see
any differences you'll see the same
rejected plan on the same accepted plan
and in some ways it might seem more
natural to call DBA the example that
find not sort and just independent
explain on it so you might ask well why
did we change it up to have this idea of
an explainable object and the reason we
changed it up in this version in version
3 ATO is because certain things don't
return a cursor for instance if I wanted
to run a count on this ok I can't then
get an explained output watch doesn't
work on the other hand if I use my
explainable object exp and I do a count
on that you can see I can actually get
an explained output so one of the
advantages to this new syntax of getting
an explainable object for the collection
and then calling the query operator is
that it's opened up using explain on a
larger set of things and it's also of
course given us this awesome
helper interface so now you know explain
that help works and tells you all the
things you can run explain on now let's
look at another example let's look at
something where it couldn't use an index
and see what happens so that's not hard
to do
let's use our explainable object again
exp and then look for a document would
see being 200 now if you recall there's
an index on a and B a comma B and
there's an index on just B but there's
no index on C so this query should in
fact have to do a collection scan let's
see what happens well it only considered
one option the winning plan was to scan
the whole collection in the forward
direction for a document where C was 200
no plans rejected because apparently it
knew pretty much that it had no other
options so again there are two ways to
call explain
you can get an explainable object or you
can actually call explaining a cursor so
let's look at that so if I do VAR cursor
equals DB that example dot find a 99
then I can call explain directly on this
cursor and that's really equivalent of
calling DB example I find out explain
and I'll get a similar result telling me
that it used it index in this case use
the a1b1 index and then I can actually
call next in the cursor if I want the
result and that's just a little subtlety
of the show which is that when you call
DB dot example dot find without
assigning it to a variable the show
actually iterates the cursor for you
whereas if you're started to a cursor
then it doesn't iterate it for you're
giving the opportunity to then and
append and explain if you want kind of a
lot of strange little nuances of the
shell but I guess the real takeaway here
is that the preferred way to call
explain in this version of MongoDB is to
call it on the collection first and to
get an explainable object and then to do
a find something like this okay now it's
time for a quiz which of the following
are valid ways to find out which index
uses a particular query check all that
apply and I'm not going to go through
these and read them to you but take a
look at them and try to see if you can
figure out which ones work

---

### Explain Verbosity

https://youtu.be/WxXVun6bZ20

**Explain**

* queryPlanner
* executionStats
* allPlansExecution

**queryPlanner**

What the db would do in terms of indexes, but it doesnt tell you what the result of using that index would be

** executionStats**

It will tell you what the result of using the index would be

    var exp = db.example.explain("executionStats");
    exp.find({a:17, b:55});

    ...
    "executionStats" : {
       "nReturned" : 100,
       "executionTimeMillis" : 0
       "totalKeysExamined" : 100
       "totalDocsExamined" : 100
       "executionStages" : {
           "inputStage" : {
              "stage": "IXSCAN"
              "nReturned" : 100,
              "executionTimeMillsEstimate" : 0,
       "" : 

**Drop index**
   
   db.example.dropIndex({a:1, b:1});

    exp.find({a:17, b:55});

    ...
    "executionStats" : {
       "nReturned" : 100,
       "executionTimeMillis" : 5
       "totalKeysExamined" : 10000
       "totalDocsExamined" : 10000
       "executionStages" : {
           "inputStage" : {
              "stage" : "IXSCAN"
              "keyPattern" : { "b" : 1 }
              "nReturned" : 100,
              "executionTimeMillsEstimate" : 0,
       "" : 

**allPlansExecution**

    db.example.createIndex({a:1, b:1});

    var exp = db.example.explain("allPlansExecution");

Shows information about other execution plans, and shows how the db choose the other plan (the winning) and not the whole execution



so far we've been looking at the explain
command running in the query planner
mode right here the query planner mode
is very useful it's also the default
mode for explain but there are two other
modes I want to go over one is the
execution stats mode and the other is
the all plans execution mode and there's
sort of increasing levels of verbosity
because the execution stats mode
includes the query planner mode and the
all plans execution mode includes the
query planner mode and the execution
stats mode query planner tells you
mostly what the database would use in
terms of the indexes but it doesn't tell
you what the results of using that index
are for that we're gonna have to use the
execution stats mode let's take a look
once again at the shell we're going to
use the same data that we use in the
last lesson and just to review that data
it's a bunch of data there's a million
different documents with values for a B
and C and we can also look at the
indexes on the collection collection is
called example you can see there's an
index underscore ID of course and one on
B and one on a comma B now let's run a
query using the new execution stats mode
that we just learned about so once again
we're going to get an explainable object
but this time we're going to give a
different option this time we're going
to create that object with execution
stats as an option and we're going to
put the result in this XP variable now
we're gonna call exp dot find and we're
gonna look at one document in the
collection and we're gonna of course run
the explain command an execution stats
mode on this query versus actually do
the query now let's look through this
data and see what there is to see so
once again we've got the query planner
mode and the query planner mode tells us
that it is going to use the a underscore
B underscore one index and that it will
pass that along and if the parse query
was this all good it tells us that there
was a rejected plan and the rejected
plan was to use the B index on this
that's helpful but it doesn't tell us
what would have happened if it used each
of these so the execution stats over
here will tell us the execution stats
for the winning plan
there are certain key items that I want
you to pay attention to there's a lot of
data here and we're not going to look at
all of it but one thing I want you to
notice is the number of documents
returned right here that's number of
documents that the query actually
returned or would return if it were
running to completion and the data was
brought back to the client which is a
hundred documents we can see the
execution time Milly's which is the time
for the query which is unmeasurable in
this case by this granularity of clock
zero milliseconds a very fast query and
we can see that there was 100 keys
examined and 100 Doc's examined so that
tells us something it tells us that the
index worked pretty well we looked at
all of 100 keys and we got to the
hundred documents and then you can see
here as we go down we can see for each
stage we can see the number of documents
returned from each stage and this is an
inner stage here where it actually did
the index scan and an index scan it
returned 100 documents you can see the
key pattern that was used for the index
which was of course a B and the
selectivity and again what it used to
select on which was a min value 17 max
value 17 beam in 55 max 55 and you can
see it also provides an estimate of time
for this stage of the query which is
zero and you really read this from the
bottom to the top if you're trying to
understand the different stages of a
query okay and because this part is an
actual index scan it doesn't actually
have any docs examined part of it but if
you look in totality you can see that we
examined 100 keys we got 100 documents
and that sounds awesome and it was
pretty darn fast now let's see what
would happen if we didn't actually have
this particular index to use we were
selecting on a and B and we had an a
comma B index so that was a pretty ideal
index let's drop this index on a B
ascending so we'll drop the index and it
was three indexes now there's one
excellent all right so at this point
let's run the query again we can go back
in our history by just going up arrow in
the shell and we can already have an
explainable object we can use it again
we're gonna call find a 17 be 55 same
exact query and now let's see what
happens all right so the results are
slightly different this time first of
all the winning plan
this awesome index is missing the
winning plan is to use the B index it's
not as good an index but it runs the B
index right here and it says that it's
going to use it with the balance fifty
five fifty five makes sense and then
it's going to pass that up to the fetch
stage of the query which is after the
index is run it fetches the final
documents it's gonna look for the
documents that a seventeen alright
that's good enough sounds good and now
we're gonna go down to the execution
stats and see what happened and now
things are a lot different so the first
thing I notice is that there's actually
an execution time here of five
milliseconds which is much much longer
than zero infinitely longer than zero
although of course the first one wasn't
actually zero it was probably just not
quite one this queries a lot slower and
that's not surprising because if you
look down you can see that we examined
10,000 keys and 10,000 documents and
that's because the first stage of this
index scan on be returned 10,000
documents then had to be examined during
the fetch stage let's see if this tells
us that information as we go through it
so let's see how do we understand this
all right
the innermost document was the first
stage run the input stage and that ran a
query using the index B and you can see
that it returned 10,000 documents as
part of that or I should say it returned
pointers to 10,000 documents because of
course the index scan didn't really
return the documents and then up here
those 10,000 documents had to be
whittled down they were all examined
with a filter of a equals 17 and they
were whittled down to a final number of
documents of 100 and whenever you see
the number of documents examined much
larger than the number of documents
returned you know that you did a lot of
extra work that you took a lot of extra
data out of the database and at some
point it had to be inspected and then
rejected before it was returned to your
actual client program all right so
that's what happens when you give the
option for execution stats now we said
there's a third option and that third
option is all plans execution so let's
run it that way
first let's recreate our index
so DB dot example dot create index a
sending be ascending about a million
documents a few seconds there we go our
index is back in the collection now
let's get a new explainable object my
new explainable object will have the
option all plans execution now what does
all plans execution do well all plans
execution does what the query optimizer
does periodically but the query
optimizer does periodically is it runs
all the possible indexes that could be
used and it runs it in parallel and then
makes a decision about which one is
fastest and it periodically does this
and then it remembers which one is
fastest for a certain shape of query and
it always uses that index but when you
run the explain command in all plans
execution you are running the the query
optimizer that periodically runs to
determine what index would be used for
any particular shape of query so it
gives you even more information about
the different possibilities remember in
the last one what we saw with the
execution stats for the winning plan but
we didn't see any execution stats for
other plans so let's see what happens
now we're gonna do the same exact query
we did before and now now what do we get
we get a lot more information certainly
we have the execution stats that we had
before and they look pretty much the
same we did an index scan and we decided
to use the winning index of a comma B
but what about the all plans execution
area which is right here what does that
tell us
well let's see the first one is actually
the most interesting because the first
one is considering using the B index a
little hard to read on screen by the way
this all plans execution is an array of
different plans the first one was
actually rejected it returns zero
documents and the reason it was rejected
is that the database ran the query using
the B index right here B underscore one
and when it did that they examined 101
keys now we know from previously when we
remove the a comma B index that to
complete this query with just the be
ended
you'd look at 10,000 different documents
but in this case you looked at 101 but
why is that well the reason is that 101
was as many as the database needed to
see to know that it was a loser because
and you'll see here it says that it
returned zero documents so it says
didn't return any documents from this
plan this plan was eliminated said this
is not a best plan I know that because I
got to 101 documents examined and I have
a plan here which is the second plan in
the all plans execution which is going
to return 100 documents and only look at
a hundred documents I look at a hundred
documents I look at a hundred keys and
that's using the a comma B so now you
can really see the logic as a database
applied to make the decision which is as
soon as it saw that using the B index
index just on B was going to look at
more documents than using the a comma B
index it immediately abandoned that path
and didn't follow it through to
completion so although there's all plans
execution mode will give you some
execution information about alternative
paths to satisfying this query it won't
tell you everything that would have
happened because it treats it just like
the query optimizer when it knows that
it's bad it stops and if you remember
when we removed the actual a B index and
ran this query it told us it looked at a
lot more documents than that when it
used just to be indexed and one thing to
keep in mind with a database is it's
good to have an index for every query
that is that every query should hit it
index but it's also important that every
index that is on your collection that
there be at least one query hitting it
which is to say that when you have an
index on a collection and it's never
chosen it's never selected it's just a
waste and you're wasting time inserting
into that index and keeping that index
up to date when in fact you don't need
to be so you want to have a good balance
between the indexes on your collection
and the queries so that all the indexes
get used and all the queries have at
least one index that can satisfy them
and work efficiently alright it's time
for a quiz let's look at this option for
verbosity given the following output
from explain what is the
description of what happened during the
query this looks a lot like what we did
in the class we are creating an
explainable object and looking at this
query so examine these results carefully
and then figure out what happened and
then picked the right answer


---

### Covered Queries

https://youtu.be/QyV79jsSJ9Y

Lets run a normal query

    var exp = db.numbers.explain("executionStats");
    exp.find({i:45, j:23});
    ...
    "executionStats" : {
       "nReturned" : 100,
       "totalKeysExamined" : 100
       "totalDocsExamined" : 100

If we project only the fields (or a subset) in the index, mongo wont need to scan the documents

    exp.find({i:45, j:23}, {_id:0, i:1, j:1 ,k:1});
    ...
    "executionStats" : {
       "nReturned" : 100,
       "totalKeysExamined" : 100
       "totalDocsExamined" : 0

If we do not project the fields, mongo will have to scan all documents to ensure that there is no other fields

    exp.find({i:45, j:23}, {_id:0});
       ...
    "executionStats" : {
       "nReturned" : 100,
       "totalKeysExamined" : 100
       "totalDocsExamined" : 100
       
       
okay now I want to talk to you about the
concept of a covered query now it
covered query is not a query that is
covered by a house but instead it's a
query where the query itself can be
satisfied entirely with an index and
hence zero documents need to be
inspected to satisfy the query now if
you can satisfy a query entirely from
the index that's gonna make the query a
lot faster let's go through an example
in the shell to see how it works
all right I have a collection that I
call numbers that has a million
documents in it and it was just put in
here with a nested loop of I J and K so
pretty straightforward and if we look at
numbers and we see what the indexes are
on it we see that there are in fact two
indexes there's an index on underscore
ID and there's an index on I JK those
are the only indexes so let's see how we
would create a query and find out
whether it's covered so I'm going to
create an explainable object VAR exp
equals DB numbers dot explain and I'm
going to use the execution stats level
of output now we're gonna use that
object to call find and we're gonna look
for something where I is 45 J is 23 and
that's it and let's see what that
produces so that's this is our explain
output actually before we look at that
let's just go back and see what the
actual result would be of that I'll give
it a little bit more context you can see
that if we gave that query we get a
bunch of documents with I J and K and an
underscore ID and looking at the
explained output and going up into the
execution stats part we see that there
were a hundred documents that were
returned and that's right here and you
can see that there were a hundred
documents examined and you could see
there were 100 keys examined so if
documents were examined that doesn't
sound like a covered index and the
question is since there was an index in
ijk and since we only asked the CI JK
why is it that this
we had to actually look at the documents
doesn't make a lot of sense and you can
see that it did use an index scan here
and that it used the ijk index and the
reason is that we also asked to see
underscore ID and underscore ID is not
included in that index and so it had to
go to the documents to actually return
the result let's change the query a
little bit and specifically project out
underscore ID 0 i1 j1 now we're saying
we want to see the I and J values and we
don't want to see the underscore ID
value will see the K value that won't
change the result in this case because
this is an index and a JK now if we did
that query and we look at the execution
stats again in this explain output we
see that once again we got a hundred
documents out but this time the number
of total keys examined is a hundred but
the number of total documents examined
is zero and when the number of total
documents examined to zero and we use an
index and we return results we have a
number of documents returned that's
greater than zero that's a covered query
and this query was covered by that index
entirely and if we ran the query without
the explained DB dot numbers not find we
would see that we're returning only the
results for I J and K and no underscore
ID values and therefore we can satisfy
this entirely with the index now here's
a slightly surprising result which is
that if we call this query like this
where we suppress the underscore ID
right here and I'm silent on the other
options we get pretty much the exact
same output this is exactly the same
output but if you do an explain of this
query I'm gonna find on the explainable
object with the same query where I and J
is specified and underscore ID is
suppressed we're gonna find that in fact
if you go to the top of the execution
stats a hundred documents were examined
then 100 keys were examined and a
hundred documents were returned so
what's going on here that seems kind of
weird it's a little subtle but the issue
is that with this query when we suppress
underscore ID but are silent on what we
want to do with the other keys
the document MongoDB needs to inspect
every document because it doesn't know
if there's another key in a document
that could be an L or a P key in a
document doesn't know for sure that it
could satisfy this query with just the
ijk index only in the case where you
project exactly what's in the index or I
should say a subset of what's in the
index and if it's an index doesn't
include underscore ID then underscore ID
has to be suppressed it's only in the
case where the index could completely
satisfy the query with certainty that
it's covered and the database can avoid
looking at the documents if there's any
possibility of having to present the
value for a key that's not in the index
then it can't just stick with the index
that's to go to the documents all right
now it is time for a quiz we'd like to
perform a covered query on the example
collection and this example collection
it's called example and it's right here
it has these indexes which of the
following is likely to be a covered
query check all that apply


---

### Choosing an Index

https://youtu.be/JyQlxDc549c

okay now let's take a look at how
MongoDB chooses an index to satisfy a
query let's imagine we have five indexes
when a query comes in I'm going to be
looks at the query shape shape has to do
with what fields are being searched on
and additional information such as is
there a sort based on that information
the system identifies a set of candidate
indexes that it may be able to use in
satisfying the query so let's assume we
have a query come in and three of our
five indexes are identified as
candidates for this query so one two and
three
MongoDB will then create three query
plans one each for these indexes and in
three parallel threads issue the query
such that each one will use a different
index and see which one is able to
return results the fastest so visually
we can think of this as array something
like this the idea here is that the
first query plan to reach a goal state
as the winner but more importantly going
forward it'll be selected as the index
the use for queries that have that same
query shape so what's the goal state
here well it can be one of a couple of
things so it could be that one of the
query plans returned all the results for
the query another way a query plan can
win is by returning a certain threshold
number of results but there's a caveat
here and that is that it's able to
return the results in sort order now the
real value of doing this is that for
subsequent queries that have the same
query shape MongoDB knows which index to
select the way we achieve that is
through the use of a cache so the
winning query plan is stored in the
cache for future use for queries of that
shape now of course over time our
collection changes the indexes change so
we don't want this to necessarily be the
index we use forever so there are
several ways in which a query plan will
end up being evicted from the cache one
of those is if there are a threshold
number of writes right now that
threshold is a thousand writes another
way of course is if we rebuild the index
or if any index is either added or
dropped from the collection and finally
if the Mongo D process is restarted we
would also lose the query plan and other
plans in the cache so this basic process
is what MongoDB uses in order to figure
out which index
to use for the queries you submit


--

### Choosing an Index

https://youtu.be/JyQlxDc549c

```
 1      2      3 ------------> Cache
__________________
 |      |      |    1)Threshold   2) rebuild  3) Add    4) Mongod
 |      |      |        writes        index     Remove     restared
 |      |      |       (1000 w)                 index
 |             |
               |
__________________

All the results
Threshold of results (sorted)
```

okay now let's take a look at how
MongoDB chooses an index to satisfy a
query let's imagine we have five indexes
when a query comes in I'm going to be
looks at the query shape shape has to do
with what fields are being searched on
and additional information such as is
there a sort based on that information
the system identifies a set of candidate
indexes that it may be able to use in
satisfying the query so let's assume we
have a query come in and three of our
five indexes are identified as
candidates for this query so one two and
three
MongoDB will then create three query
plans one each for these indexes and in
three parallel threads issue the query
such that each one will use a different
index and see which one is able to
return results the fastest so visually
we can think of this as array something
like this the idea here is that the
first query plan to reach a goal state
as the winner but more importantly going
forward it'll be selected as the index
the use for queries that have that same
query shape so what's the goal state
here well it can be one of a couple of
things so it could be that one of the
query plans returned all the results for
the query another way a query plan can
win is by returning a certain threshold
number of results but there's a caveat
here and that is that it's able to
return the results in sort order now the
real value of doing this is that for
subsequent queries that have the same
query shape MongoDB knows which index to
select the way we achieve that is
through the use of a cache so the
winning query plan is stored in the
cache for future use for queries of that
shape now of course over time our
collection changes the indexes change so
we don't want this to necessarily be the
index we use forever so there are
several ways in which a query plan will
end up being evicted from the cache one
of those is if there are a threshold
number of writes right now that
threshold is a thousand writes another
way of course is if we rebuild the index
or if any index is either added or
dropped from the collection and finally
if the Mongo D process is restarted we
would also lose the query plan and other
plans in the cache so this basic process
is what MongoDB uses in order to figure
out which index
to use for the queries you submit


---

### How Large is your index

https://youtu.be/wjA0eo_lihg

**All indexes**
    
    db.students.getIndexes();

**Get the size of the indexes**

    db.students.stats();

**Short-cut for just the total**

    db.students.totalIndexSize();

Wired tiger introduce the use of index compression, one is prefix compression
This introduces change in index size (are smaller), but at the cost of CPU, and depends on the data.



okay so now I want to talk a little bit
about index sizes as with other
databases with MongoDB it's very
important that we're able to fit what's
called the working set into memory so
the working set is the portion of our
data that clients are frequently
accessing as you might imagine a key
component of this is our indexes for
performance reasons it's essential that
we can fit the entire working set into
memory because going to disk for data is
a time consuming operation and
performance will degrade significantly
if for frequently accessed data we have
to go to disk regularly now this is
especially true with indexes because if
in order to search an index we first
have to pull it from disk into memory we
lose a lot of the performance benefits
of having the index in the first place
so it's especially important that our
indexes fit into memory so let's look at
how we can measure the size of our
indexes as a means of say estimating the
amount of memory we'll need for a
MongoDB deployment okay so let's take a
look at our students collection we have
individual students classes and the
scores in this collection they're 10
million records here so first let's take
a look at what indexes we have okay and
we can see that in addition to the
primary index we have a secondary
compound index on student ID and class
ID now if we want to see the size of our
indexes we can use the stats method so
we call the stats method on the
collection of interest and here we can
see the total index size and this is
also broken down for us into the
individual sizes for the two collections
that we have there's a shortcut method
for this as well which gives us just the
total so from this it looks like each
index we have is adding 300 megabytes to
our total index size and of course this
has an impact then on how much memory
our working set requires now with the
release of my going to be 300 we've
introduced the wired Tiger storage
engine one of the key features of wired
Tiger is that it supports a few
different types of compression one of
which called prefix compression allows
us to have smaller indexes so that last
example we looked at was against a
MongoDB running the mfv one storage
engine now let's take a look at index
sizes for a three O server with the
wired Tiger storage engine and in
particular we've got index prefix
compression turned on okay so let's
launch a shell and connect to that Mongo
D that one's running on the default port
so I have exactly the same dataset
loaded here again 10 million records and
I've got the same indexes as I had in
our last example
so now let's take a look at the index
sizes here and we can see that our total
index size here is just under 200
megabytes so rather than 300 megabytes
each our indexes are something on the
order of 100 megabytes each now I should
also say that this compression comes at
the cost of CPU and it really depends on
your data set as to whether or not you
can take advantage of something like
prefix compression but it's something to
be aware of and something I wanted to
show you here I'll also just briefly
point out that with a wired Tiger
storage engine the stats output looks a
little bit different in particular we've
got this wired Tiger document that
reports on a bunch of stats for that
particular storage engine so again pay
attention to the size of your indexes
make sure they can fit in memory so that
you can realize the full performance
benefits


---

### m101 23 index cardinality

https://youtu.be/xiujksUfzUA

|Regular|Sparse|Multikey|
|-------|-------|-------|
| 1:1 | <= documents | tags: [-,-,-] \n > documents|


Lecture Notes
In this lecture, we talk about the cost of moving documents, in terms of updating index entries. That cost 
only exists in the MMAPv1 storage engine. In the WiredTiger storage engine, index entries don't contain 
pointers to actual disk locations. Instead, in WiredTiger, the index points to an internal document 
identifier (the [RecordId](https://docs.mongodb.com/manual/reference/method/cursor.showRecordId/#cursor.showRecordId)) 
that is immutable. Therefore, when a document is updated, its index does not 
need to be updated at all.

Let's talk for a moment about index cardinality, which is
how many index points are there for each different type
of index that MongoDB supports.
Now in a regular index, for every single key that you put
in the index, there's certainly going
to be an index point.
And in addition, if there is no key, then there's going to
be an index point under the null entry.
So essentially, you get about one to one relative to the
number of documents in the collection in terms of index
cardinality.
And that makes the index a certain size.
And it's proportional to the collection size in terms of
its end pointers to documents.
In a sparse index, when a document is missing the key
being indexed, it's not in the index because it's a null and
we don't keep nulls in the index for a sparse index.
So here, we're going to have index points that could be
potentially less than or equal to the number of documents.
And finally, here in a multikey index, which is an
index on an array value--
and an index becomes a multikey index as soon as you
have at least one value inside any document that is an array.
Then there may be multiple index
points for each document.
For instance, if there's some sort of tags array in a
document, and it's got three or five or four tags, then
there's going to be an index point for every single one of
these keys.
And so it could be greater than the number of documents.
And it could be significantly greater than
the number of documents.
And this comes up because indexes need to be maintained.
There's a cost of maintaining them.
And if anything causes the index to have to get
rewritten--
For example, let's say a document moves.
When a document moves-- and it might move because you just
added something to it that makes it too large to fit in
the space that the database has for it on disk, so it
needs to move it to a new location.
Every single index point that points to that document needs
to be updated.
Now, if the key is null for a particular index, well then
there is no update that needs to happen to the index.
If it's a regular index, well then yeah, one index point
needs to get updated for sure.
And if it's a multikey index, and there's 100 or 200 or 300
items in an array, then they all need to get
updated inside the index.
All right, time for a quiz.
Let's say you update a document with a key called
tags and that update causes the document to need to get
moved on disk.
If the document has 100 tags in it, and if the tags array
is indexed with a multikey index, how many index points
need to be updated in the index to accommodate the move?
Put just the number below.


---


### m101 30 geospatial

https://youtu.be/UKUDYqNVL6I

**Create the geospatial index**

    db.stores.createIndex({location:'2d', type:1});

**Find with the near operator**

    db.store.find({location: {$near:[50,50]} })

**Limit the query**

    db.store.find({location: {$near:[50,50]} }).limit(5)

The next topic I want to discuss with you
is geospatial indexes.
And geospatial indexes allow you to find
things based on location.
The first model we're going to discuss is a two-dimensional
model, and then we'll go over a three-dimensional model in
another lesson.
Now in a 2D world, we've got a Cartesian plane,
y-coordinates, and you may have a bunch of different
objects out in that world.
So for instance, you might have a restaurant here and a
barber shop here and a grocery store here and a hardware
store here.
And then, you also have, typically, a person right here
with his little coordinates, x comma y.
And what you want to know is, well, what's
closest to this person?
What are the establishments that are closest to this
person, maybe of a certain type?
And how do you figure out where those are?
Now the way we do this is that, in order to do searches
based on location, first of all, your document need to
have some sort of x,y location stored in it.
I'm just going to call it location, but to be clear, it
is just my name.
And in that, you store an array of values which are the
x, y-coordinates.
And then once you do that, you need to also use ensureIndex
to tell the database that these are locations that need
to be indexed so that you can search them.
And you do that by specifying that you want to have there be
an index on location--
again, just my word--
and that the index is type 2D.
And that's the reserve type.
That tells the database that this is a two-dimensional
geospatial index.
If there are some other pieces of information you want to
have be a part of the index, there's a compound index, you
can add that.
So if there's a store type or something or an establishment
type, you can put that in, ascending.
That's optional, but it can be a compound index.
Now, the last part of this is that you're going to need some
sort of query operator to work on this.
And there's a few different query operators, but I'm going
to just tell you about one of them right now which is the
$near operator.
And so the way you would do a find on this, you'd say, OK,
find all the locations that are $near, colon, and then
this would be the x, y-coordinates of where that
person was standing.
So just to over it again, you have to have something in the
document right here that specifies the x,
y-coordinates.
You need to have an index that tells the database that there
are x, y-coordinates stored in the document.
You give type 2D.
And then in your find, you can call the $near operator and
say, oh, find me all the locations that are near this
particular set of x, y-coordinates, and the
database will return them in the order
of increasing distance.
And practically speaking, the way this is often used is
through a limit.
So you'd say limit(20), and then that would give me, let's
say, all the shops or the stores that were closest to
this person standing at coordinates x,y, limiting to
20 of them.
Let's go through a little example in the Shell.
All right, I've got a small collection here that is called
stores, and it has three establishments.
So you can see the three establishments right here.
They are Ruby--
it's a barber at location 40, 74--
and then, ACE hardware, a hardware store, at location
40, minus 74, and then, Tickle Candy, a food
store, at this location.
I've added an index using this command--
let me show it to you--
db.stores.ensureIndex, location: 2D.
And again, I named it location, but it doesn't need
to be named location.
You can call it whatever you want, or loc or
whatever you want.
And then type ascending.
I said, oh, wouldn't it be nice to also be able to filter
and sort by the type of establishment it is, so I
added that.
You can see all the indexes that are on there.
So you can see that there's two indexes on this
collection, the default one under underscore id, and the
second one, a two-dimensional index, a compound index where
location is the first part of it.
And then, type is the second part of it.
And this is the name of the index.
And to do a query, here's a typical query.
So find me every document whose location is near 50, 50
and you're going to return them to me in order of
increasing distance.
So I do that, and then it shows me the three of them.
It says that the one that's closest to 50, 50 is 40, 74,
and then 40.2, minus 74 is next closest, and then 41,
minus 75, which makes sense to me just looking
at them real quickly.
All right, so let's do a quiz.
Here's the quiz.
Suppose you have a 2D geospatial index defined on
the key location in the collection places.
Write a query that will find the closest three places, the
closest three documents, to the location 74, 140.
Please type it there.


---

### geospacial spherical

https://youtu.be/pULU4DVsUWQ

![image](https://upload.wikimedia.org/wikipedia/commons/b/bc/FedStats_Lat_long.png)

* google maps show [latitud, longuitud]
* MongoDB needs [longuitud, latitud]

**GeoJSON**

```json
db.places.find().pretty()
{
  "_id" : ObjectId(46545435431877),
  "name" : "Apple Store",
  "city" : "Palo Alto",
  "location" : {
           "type" : "Point",
           "coordinates" : [-122.1691291, 37.4434854]
  },
  "type" : "Retail"
}

"location" : {} //GeoJSON document, where "type", "Point" and "coordinates" are reserved words
```

**Create geospatial index**

    db.places.createIndex({'location':'2dsphere'});

**Run a query**

```javascript
db.places.find({
  location:{
    $near:{
      $geometry:{
        type: "Point",
        coordinates: [-122.166641, 37.4278925], 
        $maxDistance: 2000
      }
    } 
  }
})
```

**Redirect from a file**

    mongo < geonear.js

**Note**: Some operator dont require an index (like find in something that's within a shape), but all perform better with an index

```json
db.stores.find({loc: {
                     $near:{
                        $geometry:{
                              type:"Point",
                              coordinates: [-130, 39]
                        },
                        $maxDistance: 1000000
                         
                     }
               }})
```

All right, now that we've talked about how
to search for locations using a 2D index,
I want to go over a more sophisticated type
of geospatial indexing-- a spherical geospatial indexing
that is also supported in MongoDB.
Now, to start out, before you can talk about finding things
in a 3D world, you have to talk about how you describe
the location of something in a 3D world.
So the world is actually a globe,
and this is my poor representation of the globe.
And locations on the globe are represented
by longitude and latitude.
So if you recall, latitude is how far off the equator
is the object.
So for instance, the equator is at zero degrees latitude,
and you can go all the way from minus 90 degrees to 90 degrees.
And that's your lines of latitude.
And then we have the longitude.
And the longitude-- this is a lot of longitude right here.
It describes a line that goes from the north
to the south pole.
So in order to describe the location
of any particular object on earth,
you need its latitude and its longitude.
Now, in addition, we're going to need
a way of indexing these documents that
have latitudes and longitudes in them.
And the way we're going to do that is
a new special type of index called 2dsphere.
So let's talk about how we're going to do this.
And I think the easiest way to get into this is by example.
So I'm going to go through an example of a few locations that
have been put into MongoDB documents.
We're going to search near a location
to find the closest locations.
And we're going to use a 2dsphere index to do it.
So let's start with the locations.
So here's Palo Alto.
And in Palo Alto we've got four locations that are near
and dear to my heart.
We've got Fry's Electronics, where
I used to get small electronic components before people
stopped building anything, in the late '90s.
And the Pennisula Creamery, where
you can get a great milkshake and a burger;
the Apple store, where you can spend a lot of money;
and Hoover Tower, which is a monument right
in the center of Stanford's campus.
And then there's one more location
that I put on my little map, and that is Mount Tamalpais State
Park-- top of Mount Tam is where I
got engaged, so also a place near and dear to my heart,
a bit further from Stanford.
And we're going to put documents into MongoDB
that represent these locations.
All right, the first thing I want to show you
is that Google Maps is very convenient for finding
the latitude and longitude for locations.
So let's look up Times Square, which
is where we are right now.
You'll see that what Google Maps will do is, in the browser URL,
it will actually show you-- and we're
right over here somewhere.
It'll show you the latitude and the longitude.
Now, it shows it to you in latitude comma longitude order.
So the latitude is 40.75 here, and the longitude
is minus 73.98.
This is in the opposite order you're
going to need it when you specify it in MongoDB.
MongoDB takes a longitude comma latitude.
All right, so how are we are we going
to specify the locations of things?
Well, we use a location specification called GeoJSON.
And I'm going to show you that right now.
This is a web page on GeoJSON, geojson.org.
We implement only a small part of the specification
on GeoJSON.
But if you want, you can look at it
and see the full specification.
And in particular, the parts that we're
going to be most interested in are the parts
that specify points and geometries.
And you can see there's coordinates and lists
of coordinates.
It's kind of a complicated thing when you've got-- especially
if you want to describe a polygon.
We're only going to do the most introductory lesson here
right now.
And then you can go look further if you
want to see what all the different possibilities are.
And MongoDB only supports a subset of these,
like points and polygons.
We don't support some of the more complicated structures.
All right, so let's go into MongoDB now
and see our documents.
So I put them in a collection called "Places."
So here we are.
I'm going to pretty print them.
And we're going to see the GeoJSON format at work.
So here we have the Apple store.
I decided to specify the city of Palo Alto.
I decided to put my GeoJSON location information
into a key called "location."
This is my own decision.
It's arbitrary.
But you can call it anything you want.
But I called it "location."
And then everything after this paren
and into this paren, that's a GeoJSON document.
In this case, I've decided to describe it using a point.
You could also describe it using a polygon
if you wanted to give it some area,
but we described it using a point.
And the type is a reserved word, and coordinates
is a reserved word.
Point is a reserved word.
And here are the coordinates in longitude comma
latitude order, which I got from Google Maps.
I decided to put that was a retail store
into the collection.
Again, we've got four objects in the collection.
We've got this Apple store, this Peninsula Creamery,
and Fry's Electronics.
And then finally, Mount Tamalpais State Park.
OK, so in order to query this, we're
going to need an index on the GeoJSON documents.
So let's do that-- db.places.ensureIndex.
And it's going to be on location.
And it's going be of type 2dsphere.
Never understood why this is called 2dsphere.
It seems to me that if you have a two dimensional
sphere, that would be a circle.
But what I think is trying to be expressed here
is that although it's a 3D model--
it's a spherical model-- that it's only
looking at points on the surface of the sphere
versus up in the air.
So that's why it's called 2dsphere.
So we're going to add that.
And now there are two indexes on the collection,
which is all good.
Previously, there was one.
I could show you the indexes.
Hold on, getIndexes.
The indexes are this _id index, which always comes with every
collection, and then this index on location.
So what query might we want to run?
Well, I want to know the closest things to me,
and I'm standing at Hoover Tower, in my imagination.
So let's go through that.
I'm going to quit from the shell here.
And I've got a query that's been written our
already to be a little bit easier to follow.
So this query is going to search the Places collection, right
here, and do a Find.
And it's going to find documents by location, which
is the field that we created to hold
the locations of the various stores.
And it's going to use the $near operator.
Now, the $near operator is going to search
for everything near a point, in this case.
Now this $geometry is a required operator
and can also give $maxDistance, which
is the max distance in meters.
I said 2,000 meters.
Find me everything that is closest to these coordinates--
minus 122.166641 degrees longitude, and 37 degrees 0.427
blah, blah, blah latitude.
And these are the coordinates of Hoover Tower
that I got from Google Maps.
So again, just to look at the format of this, we had a Find.
We specified that we're looking at the Location field.
We're applying the $near operator.
And then, we have a GeoJSON document
that specifies the geometry of type point
with these coordinates.
And that's it.
So let's see what we get we do that.
So Mongo-- I'm going to just redirect
from this file to run a query.
And it looks like we got back two documents.
And these are going to be sorted in order of closest
to furthest, which is a feature of the $near operator.
The first one is the Peninsula Creamery--
and it is, in fact, closest to Hoover Tower-- and then
the Apple store, which is also within 2,000 meters of Hoover
Tower.
Notice that it eliminated Fry's and it
eliminated Mount Tamalpais as being outside 2,000 meters.
And just to review that with you to show you
the map again so you see that this is the right answer,
remember, we were looking at things closest to hover tower.
And it said that within 2,000 meters,
you've got the Peninsula Creamery at closest location,
and Apple store, next closest.
Fry's and Mount Tamalpais are off the screen.
Fry's is on the screen, but out of the search radius.
And Mount Tam is completely off the screen.
And that's how you would actually
search for something using the near operator.
So again, the secrets are that you
need to know the latitude and longitude of your documents.
You also need to create a 2dsphere index
if you want to use the $near operator.
Some of the operators don't require
having an index-- like, for instance, finding
something that's within a shape.
But they all perform better if there
is an index on the location.
And then you need to, of course, insert the locations
and perform the query.
OK, let's now do a quiz.
What is the query that will query a collection
named "Stores" to return the stores that
are within one million meters of the location at this latitude
and this longitude-- latitude 39, longitude minus 130.
Type the query in the box below, and assume
that the stores collection has a 2dsphere index already on it,
on the key location.
And use the $near operator, as we did in this lesson.
And if you're looking for what the documents look
like, this an example document.
Might have an _id that looks like this with a store-id of 8
and a location of type point, and these are the coordinates.
So you have to write that query right here.
And then hit Return and see if it's correct.
You have to be pretty careful to make sure it's exactly the same
because we're going to pattern match against that.

---

### text index

https://youtu.be/nLau5Fx9LC8

```
{ "_id":ObjectId("4549844645"), "words" : "rat tree ruby." }
{ "_id":ObjectId("454984464c"), "words" : "rat tree obsidian" }
{ "_id":ObjectId("454984464c"), "words" : "dog tree ruby" }
...
```

**Create a text search index**

    db.sentences.ensureIndex({'words':'text'});


**Search with the text index**

    db.sentences.find( {$text: {$search:'dog'} } );

**Find the best match (ranking best match)**

    db.sentences.find( {$text: {$search:'dog'} }, {score:{$meta: 'textScore'}} ).sort({score: {$meta:'textScore'}});


**Lecture Notes**
At 0:36, Andrew says that when you search on strings with a standard index, the entire string must match. 
This isn't entirely true; a regex search will search the index (rather than the full collection), and if 
you anchor it on the left by beginning with ^, you can often do better still. Here's a link to the 
documentation.



Let's talk about another type of index
that can be very useful when dealing with text.
It's called a full text search index.
So why would you use it and what would you use it for?
Well, let's say you had a very large piece of text
that was in a document, something like the US
Constitution, which starts out, "We, the people of the United
States, in order to form a more perfect union."
Let's say you had that document right here in a key
called My Text and you had the entire preamble to the US
Constitution in this key, My Text,
and you wanted to search it.
Well, if you searched just on any given word,
then you wouldn't get anything back because MongoDB,
when you search on strings, the entire string
needs to be there.
So as an alternative, you could put every single word
into an array and then use the set notation operators to push
things into it and then search for whether or not
the words are included, but that's pretty tedious
and there are certain other features that would be missing.
So instead, what we have is something called a full text
search index, which is abbreviated text, which
will index this entire document and every word much in the way
an array is indexed to allow you to do queries into the text,
basically applying the OR operator
and looking for one of several words.
So let's go look at now a specific case
and see how it would work.
We've created a collection called sentences,
and this collection has got a bunch
of mostly just randomly inserted words into a words key.
There is no text search index on this right now.
This is a regular collection.
If I wanted to search for, let's say, "dog shrub ruby,"
I could do it.
There we go.
So I searched for "dog shrub ruby"
and I found this document with the words "dog, shrub, ruby,"
but it's very particular.
If I leave off the period, it doesn't find it.
If I just do "dog ruby," doesn't find it,
and if I just do "dog," it doesn't find it.
That's not going to work too well for me to search
on these different words.
So now let's add a text index, db.sentences.ensureIndex,
and now I want to put an index on words of type text.
There we go.
And now when I search it, "dog shrub ruby," it's
going to work a lot better, so let's do that.
Let's first look at the syntax for searching a full text
index.
The way it works is I have to say $text
and then give a document with $search
and then what I'm looking for.
So we saw that, for instance, "dog" did not work before.
Let's just look for "dog" now and see if that works.
There we go.
So now I searched for just the word "dog"
and I was able to get all of these back that have "dog
moss ruby," "dog shrub ruby."
And then just to show you again, when I just
search for "dog" using a regular search of words,
I don't get anything, but if I search using a text index,
I'm going to show you the syntax right here.
I search using a text index by specifying $text and then
$search and then what I'm looking for, "dog,"
I do get documents back.
I get all these documents back because they all
have "dog" in them.
And if I also say "moss," I get all of these back as well,
and if I say "moss ruby," I'm going to get all these back,
and it's quite flexible.
Putting in a period makes no difference.
Capitalization makes no difference.
It's going to also ignore certain stop words that are not
considered to be significant like "a" and "the"
in the English language.
So that's really very useful if I
want to search for a bunch of different words
and essentially apply a logical OR operator.
Now, there's one other thing I wanted to show you,
which is how you can get back these
in an order that indicates how good a match MongoDB believes
there is.
So let's look for one of these.
I'm going to show you the syntax for this.
So let's look for "dog tree obsidian."
Dog tree obsidian.
Let me go back and change this.
We can see the document right up there with "dog tree obsidian."
The best match for "dog tree obsidian"
should be the dog tree obsidian document,
but we're going to do something special now.
We're going to project a Score field,
and we're going to use a special $meta operator
and then take the text score, which
is something that's internally computed as it
runs through this text search.
We're going to get that text score out
and then we're going to sort by that text score.
We're not going to test you on this syntax
but I want you to know it exists if you ever need it.
If you do that, you'll see that now, it's
ranking the documents in order of their text score
and that, if you're searching for "dog tree
obsidian," the one with the highest score, a score of two,
is the document with "dog tree obsidian," all three
words in it, very useful if you want
to find the best match for, let's say,
a document that contains all the words.
So now it's time for a quiz.
Let's say you create a text index on the title
field of the movies collection.
Imagine having a movies collection,
and then perform the following text search-- db.movies.find
$text $search "Big Lebowski."
Which of these documents might be
returned if all of these documents
are in the collection?


---

### Efficiency of Index Use

https://youtu.be/JJmIf0pn100

**Designing/Using Indexes**

* Goal: Efficient Read/Write operations
* Selectivity - minimize records scanned
* Other ops - How are sorts handled?

In this query

```
db.studends.find({studend_id: {$gt:500000}, class_id:54}).sort({studend_id:1}).explain("executionStats");

"nReturned" : 10118,
"executionTimeMills" : 2900,
"totalKeysExamined" : 850433,
"totalDocsExamined" : 10118,

"rejectedPlans" : 
{
"stage" : "SORT",
"sortPattern" : { "student_id":1 }
//This means that mongodb was unable to sort data in db, and would have to do the sorting in memory (a lot of time in this phase)
}
```

**Mongo provides a way to overwrite the winning plan**

```
hint()

db.studends.find({studend_id: {$gt:500000}, class_id:54}).sort({studend_id:1}).hint({class_id:1}).explain("executionStats");

"nReturned" : 10118,
"executionTimeMills" : 79,
"totalKeysExamined" : 20071,
"totalDocsExamined" : 20071,

"rejectedPlans" : 
{
"stage" : "SORT",
"sortPattern" : { "student_id":1 }
//This means that mongodb was unable to sort data in db, and would have to do the sorting in memory (a lot of time in this phase)
}
```


okay so at this point we know quite a
bit about what types of indexes MongoDB
supports how to create indexes and the
importance of indexes for the efficiency
of our application what I'd like to do
now is walk through an example that
gives you an idea of the type of
thinking you need to do when you're
designing your indexes the goal is that
our read and write operations are as
efficient as possible but as with so
many things this requires some upfront
thinking and some experimentation to be
sure you get the right indexes in place
what you really want to do is test your
indexes under some real-world workloads
and make adjustments from there but
that's outside the scope of this course
what we're going to look at here is some
of the initial thinking you can do to
get ready for some of that real-world
testing so what we're going for here is
a selectivity of our index and to what
degree for a given query pattern the
index is going to minimize the number of
records scanned and we have to consider
this in a scope of all operations to
satisfy a query and sometimes make some
trade-offs so we'll have to consider for
example how sorts are handled okay so
let's go through our example and again
this is really the tip of the iceberg in
terms of designing a set of indexes but
it gives you an idea for the type of
thinking you're going to have to do in
order to get those indexes right so to
think about building indexes that can
handle our query patterns efficiently
let's return to our student data set now
in this version of the data set I've
added a field for final grade and we're
dealing with about 1 million students so
here's the query that I want to look at
and the reason for this is because it
illustrates several of the issues that
we have to think about in designing our
indexes so note that what we're doing
here is a query for all students with an
ID greater than 500,000 okay so that's
going to be about half the students and
records for the class 54 there's about
500 classes represented in here and then
finally we're going to sort in ascending
order on student ID the same field we're
querying on here now throughout this
example I'm going to be running explain
on the cursor that the query returns to
us and specifying that I want to see
execution stats so that we get nice
detailed output about exactly what
MongoDB did in order to satisfy the
query so let's run this okay
I want to draw your attention to a
couple of different things so first
let's take a look at this total Keys
examined this is how many keys within
the index I'm going to be walked through
in order to generate the result set the
result set on the other hand is only ten
thousand documents so we had to look at
a lot more index keys then we really
needed to in order to find the documents
what this means is that the index that
was used in order to satisfy this query
wasn't very selective and you remember
that selectivity is one of our key goals
when we're designing an index so let's
see if we can figure out what happened
okay now when you move above execution
stats in the explain output the thing
you're going to see is the output from
the query planner so starting from the
top working your way down you've got a
winning plan and then you also get a
chance to see the rejected plans so this
is in JSON form a specific outcome for
this idea here racing a couple of
different query plans against one
another okay so what happened here is
that the winning plan used a compound
index based on student ID and class ID
and the losing plan there's only one
other would have used an index based on
class ID but then it would have had to
do an in-memory sort that's what this
component of this particular query plan
means anytime you see a sort stage in a
query plan it means that MongoDB was or
would have been unable to sort the
results that according to the sort
specified by the query in the database
itself rather it would have had to do an
in-memory sort so what happened here is
that the index that one is one that was
able to return sorted output so it only
had to get to that certain threshold
number of return results which is I
believe 101 return documents versus if
you remember ten thousand documents
would have to have been returned by any
query plan that was unable to do a sort
within the database okay because we
actually were able to identify ten
thousand documents that match the query
parameters stipulated here again the
issue is one of selectivity and the
problem here is that we're specifying
range query that just isn't very
selective and so we end up touching
every single key in this index that has
a student ID value greater than
five hundred thousand so that's about
half of the records here now I'm sure
you can see where I'm headed here it's
this query the point query that's going
to be considerably more selective for us
okay so as I said there's only about 500
classes represented in this data set and
now granted there's lots of students
taking those classes but this is going
to constrain a result set and this is
really what leads to those 10,000
records being returned as opposed to the
850,000 that were identified so it would
be better given the indexes we have is
if in fact we use this particular index
because this is going to be
substantially more selective so let's do
that now I'm going to be does provide a
way of forcing the database to use a
particular index I can't stress strongly
enough that you should use this with
caution it's not something you should
necessarily make part of your deployment
but it is a way of overriding what would
be the outcome of a query planner so
that is called hint okay and with hint
we can specify a particular index that
we'd like to use either by specifying
its shape or its actual name in this
case I'm just going to specify its shape
and what I'm going to do here is I'm
going to say okay I want to use the
class ID index okay so let's see what
happened with this query okay we're now
down from having scanned 850,000 index
keys to just about 20,000 in order to
get to our results set of 10,000 okay
and the execution time is only 79
milliseconds as opposed to the 26
hundred milliseconds we saw before using
the other index okay now the fact is
what we'd really like to see is that an
returned is in fact very close to total
Keys examined so one way of addressing
this is to design a better index


---

### Efficiency of Index Use 2

https://youtu.be/g032EW67SRA

**Create an index**

    db.students.createIndex({class_id:1, student_id:1});

**The execution is better**

    db.students.find({student_id: {$gt:500000}, class_id:54}).sort({final_grade:1}).explain("executionsStats");

```
"nReturned" : 10118,

"executionTimeMills" : 138,

"totalKeysExamined" : 10118,

"totalDocsExamined" : 10118,

"winningPlan":
"stage" : "SORT",

"sortPattern" : { "final_grade":1 }
```

**This will create the index that is more appropieate**

```
db.students.createIndex({class_id:1, student_id:1, final_grade:1});

db.students.find({student_id: {$gt:500000}, class_id:54}).sort({final_grade:-1}).explain("executionsStats");
"nReturned" : 10118,

"executionTimeMills" : 27,

"totalKeysExamined" : 10204,

"totalDocsExamined" : 10118,

"winningPlan":
//Does not have a SORT stage
```

**Lecture Notes**
At about 3:13, Shannon mentions that MongoDB can walk the index backward in order to sort on the 
final_grade field. While true given that we are sorting on only this field, if we want to sort on 
multiple fields, the direction of each field on which we want to sort in a query must be the same 
as the direction of each field specified in the index. So if we want to sort using something like 
db.collection.find( { a: 75 } ).sort( { a: 1, b: -1 } ), we must specify the index using the same 
directions, e.g., db.collection.createIndex( { a: 1, b: -1 } ).


so here is that index off-screen have
gone ahead and created a compound index
based on class ID and student ID so with
class ideas the prefix will be using the
most selective part of our query the
point or a quality query now generally
speaking and this won't hold for all
data sets but generally speaking when
you're building compound indexes as
you're thinking about field loader in
the compound index you want to work with
fields on what you're going to be doing
equality queries first putting them
before range queries as we did here ok
now I'm going to mix things up a little
bit and you can see here that I've
actually changed the sort we want to do
to use that final grade field that I
introduced when we first started looking
at this particular example so let's run
this query now and see what explain
tells us about performance ok that was
fast so we scroll up to execution stats
and look at this number return is
exactly equal to the total keys examined
and the total Doc's examine our
execution time is 138 milliseconds so
let's look at the query plan here then
and here I want to call your attention
to the fact that we have a short stage
now what that means is that we're doing
an in-memory sort and I bet you can
figure out why because we can see from
the index scan stage that we're using
that new index that we created the
compound index on class ID and student
ID no mention of final grade here so in
order to sort we're going to have to do
the sort in memory generally speaking
it's best to avoid in memory sorts when
we can but in order to do that we're
going to have to make a trade off and
that is and this is typically the
trade-off you have we're going to have
to examine a few more Keys than the
number of documents we return in order
to be able to do that sort in the
database so let me show you what I mean
so we created this index here well let's
think about how this works we're
creating a bunch of pairs of values in
effect of class ID and student ID but
what we'd like to be able to do is walk
the index in sort order ok so in order
to do that well we've got our most
selective part of our query here which
is fine because we want to identify
every single record that uses the class
ID specified in the query
but then in order to be able to sort
within the index we have to be able to
walk the index keys in order which means
that we're going to have to have that
field on which for sorting as part of a
compound index and it's going to have to
go immediately after class ID so we want
to create another compound index and in
fact this is the one that we really want
if a common query pattern is this one
that we're looking at because this will
very selectively identify the records
that we want to look at and then by
walking the next component of the keys
all the way through the index will be
able to pull out all of the records in
the specified sort order and what we can
do along the way is we're walking
through those keys is simply eliminate
any that don't match the student ID
range that we're looking for ok so we're
going to have to touch a few more index
keys then we'll end up being in our
result set but by doing this sort in the
database we're going to save ourselves
execution time so let's create this
index it'll take a little while ok and
our index finished up so let's take a
look now there is one thing I want to
tweak about this and that is that I want
to change the way we're sorting so that
we're sorting in descending order and
this index we created will work just
fine for that because my going to be can
walk the index in reverse order just as
easily so let's run our query ok now
let's take a look at what happened here
ok now this is going to vary depending
on what else is going on in the system
but you can see that our execution time
is down quite a bit and this is because
doing the sort in the database by simply
walking the index he's in order it's
going to save us execution time and if
we look at the query plan we can see
that the winning plan does not any
longer have a sort stage and in fact
what we ended up using was the index
that we just created ok so why is this a
better index for this query well for
this data set we know that class is very
selective by specifying an individual
class ID we're eliminating easily more
than ninety percent of the data set in
fact it's quite a bit more than ninety
percent and by specifying this we can
simply walk the index keys in order in
order to get our sorted result set and
along the way based on the student ID
component of this compound index we can
simply make this comparison to get rid
of
any records that don't match this range
constraint and if we take a look at the
explained output one more time we'll see
that that trade-off is in fact they're
that good execution time but we are
walking a few more index keys then we
have documents in our results set but in
many cases this is a trade-off that's
well worth making okay so this gives you
some idea of how to think a little bit
about structuring indexes and we looked
at compound indexes because this is
where people have the most difficulty
setting up their indexes thinking about
selectivity and thinking about how to
get our sorts accomplished in the
database gives us indexes that pretty
efficiently handle our operations

---

### m101 33 logging slow queries

https://youtu.be/aWuvC-O7Qkk

We've talked about how you create indexes and we've
talked about how you use the explain command to figure out
what indexes are getting used and how they're getting used
in your queries, but ultimately, about the
performance of your programs you're going to need to do
some profiling to figure out what is
slow inside your programs.
Now, there's actually, there is a profiler built into Mongo
D and I'm going to teach you how to turn that on, but
before you even do that there's a default facility
that could help you and that is that Mongo automatically
logs slow queries of above 100 milliseconds right to the log
that Mongo D writes when you start it up.
So this is a default logging facility
that can be very useful.
So let me show you how that works.
So I'm going to start Mongo D here with the default.
Here, I'll shut it down.
I have a DB path and nothing else set.
If I do that, all right, do nothing else and then I go
over here to my Mongo shell.
I'm going to have to reconnect, so the first time I
hit this, it's not going to do it.
And now, I'm going to do a find on the student's
collection, and student's collection is a 10 million
document collection that we've seen many times.
And I took all the indexes off it so it's going to be slow
since it has to scan the whole collection, if I look for
student ID 10,000.
So I'm going to do that.
It's going to take a while.
It has to spin up a disc even to do it because I haven't
done it in a while.
It finds the object in question, finds the
document, all good.
And if we go here, into the log, you can see, right here
it says that there was this really slow query.
It actually gives me the query, I looked for student ID
10,000 and it was in school dot students and it took about
four seconds.
Very useful and certainly, you should be checking your logs
to make sure you don't have a lot of slow queries and this
is something that's built in and you don't need to do
anything to get this.
It's automatic.


---

### m101 34 profiling

https://youtu.be/pN1Yhrup9-I

**Init profiler (within the mongod)**

    mongod --profile 1 --slowms 2

**Look all queries in the profiler**
    
    db.system.profile.find().pretty()

**Queries on foo collection order by timestamp**

    db.system.profile.find({ns:/test/foo/}).sort({ts:1}).pretty()

**Search for queries slower that a duration**

    db.system.profile.find({mills:{$gt:1}}).sort({ts:1}).pretty()

**Get the status of profiler**

    db.getProfilingLevel() 
    1

    db.getProfilingStatus()
    {"was":1, "slowms":2}

**Set the profiling level**

    db.setProfilingLevel(1,4)

**Turn off**

    db.setProfilingLevel(0)


**Lecture Notes**

The exact output of the profiler varies with MongoDB version and with storage engine.

We recommend you check [the docs](https://docs.mongodb.com/manual/reference/database-profiler/) 
for the specifics of what your query profile is telling you.


Now let's talk about the profiler.
The profiler is a more sophisticated facility.
It will write entries, documents, to system.profile
for any query that takes longer than some specified
period of time.
There are three levels for the profiler.
There's level zero, level one, and level two.
Levels zero is the default level, and it means it is off.
Level one means, I want to log my slow queries.
And level two means, I want to log all my queries.
So why would you want to log all your queries?
And the reason is because not so much for performance
debugging, but because when you're writing a program, it's
convenient to see all the database traffic so that you
can figure out whether the program is
doing what you expect.
So this is really more of a general debugging feature than
a performance debugging feature.
And you might want to use that when you're debugging your own
programs, to turn the profiler on a level two and see
everything that's happening in the system.
But right now, we're going to focus on this level one which
is logging the slow queries.
Let's go and start Mongo up logging slow queries.
So we're going to run mongod minus dbpath and, same as
before, the one I used.
And then minus profile one, log my slow queries, anything
above two milliseconds.
So I'm going to do that.
And now, it's logging my slow queries.
And now, I'm going to do a slow query.
So I'm going to do that same query again.
All right, it took a while.
It took about four seconds.
And now, I'm going to look in db.system.profile and see what
there is to see.
And this is the query we just did.
We can see that there's a query to the students
collection, that we were looking
for student_id: 10,000.
It happened here, this time stamp.
And it scanned 10 million documents.
That sounds slow.
It returned one document, and took 4.2 seconds, 4,231
milliseconds.
So this is going to be really useful.
And you can see it actually returned
more than one document.
It returned some of the work I did before.
This is a cap collection, which means that there's a
fixed size collection and it will recycle space in the
collection after it uses it up.
So we can use this information.
We can query on it.
So we see, for instance this millis over 4,000.
So let me show you some of kind of queries you can do.
So in here, I'm doing a find in the profile collection
looking for anything with test.foo in it in the name
space, which is the foo collection which is another
collections I've been writing queries to as well.
And then, sort it by the time stamp, prettyprint it.
And you see there's nothing in there right now from test.foo.
But if I switch that up to be school.students collection,
I'll get the query we just did.
We can also look for things that are slower
than a certain duration.
Let me show you how that works.
Here we go.
This is a query, again, of the system.profile where we're
looking for things that have milliseconds greater than one.
And we're going to sort by the time stamp again and
prettyprint it.
Very convenient.
So that's how you would use the profile
information you get.
You can turn on this profiler from the Mongo shell.
Let me show you how to do that.
So you can get the profile status.
Here, let me show you that.
getProfilingLevel--
we're set to level one right now.
Let's get the status.
And you can see it's set to one, which is slow queries,
anything above two milliseconds.
We can set the status if we want.
This is how you turn the profiler on
from the Mongo Shell.
Let's set it to level one, but I want to only look at things
that are longer than four milliseconds.
If I do that, oh I meant set the
profiling level, not status.
If you set the profiling level--
right here--
set profiling level to 1 comma 4, that means slow queries
above four milliseconds.
And now it tells me what it used to be, just so I can do
some debugging information.
But if I do a get of the status, I can see that it's
now set to level one and anything above four.
If I want to turn it off entirely, I just set it to
zero, and that should fix it up for me. setProfilingLevel--
and if I get the profiling status now, I
should see it's zero.
And if I get the profiling level, which is another
command, it'll also tell me it's zero.
So those are the commands you might want to know which is to
get the profiling level, that'll tell
you what it's doing.
If you want to set the profiling
level, you can set it.
It takes two parameters.
I only gave one here because I was turning it off.
But it takes two parameters which is the level and then
the number of milliseconds that I want to log beyond, any
query that exceeds that will get logged.
OK, it is time for a quiz.
Write the query to look in the system.profile profile
collection for all the queries that took longer than one
second ordered by timestamp descending.


---

### m101 36 mongotop

https://youtu.be/D9YLXgy7NYo


Review

1. Indexes ar critical to performace
2. Explain
3. Hint
4. Profiling

**Mongotop**

Lets run mongotop every 3 seconds

```
mongotop 3
2018-02-10T19:55:59.787+0000    connected to: 127.0.0.1

                  ns    total    read    write    2018-02-10T19:56:02Z
  admin.system.roles      0ms     0ms      0ms                        
admin.system.version      0ms     0ms      0ms                        
crunchbase.companies      0ms     0ms      0ms                        
       grades.grades      0ms     0ms      0ms                        
        grades.skill      0ms     0ms      0ms                        

```


Let's review what we've learned so far.
We've learned that indexes are critical to performance inside
a database and inside MongoDB.
We learned how to use the Explain command to look at
what the database is doing for any particular query in terms
of how it's using its indexes.
We've learned how to use the Hint command to instruct the
database to use a particular index for a query.
And we've learned how to turn on profiling and look at the
profiling information to figure out which of our
queries are slow so that we can use the Explain command,
possibly use the Hint command, possibly create new indexes.
But if I want to look at the high level inside a program
and figure out what it's doing, how would I do that?
Now, we have some tools to do that.
And I'm going to show those to you next.
The first one I'd like to show you is Mongtop .
Now, Mongtop is named after the Unix Top command.
It's going to give you a high level view of where Mongo is
spending its time.
And to show you how that could be interesting, let me bring
you through two programs that I wrote.
The first program I call stress_students.
Now stress_students, which is right here, is a small program
that connects to the database and is going to look up a
million student records in my students collection.
My students collection has no index, and this
is going to be slow.
So let's run that.
Now here it is, chugging through these different
student records.
It looks like it's talking almost a second per record.
And then in this window, I'm going to run Mongtop.
And I'll run it every three seconds--
mongotop 3.
Anyway, let's look at that output together.
I'm going to stop it.
Now what it's saying is that-- and I'm not sure exactly why
it's above three seconds when the sampling
interval's three seconds--
but it's saying that all the time is spent in the students
collection.
You'll notice this a row for each collection that it's
looking at.
And this is great because at a high level, if I've got lots
of collections, I want to know where the thing's
spending its time.
And then it's telling me my read time and my write time.
And it's very clearly dominated by time spent
reading in the students collection.
So that tells me that that's were I should look, right?
And I have profiling turned on, if I went to the profiler,
I would find there's a lot of slow queries and that I could
work on this right off the bat.
So let's look at a different program which should be
running much more efficiently because it uses indexes and
see what results we get there.
So I'm going to go back here.
I'm going to stop this program.
And now, I'm going to show you a very similar program called
stress_students2.py.
Now, this connects to my school2 database, and there's
another students collection in there which also has 10
million records.
But they're broken up slightly differently by class and
student id, and so as a result, I have to loop.
But every one of these queries that looks up a student by its
class id is going to hit an index because I have a
student_id, class_id index on that in that collection.
And it's nicely selective, and their student
id is right in there.
So we should expect to get good
performance from this program.
And let's see what the results are when we run it.
Well, I mean the first thing you note is that it's just
flying by, so you could just feel that it's running a lot
more quickly through the database.
But now I'm going to just run Mongtop for three seconds and
see what it says.
And it says that in the interval, 850 milliseconds of
the three seconds, the 3000 milliseconds, are spent in the
school2.students collection, and it's all on read.
But that's only a small fraction of the sampling
interval of three seconds.
And what that would leave me to believe is that this thing
is not even bound by its performance through Mongo.
And if I look at the activity monitor on my Mac-- and this
is probably a little small for you to see--
you can see that there's as much time spent in Python as
there is in Mongo.
Because of all the I/O and the loops in there, it's accessing
Mongo very quickly.
And this would tell me that this program is actually
performing pretty well.
Now if I went and looked in the profiling logs, I wouldn't
see any slow queries because there really aren't any for
this particular program.
So that is Mongtop.

---

### Mongostat


https://youtu.be/E2aDTSes3Wc

```
$ mongostat
insert query update delete getmore command % dirty % used flushes vsize   res qr|qw ar|aw netIn netOut conn                 time
    *0    *0     *0     *0       0     1|0     0.0    0.0       0  274M 55.0M   0|0   0|0   79b  21.5k    2 2018-02-10T20:01:49Z
    *0    *0     *0     *0       0     1|0     0.0    0.0       0  274M 55.0M   0|0   0|0   79b  21.5k    2 2018-02-10T20:01:50Z
    *0    *0     *0     *0       0     1|0     0.0    0.0       0  274M 55.0M   0|0   0|0   79b  21.5k    2 2018-02-10T20:01:51Z
    *0    *0     *0     *0       0     1|0     0.0    0.0       0  274M 55.0M   0|0   0|0   79b  21.5k    2 2018-02-10T20:01:52Z
    *0    *0     *0     *0       0     1|0     0.0    0.0       0  274M 55.0M   0|0   0|0   79b  21.5k    2 2018-02-10T20:01:53Z
```

now I'd like to tell you about the Mongo
stat command the mongoose TAC command is
a performance tuning command and it is
somewhat similar to the i/o stat command
from the UNIX world if you're familiar
with that what it will do is it will
sample the database in one second
increments and give you a bunch of
information about what is going on
during that one second for instance
it'll give you the number of inserts
queries updates and deletes it'll also
give you different information depending
on whether you're running wired tiger or
a map v1 as a storage engine so let's
take a look at Mongo stat in a running
database now I've got both storage
engines currently running on this
computer both wired tiger and a map v1
and I'm currently creating the student
collection which is a million students
ten classes for each student's so 10
million documents and that's going on in
parallel for both the wired tiger and
the map view on storage engine two
different Mongo DS and one of them is
running at 27 0 17 and the other ones
running a 27-0 18 so if I wanted to see
how it's going i could run Mongo use the
school database and then count the
number of students that are currently
here and we can see it is about 850,000
in this one and if I wanted to see how
what's going on on the wire Tiger 1
which is running a 27-0 18 I could do
that as well and you can see there are
seven hundred ninety three thousand
students in that one and every time I
run it that number will be a little bit
higher because it's actually running a
script in the background now if you want
to look at this and see what's happening
I can run Mongo stat and I'll run it or
without a port number which will run it
against 2701 7 and if I do that you can
see a bunch of data and unfortunately
it's wrapping on the screen so it's a
little hard to read but you can see the
number of inserts queries updates and
deletes and you can see that for the 20
70 17 server which is a default port
server I'm running about 4,000 inserts
every second and there's a bunch of
other information here that will go over
in a moment
now if I want to then look at the other
storage engine I could do that and you
can see that that's also running about
4,000 inserts per second now let's
stress it just a little bit further so
it's running this large insert script
that's can insert all these different
student records but now let's also run
this so I've written a small script
called stress students py and it doesn't
do much what it does is it goes through
and looks in the range of 400,000 to
500,000 and it tries to look up the
student by student ID and there is an
index on student ID for this collection
on both storage engines and every
thousand so it just says I did a
thousand searches so let's run that and
while we're running that lets go back
and now once again let's run my own
ghost at and now we see the results are
slightly different we can see that not
only are we doing some inserts and
actually the insert rate has now gone
down to about 3,000 per second but we're
also doing a bunch of queries we're
doing about three or four thousand
queries per second so you can see how
this data changes depending on the
workload of the database alright so
let's go over a few more of these
different columns and talk about what
they do I'm not going to go through all
of them insert query update and delete
are just these different query
operations and deletions and those are
pretty obvious get more is how many get
more commands we're running every second
get more is the way you get more from a
cursor if you're doing a query that has
a large result alright this is the
number of commands that are running per
second things like create index and get
indexes these are commands I'm not going
to talk about flushes it has to do with
the number of times that it flushes out
to disk per second I'm not going to talk
too much about it map does the is the
amount of mapped memory that exists in
the end map view one storage engine you
can see we're mapping a lot of memory
but you can see that we only have about
four point two gigabytes resident this
is a number of page faults that were
causing every second and that's an
important number in EM map v1 because
page faults mean that you're getting
more I oh and more I oh
means a slower database all right now
finally this right here and these are
all wrapped it's hard to read these but
these are the queue lengths for a number
of sockets I believe that are waiting or
requests that are waiting in for Reed
and for right and this is the number of
active readers and active writers and
then this is the amount that was sent
into the database and add a database
during this time frame now let's run my
own ghost at for the wire tiger storage
engine and look at the differences now
again wire tiger is running at 27 0 18
port so let me connect to it there now
you can see for the wired Tigers droid
engine I'm not seeing any queries
because I'm not running that stress test
against the wire tiger storage engine if
I wanted to change that and run it
against the wire tiger stored engine I
could do that let's change that stress
test py to connect to 27 0 18 and now
let's run that so then we're going to
run that and then while we're running
that we're going to run our Mongo stat
against 27 0 18 let's do that great
alright so I'll let that run a little
bit then I'll stop it alright the first
thing you notice is that the wired tiger
storage engine is actually managing a
few more reads we're getting reads in
the 5000 range per second while we're
still doing about 4000 inserts per
second so we're seeing better
performance out of the wire tiger
storage engine this is not the best
performance test I've got two different
Mongo d servers running on the same box
but it is interesting Staten nonetheless
now you'll notice here that we still
have this get more column and we have
this command column but then we have a
bunch of different columns first of all
the M map column is gone because we're
not mapping memory anymore instead we
have the percentage dirty and the
percentage used and this refers to the
percentage of the wired tiger cash that
is dirty meaning that it's written and
only to be written back to disk if we
want to reuse the space and the
percentage used is the percentage of
total cache size that we're using and
you can see that that's ten percent and
that very little of this caches is dirty
and then we can see that we have about
1.6 gigabyte resident in the storage
engine and then the queue lengths are
again very close to zero and the active
clients are it says one maybe two is
Mongo start attaching
I'm not sure or potentially maybe that's
our stress test actually it could be our
stress test connecting to it now let's
see in terms of the residents eyes I'm
just going to go back and see what this
was the residents eyes before an nmap
was four point two gigs and the
residents eyes here was 1.6 gig so it
looks like the residents eyes is a lot
smaller on wire tiger all right that
gives you sort of a taste of what these
stats are now obviously you're most
interested in the stats that indicate
both the usage of a database and also
how much I oh you're doing and for the
MF v one storage engine number of page
faults is a pretty good indicator of the
amount of i/o you're doing of course you
can also find that out from iostat and
for the wire tigard storage engine I
don't see anything that's a clear
indicator of the amount of i/o you're
doing although you can tell by the
percentage of your cash that you're
using how close you are to to seeing
some pressure on that cash obviously if
you're not using the whole cash probably
not seeing very much pressure at all on
its size now if you want to find out
more about Mongo stat course the best
way to do that is by looking in the
manual and right here I'm just googling
Mongo stat MongoDB and if I look here
the first link tells me all about Mongo
stat and what's a little bit small here
these are the command line options to
run it I'm not going to get into that
and then finally at the bottom we've got
the fields which pretty much follow
along with what I just talked about
telling you the number of inserts
queries updates per second that are
happening and then explaining some of
the more esoteric ones and which ones
also exist only for wire tiger or what
they mean in wire tiger vs in EM map so
for instance flushes has a different
meaning and wire tiger vs at map dirty
as I said is a wire tiger only term it's
about percentage of the cash that's
dirty mapped is an MF v one storage term
size is actually I didn't see a size
output i saw a V size output which I
haven't talked about documentation seems
to be slightly off with respect to this
column and I filed a ticket so you might
see this has changed or more clear when
you watch this video resident is the
amount of resident memory used in both
cases and false of course is a map v1
concept alright
so those are the major parts of the
Mongo staff command and you know you
should use the longest at command if
you're curious you know what the
database is doing so that's Mongo stat
okay now it's time for a quiz on Mongo
stat which of the following statements
about Mongo stat output are true check
all that apply the m map column field
appears for all storage engines the get
more column concerns number of requests
per time interval to get additional data
from a cursor only the wire tiger
storage engine reports the resident
memory size of the database the false
column appears only in the M map v1
output and by default Mongo stat
provides information in 100 millisecond
increments


---

### m101 38 sharding

https://youtu.be/BDxT-VZdYqc

All right, the last topic of this unit is sharding.
And sharding is a technique for splitting up a large
collection amongst multiple servers.
So so far we've been talking about having a single Mongo
server, which I'll represent as this disk.
But there comes a time when you can't get the performance
you want from a single server.
And so what you can do is you can shard.
And when you shard, you deploy multiple mongod servers, and
in the front, you have a mongos which is a router.
And your application talks to mongos, which then talks to
the various servers, the mongods.
Now one wrinkle, which I won't go into here, is that rather
than being a single server, this is sometimes and often
and recommend to be a set of servers.
So imagine three of these guys behind here in what's called a
replica set.
And a replica set keeps the data in sync across several
different instances so that if one of them goes down, you
won't lose your data.
But logically, you can look at this replica set as one shard.
And when you're doing this-- and for the most part, it's
transparent to the application--
however, the way Mongo shards is that you
choose a shard key.
So for instance, in that student collection, you might
decide that student_id is your shard key.
Or it could be a compound key.
And the mongos server, it's a range-based system.
So based on the student-id that you query, it'll send the
request to the right Mongo instance.
So what do you really have to need to know as a developer?
Well the, first thing you need to know is that an insert must
include the shard key, the entire shard key.
So if it's a multi-parted shard key, you must include
the entire shard key in order for the insert to complete.
So you have to be aware of what the shard key is on the
collection itself.
And the second thing you need to know is that for an update
or a remove or a find, if mongos isn't given a shard
key, then what it's going to have to do is broadcast the
request to all the different shards that cover the
collection.
So you have some collection, like the students collection,
and it's broken up into big parts that map each to
different shards--
shard0, shard1.
And then there's some chunking within here to allow Mongo to
keep it balanced, but that doesn't really matter from
your standpoint.
The point is that if it doesn't know the shard key, on
the query, it has to broadcast it.
Now, it may be the case that you're doing a query that you
don't know the shard key, in which case it
does have to be broadcast.
And that's fine.
But if you know the shard key, you should specify it because
you will get better performance because you'll
only be utilizing one of the servers.
And you won't be keep the other servers busy with this
query as well.
A couple of other subtleties--
with updates, if you don't specify the entire shard key,
you have to make it a multi-update so that it knows
that it needs to broadcast it.
And we're going to go over a lot of this in the application
engineering part of the course.
But I just wanted to explain the role that sharding has on
performance and also the subtlety of having to think
about the shard key a bit.
And choosing a shard key is a topic in and of itself, which
we are not going to go over.
Now within each of these servers, all these instances,
the same techniques apply as we have been talking about
this entire unit.
So you could certainly use Explain.
You can look at the system profile.
You can connect directly to the Mongo instances that are
running on here if you'd like for debugging purposes.
So a lot of the same things apply.
But at the highest level, your application will be talking to
a mongos router.
And that mongos will be talking to the mongods,
usually on different physical servers because that's
probably the reason why you sharded in the first place was
to get higher performance.
And just in case you were wondering, mongos is often
co-located on the same machine as the application, and you
can have multiple of these mongos services.
And you may have noticed the mongos binary in the Mongo
distribution, and that's what it is.
It lets you shard a collection and split it across multiple
servers and access it pretty easily--
somewhat transparently, except you have to have some
understanding of the shard key.
All right, so that completes our unit on performance.
I hope you've enjoyed it, and I'll see you next week.

