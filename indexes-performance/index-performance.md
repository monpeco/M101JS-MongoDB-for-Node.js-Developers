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