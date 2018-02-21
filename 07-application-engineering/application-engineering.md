### Intro to Week 6

https://youtu.be/BmQuvmpt_ZQ

welcome to week six this week we're
going to go over three topics you'll
need to know the engineered solutions
using MongoDB the first one is the
durability of Rights how you know that
data is persistent on disk the second
topic is replication MongoDB is approach
to fault tolerance and availability and
the third topic is charting using
sharding you can distribute a collection
across multiple servers to gain greater
throughput now this is a course for
developers we're going to talk about how
to use replicated in charge system but
we're not going to go into too much
detail on how to configure replication
and charting let's get started

---

### Write concern

https://youtu.be/oRDYNWCYnGo

okay let's talk about how we make sure
that the rights that we make the
database actually persist so that when
we read from the database we can see
them now you have your application and
this application is going to be using
let's say PI Mongo which is right there
inside your application and here's your
app and your application is talking to a
database server which I'm going to
represent is this big box so in this
lesson we're going to assume that
there's a single server but in the later
lessons we're going to talk about there
being replicated servers so here's a
server and that server has several parts
it has a CPU and the CPU is running the
Mongo D program and there's memory lots
of memory inside the server and inside
the server there's this persistent disk
right here now the database is mostly
writing to memory so let's say in wire
tiger
for example there'll be a cache of pages
inside memory that are periodically
written and read from disk depending on
memory pressure and and the amount one
storage engine there would be a memory
mapped address space that would
correspond to pages on the disk similar
now the secondary structure that's
called a journal and a journal is a log
of every single thing that the database
processes every single right database
processes and when you do a write to the
database and update it also writes it to
this journal but the journals in memory
as well and the question is of course
when does the journal get written back
to disk because that is when the data is
really considered to be persistent so
when you do an update let's say for an
insert you're going to contact via the
network my mom goes in the contact via a
TCP connection this server and the
server is going to process the update
and it's going to write it into the
memory pages but they may not write the
disk for quite a while depending on the
memory pressure it's also going to
simultaneously write this update into
the journal little hard to see but
imagine I wrote the word update there
and then it'll have the exact
information that was updated now by
default inside MongoDB or I should say
by default in the driver when you do an
update we wait for a response all right
it's an acknowledged update or an
acknowledge insert
we don't wait for the journal to be
written to disk the journal might not be
written to disk for a while the value
that represents whether we're going to
wait for this write to be acknowledged
by the server
it's called W and by default it's 1
which means wait for this server to
respond to my right but by default J
equals false and J which stands for
journal represents whether or not we
wait for this journal to be written to
disk before we continue so what are the
implications of these defaults
well the implications are that when you
do an update or an insert into MongoDB
you're really doing an operation in
memory and not necessarily to disk which
means of course it's very fast and then
periodically the journal gets written
out to disk it might be every few
seconds
I think it's written out to disk so it
won't be long but during this window of
vulnerability when the data has been
written into the server's memory into
the pages but the journal has not yet
been persistent to disk
if the server crashed you could lose the
data and you have to realize that as an
application programmer that just because
the write came back is good and it was
written successfully to memory it may
not ever persist a disk if that server
subsequently crashes and whether or not
this is a problem depends on the
application
for some applications where there are
lots and lots of writes and you're just
logging small amounts of data you might
find that it's very hard to even keep up
with data stream if you wait for the
journal to get written to disk because
disk is gonna be 100 times thousand
times slower the memory for every single
write but for other applications you may
find that it's completely necessary for
you to wait for this to be journaled and
to know that it's persistent to disk
before you continue so it's really up to
you now these two things together are
known as the write concern the W value
and the J value so let's go through them
again so I can reiterate what they do we
have a W value and we have the J value
now by default W is gonna be 1 and J is
gonna be false which means that we're
gonna wait for that write to be
acknowledged by the database but we're
not going to wait for the journal to
sink so this is fast but there's a small
window of vulnerability I'll say small
on the other hand if you want to
eliminate that window of vulnerability
we can just set J equal to true and we
can do this
inside the driver at the collection
level at the database level or at the
client level and if we do that it's
gonna be much slower but now that we
know our vulnerability is removed now
there is an older historical option that
we don't recommend at all which is the
set w equal to zero and if you set W
equal to zero then it will be an
unacknowledged right which means that
the right will be sent to the database
but you won't even believe until a
server responds we don't recommend this
is the way you use the database but if
you did this then it would be what's
called unacknowledged right and we don't
recommend that that value all right now
this W value is a little bit more
complex than I'm describing because in a
replicated environment which we'll
discuss later there are other values of
W that also have some significance but
for right now I just want you to
understand that the default is this and
that you could decide to move it to this
J equals true W equals 1 if you want to
make sure that those rights have been
written to disk now if the rights been
written to the journal then what happens
is if the server crashes then even
though the pages may not be written back
to disk yet on recovery the server can
look in the journal on the disk the
Mongo D process and it can recreate all
the rights that were not yet persistent
to the pages because they've been
written to the journal so that's why
this gives you a greater level of safety
all right it is time for quiz provided
you assume that the disc is persistent
what are the W and J settings required
to guarantee then insert or update is
been written all the way to disk

---

### Network Errors answer

https://youtu.be/xWNzCkTCN-M

all right now that you understand the
way the right concern works and the J
value and the W value you may think that
you can write code in a way that is
pretty safe and that you'll know always
for sure what happened in terms of an
update but unfortunately it's not quite
true and let me explain to you why so
let's say that you set J equals to be
true and W equals b1 so you're running
in a very conservative mode and you do
an update or an insert to MongoDB now if
you get a response back an affirmative
response you know that it definitely
happened but what if you don't get a
response back well wasn't then what do
you know well the likelihood is it
didn't happen but it might have happened
and the reason why it might have
happened is that there are network
errors there are reasons why you may not
receive the affirmative response so you
can send the request from the
application through PI Mongo to Mongo D
it get completed successfully and then
there could be a TCP reset and the
network connection can get reset in the
way that you never see the response so
you get an error and on the error you
might assume oh I got an error it didn't
happen but it may have happened now
we'll go over later the different types
of errors you can get Impa Mongo and
talk about which ones indicate this
problem potentially and what you could
do about it
generally speaking for an insert it's
possible to guard against this and the
reason it's possible to guard against
this is that if you let the driver
create the underscore ID and you do an
insert into the database then you could
do that insert multiple times and it
won't be any harm because if you do it
the first time and you get an error then
you can always just do it again and if
you do it the first time and you get an
error and you're not sure whether or not
the answer completely because it's a
network error you could still try to
perform the insert again and provided
you try to perform it with the exact
same underscore ID the worst case
scenario is you're gonna duplicate key
error when you try to insert it however
an update is really where the problem
occurs especially an update that is not
particularly item potent that for
instance includes a dollar ink
so you're telling the database to
increment a certain field well in that
case if you get back in a network error
you don't know whether or not the update
occurred now maybe you know enough about
the values that you can check whether or
not the update occurred which is fine
but if you don't know the starting value
in the database for that field then it's
not possible for you to know whether or
not it occurred or not in the case where
you get a network error so I just want
to make that point that there is this
level of uncertainty now in practice
when the network is running well it's
very rare to get a situation where you
get an error back because of some sort
of connection problem or transient
problem and in fact the operation did
succeed at the database it's extremely
rare and if you really want to avoid it
at all costs what you basically need to
do is turn all your updates into inserts
by reading the full value of the
document out of the database and then
potentially deleting it and inserting it
again or just inserting a new one in
which case you won't have this problem
ok so now it's time for a quiz what are
the reasons why an application may
receive an error back even if the write
was successful check all that apply


---

### m101 7 replication intro

https://youtu.be/f1WTYGORU3w


---

### m101 9 replica elections

https://youtu.be/WFXSVHO78bQ


---

### m101 11 write consistency

https://youtu.be/Oqf_Eza-s1M


---

### m101 13 creating replica sets

https://youtu.be/flCFVFBRsKI


---

### Replication Internals

https://youtu.be/6GbrJmxCEl0

**Lecture Notes**

At about 0:31, Andrew says that the secondaries are constantly reading the oplog of the primary. 
It's true that the oplog entries originally come from the primary, but secondaries can sync from 
another secondary, as long as at least there is a chain of oplog syncs that lead back to the primary.



all right now we've started a 3-node
replica set on our computer and let's
look around a little bit and figure out
how this works so we have a three node
replica set and each of these Mongo DS
such I'm going to mark with an M has
within it an OPP blog and the OP blog is
going to be kept in sync by Mongo so
what happens is one of these is a
primary and of course your rights have
to be to your primary and your
secondaries are going to be constantly
reading the upload of the primary when
we do a right on a primary it's going to
get written to the op log and then the
secondary is going to be querying what's
new in the op log and applying those
same operations to the secondary and
when an election occurs for instance if
we decide that we want to kick down the
primary then a new primary will be
elected so for instance this guy might
become primary and then when this guy
comes back up you might become secondary
all right let's play a little bit and
see how this looks at the shell so I
have a three node replica set and this
is a unix box so I'm just going to run
the process command PS command and see
what Mongo DS are running we can see we
have the three Mongo DS running and
they're running at these three different
ports 2701 7018 and 019 so let's connect
to one of them 20 70 17 that would be
the default and if I do that I see that
this is a secondary node if I Ron RS
status I get the configuration file for
this replica set might look slightly
different in this lesson than the
previous ones and some of these lessons
were recorded on a slightly different
version of MongoDB but the critical
parts are the same and we can see that
the primary let's see 27 017 is a
secondary 27 0 18 is a primary alright
and 27 019 is a secondary let's connect
directly to the primary this time so
Mongo minus minus port 27 0 18 and now
i'm going to write something into a
collection so i'm going to test the
database i'm going to write something
into the people collection i do an
insert alright so we did an insert of
named andrew into the people collection
now how did this show up on the other
side well it shows up on the other side
because there's a knob log so let's show
you where that is so if we use local
which is the local database and then we
show collections you're going to see a
blog RS so let's go here and let's look
at that collection and see what's in it
and we'll pretty print it because it's
small so some of these are earlier from
before I started recording but right
here we have an insert is an op insert
into test stop people here's in the
score ID and here's name Andrew so this
is the actual insert that we just did on
the screen and we can see here let's see
what's before that it looks like this
created the people collection so there's
actually two different commands in the
op log one of them created the people
collection and the other one insert it
into it and the previous one is from a
previous recording so all right so let's
go to the secondary and see what's going
on there so I'm going I'm going to go
here now I know that one of my
secondaries is 27 017 so we'll connect
to that all right there we go it's a
secondary if I use test and do d be deaf
people dot fine first of all my document
should be there oh why can't I do the
read well I can't do the read because
you can't read from a secondary unless
you say that it's okay to do so and so
you can do that within the shell by
calling RS thoughts slave okay so I did
that and now if I do my find I should be
able to see the document so there's a
document in the test database in the
people collection with named Andrew and
I should see the exact same item in my
op log let's look there so use local DB
top blog that RS dot find that pretty
and we can see that this applaud
contains exactly the same statements as
the OP alive in the primary here's the
creation of the people collection and
here's the actual insert into people
with named Andrew now the way
replication works is that each of these
databases knows how far along they are
each of these servers and so it asks the
primary for whatever is new
so if we look at RS status on the
secondary you can see and this is 27 017
you can see that he has some information
about his op time and his op time date
and this lets him know that he has
everything up to date to this point and
you can see that he knows where he's
getting his data from so now a couple
things to note first is the out blog is
a cap collection which means it's going
to roll off after a certain amount of
time and so you need to have a big
enough ah blog to be able to deal with
periods where the secondary can't see
the primary and how large that blog is
going to be is going to depend on how
long you might expect there to be a
bifurcation in the network and also how
much data you're writing how fast is the
applaud growing so in a very fast-moving
system it might a very large ah blog but
in a smaller system which isn't moving
very fast where there aren't very many
network partitions you won't need a very
large ah blog to make sure that it can
always see the a blog now if the up log
rolls over and the secondary can't get
to the primaries a blog you can still
resync the secondary but he has to read
the entire database which is much much
slower and the other thing to note about
the applaud is that this blog uses this
this statement based approach where
these are actually MongoDB documents and
it doesn't matter which storage engine
you're using or even which version of
MongoDB you're running to some extent
and so you can have mixed mode replica
sets for instance you can have a wired
tiger secondary and an nmap primary and
in fact this is one of the features that
will allow you to do upgrades because if
you want to do a rolling upgrade of the
system you can do it by upgrading parts
of it at a time and then having let's
say a 30 primary replicating itself to
an older secondary and then switch it
around and eventually all the nodes get
upgraded okay so last thing i want to
show you in this lesson is what happens
when we actually failover so let's do
that real quickly right now what we're
going to do is we're going to take down
the primary and let's see we know where
the primary is let's look at RS that
status again so the primary is a 27-0 18
and we're going to take him down and see
how long it takes to get an election
going so we're going to do that by going
here and we're
going to do a PS minus EF grep for Mongo
d again and we're going to look at the
process 60 494 that's running at 27 0 18
and we are going to kill 60 494 kill 60
494 that's the primary running a 27-0 18
and if we do that and we go back to this
window then we can see oh look he's
already the primary so this now there's
already been an election happened in
under a second it looks like and now
we've got 20 7018 scene is unreachable
from the standpoint and this window is
connected to 27 017 if you recall and
this at 27 017 says oh I'm now the
primary that was really fast so that's
how a replica said election might work
if a failure occurs all right it's time
for a quiz which is the following
statements are true about replication
check all that apply

---

### m101 17 failover and rollback

https://youtu.be/IW1oW_Adlt0

Lecture Notes
While it is true that a replica set will never rollback a write if it was performed with w=majority and that write successfully replicated to a majority of nodes, it is possible that a write performed with w=majority gets rolled back. Here is the scenario: you do write with w=majority and a failover over occurs after the write has committed to the primary but before replication completes. You will likely see an exception at the client. An election occurs and a new primary is elected. When the original primary comes back up, it will rollback the committed write. However, from your application's standpoint, that write never completed, so that's ok.


---
