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