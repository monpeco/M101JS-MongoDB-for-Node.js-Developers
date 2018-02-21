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


### connecting to a replica set from the nodejs driver

https://youtu.be/H1bzY0ktgEg


alright so now let's talk about
connecting to a replica set in the gs
driver so just to recap a replica set is
a collection of multiple Mongo d nodes
that communicate with each other and try
to keep a most up-to-date copy of the
entire data set as they possibly can
they should be as close to duplicates as
possible meant for high availability and
automatic failover so the way you deal
with this in an application is through
the driver and actually the driver is
going to do a lot of the work for you in
terms of managing the connections and
keeping track of which notes are up and
which no is the primary so for this
lesson will cover how to start a
connection to a replica set in the
nodejs driver so the way you start a
connection is you actually give the
driver connection string just like
before with the host names and ports of
the nodes that you want to connect to so
in this case we could give host names
and ports of all three nodes you can
actually give them in a comma separated
list or you could just give the hostname
and port of a single node and the driver
would automatically detect that it's a
replica set and discover the rest of the
notes so let's just take the quick look
at an example of how this will work in a
real application so before we start we
need to start our three node replica set
so here I'm going to start my first
replica set node I'm going to give it
the port 30,000 1dd path data dbrs one
so that one started so let's start our
next node I'm going to start this one on
port 30,000 to still on localhost give
it a different data path and finally
we'll start our third note of a replica
set give it port 3000 3427 I connect we
need to configure our replica set so
let's connect to local host 30,000 won
and you see we aren't actually a replica
set yet I try our status we get an error
so it's around RS not initiate to
actually start our replica set alright
so we're starting up our new replica set
the next thing we want to do is actually
add the other two notes
this is just sort of a recap of the
other lessons but just want to go over
it one more time so I happen to know
that the host name is education dot
local and the port is 30,000 two of the
first node and then for the next one the
port is 30,000 three same hostname so
now we've added all our notes to our
replica set if we clear this look at RS
status we can see that we have all of
our nodes connected we have our primary
and we have the two secondaries starting
up alright so we've started our replica
set now let's take a look at the
application that we're going to use to
connect to our replica set using the
nodejs driver so this might look
familiar we still use our mangu client
we're still using the same functions the
only real difference here is that
instead of giving a single hostname and
port we're actually giving a comma
separated list i'm using this plus
operator to concatenate the strings just
so we don't have one long string
wrapping around the window was a little
too small but basically all I'm doing is
passing a singles connection string to
the Kinect function giving a call back
exactly the same way as I did with a
single node and I'm just giving this
comma separated list of replica set
members instead note that I could also
just give one member and it would still
be able to connect assuming that member
was up if that member was not up then it
would not be able to find the rest so
down here we're using this DB object
just like we did with the single node
connecting the repple connection
inserting a document and down here we're
connecting the ruffle collection and
we're finding one document and we should
find the document that we just inserted
then we're logging the document and
closing the database so let's just run
this example all right so we just ran
our example and you can see that we've
inserted our document and we found it
successfully and this was all connected
to a replica set so what actually
happened here is that we gave it the
connection string with three peplum set
nodes the driver automatically connected
figure out which one is the primary
figured out what the secondaries were
got the status of everything figured out
exactly where to send are right now read
and all of that happened behind the
scenes so that our application
have to have any of the logic of dealing
with all the complexity of the added
connections so that's how you connect to
a replica set in nodejs alright so this
is the quiz for connecting to a replica
set from the dont je s driver the
question is if you leave a replica set
node out of the seed list within the
driver what will happen is it the
missing node will not be used by the
application so that the missing node
will be discovered as long as you lift
at least one valid note is that the
missing node will be used for reads but
not for rights or is it the missing node
will be used for rights but not for
reads


---

### failover

https://youtu.be/15jBQRolLV4

alright so now let's talk about replica
set failover in the know Jas driver so
just to recap when you're sending rights
or operations from the driver rights
will go to the primary so all rights
will go to the primary node in a replica
set the reeds by default will go to the
primary although you can configure them
to go elsewhere which will actually
cover in later sections so the question
now is what happens when a node in this
replica set goes down because that's
actually the whole purpose of the
replica set you have copies of your data
because you want high availability and
sort of more durability so the question
we have now is what actually happens in
that situation where this node just gets
blasted off the face of the earth how do
we need to respond and how does the
driver respond so it turns out in the
nodejs driver what actually happens is
that the rights that come in from our
application and the reads that can't yet
be sent to a primary but that need to be
sent to a primary are buffered in the
driver so from the application
perspective you see that you're
dispatching all these reads and writes
you just don't see them complete yet so
the driver will actually offer these
until the failover completes and you
have a new primary then it will send all
the operations then the client
application will get all the responses
and you'll see all the writes and reads
complete as they normally would so let's
look at an example of how this looks in
application code so this is the example
we're going to be using to demonstrate
this failover behavior that I was just
talking about and you notice that most
of this is the same we still do normal
insert call still have this connection
string here what we're doing a little
bit differently is using this set
timeout function so what the settimeout
function does is it actually registers
the callback you give it and calls it
after this timeout expires so this
saying call the function insert document
which is the function we're already n
after one second or a thousand
milliseconds so what this code will
actually do is it'll come down here this
is just a declaration so nothing's being
executed yet but then we get down here
and we call insert document which calls
this function which will dispatch an
insert and just continue on down here
because we're actually doing this
asynchronously we don't have to wait
until we get a response so we
immediately come down here and say
dispatched insert and then register this
function to be called again in 1,000
milliseconds so the result will be one
insert every second because this
function will get called once register
itself to be called again in one second
it will get cold again register itself
to get cold again in one second get
called again and so on and so on so this
is effectively like a for loop with a
sleep of one second where we're just
calling into it repeatedly one
difference is that we don't have to wait
for a response from insert before we
sleep so we don't have to do any
complicated logic like say you know how
long do we need to sleep because we
actually took half a second to do the
insert and get the response let's sleep
only for half a second this one's a
little simpler in that respect because
we can just sleep for a second and
because we're not waiting for a response
there aren't as many variables that we
have to think about because we don't
have to factor in the time it took to
get a response from this insert we could
just sleep for a second and get pretty
close to one insert for a second so
that's one difference is this
asynchronous call here the other
difference is this is not actually you
know the same execution context this is
actually just registering a callback
it's not like we have a single thread
going to sleep so one side of the fact
is that if we call insert document we
can actually call it twice what that'll
do is call this function twice it'll
register itself again twice so in the
next second it will get called twice
again and called twice again and call
twice again and so on another thing you
can do that's even crazier is you can
put set timeout this line here twice now
what that'll do is just exponentially
increase the number of times this
function is called so it'll get called
the first time it will register itself
twice then it'll get called twice and
register itself twice per call so to
register itself four times in the next
second then eight times in the next
second then 16 times and 32 times that
rapidly grow in powers of 2 until you're
inserting
thousands of documents a second so
that's kind of an interesting side
effect of this I'd recommend you know
taking some time to play with this
function you copy this line or this line
over a few times and just see what
happens it's an interesting result so
this is basically the example we're
going to use to demonstrate failover all
you really need to know is that it's
basically a for loop that's dispatching
insert operations and we should see the
responses as they come in because this
is an asynchronous program and we're
inserting documents that have increasing
document numbers so let's run this
application and see what happens alright
so we're running our application and as
expected we see dispatched insert before
we get response so this is the log
message saying that we sent our insert
out and this is the log that we have in
our insert callback that we actually
received the document so let's take a
look at what happens when we do the
failover so first let's connect to local
host 30,000 won and conveniently we see
that it says the primary in the prompt
so we don't really have to check we just
know that this is the primary so let's
actually just completely shut this
server down it's called DB shutdown
server so we actually have to be an
admin I don't have authentication so I
can just use the admin database and then
shut down the server so now we've shut
down our server we look over here we see
some interesting side effects we don't
see any errors that would result from
our callback being called we just see
this dispatched insert message so let's
go back up there and take a closer look
so the interesting thing to note here is
that we dispatch all these inserts we're
still dispatching and insert per second
we don't get any responses we also don't
get any errors there's nothing calling
back to our call backs we're just
dispatching these operations and they
seem to just be taking longer than usual
but then we look down here once the
failover completes we see this huge
batch of operation suddenly come through
so at this point the failover was done
the driver sent out all the operations
that had buffered when we were sending
out one per second
and you kind of get these operations
back in one big block so that's what
happens in the failover case that the
driver actually just buffers the
operations you're sending so they just
seem to take a little longer than usual
and then when the election is done the
driver will send all the operations and
you'll receive callbacks for the results
as you normally would just as if the
operation took longer than usual so
that's pretty much all you need to know
about dealing with failover and nodejs
is that the driver does a lot of it for
you so you really don't have to worry
too much about writing code in your
application to deal with this situation
all right so let's take a quiz on
failover in nodejs all right so the
question is what will happen if this
insert occurs during a primary election
so if you make this call while an
election is happening what will happen
is it the insert will immediately
succeed and the callback will be called
is that the insert will fail with an
error is that the insert will be
buffered until the election completes
then the callback will be called after
the operation is sent and a response is
received or is it the callback will be
called first then the insert will be
buffered until the election completes


---

### m101 23 write concern revisited

https://youtu.be/5VyXyccjS3k


---

### Read Preferences

https://youtu.be/mhHaS4ZWzZE

You can configure your applications via the drivers to read from secondary nodes within a replica set. What are the reasons that you might not want to do that? Check all that apply.

Answer
In some ways, this question goes a bit beyond the lecture. It discusses what can go wrong, particularly for a non-recommended deployment. That said, this list of answers includes things that people do try to implement from time to time, so we want to make sure you're aware of the dangers.

Answers:

Reading from a secondary prevents it from being promoted to primary.
False.
Reading from a secondary does not directly affect a secondary's ability to become primary, though if the reads caused it to lag on writes and fall behind on the oplog, that might make it ineligible until it is able to catch up. Here's a note on replication lag.
If the secondary hardware has insufficient memory to keep the read working set in memory, directing reads to it will likely slow it down.
True.
This could really go either way. If the secondary has excess capacity, beyond what it needs to take writes, then directing reads to it would cause it to work more, but perhaps it would still be able to keep up with the oplog. On the other hand, if the primary is taking writes faster than the secondary can keep up, then this scenario would definitely slow it down.
Generally, your secondary should be on the same hardware as your primary, so if that's the case, and your primary would be able to keep up with the reads, then this shouldn't be a problem. Of course, if your primary can handle both the read and write loads, then there's really no compelling reason to send the reads to the secondary.
If your write traffic is great enough, and your secondary is less powerful than the primary, you may overwhelm the secondary, which must process all the writes as well as the reads. Replication lag can result.
True.
This is a design anti-pattern that we sometimes see.
A similar anti-pattern occurs when reads are routed to the primary, but the secondary is underpowered and unable to handle the full read + write load. In this case, if the secondary becomes primary, it will be unable to fulfill its job.
You may not read what you previously wrote to MongoDB on a secondary because it will lag behind by some amount.
True.
This is pretty straightforward. Unless you are reading from the primary, the secondary will not necessarily have the most current version of the documents you need to read.
Whether this is a problem or not depends on your application's requirements and business concerns, so it goes a bit outside the scope of development.


by default MongoDB reads and writes both
go to the primary now here's a three
node replica set and as usual will mark
the nodes as ms and you have your
application a called app and this
application of course has a connection
to the primary and the driver probably
also maintains in fact does maintain
connections to the secondary nodes as
well and by default your reads and your
rights are going to go to your primary
and that's a good thing because as a
result you're going to read what you
wrote because with replication and this
is replication it may be the case that
if you did a read to a secondary and had
written into the primary that if the
right had not yet propagated to the
secondary you may not read what you
wrote which makes it harder to reason
about your programs nevertheless if you
would like to read from secondaries in
MongoDB we do allow that you always have
to write to the primary but you can read
from the secondaries and we call this
the read preference and there are
several different options for that so
here they are they are primary which is
the default which means i want to read
from primary primary preferred and that
means i wanna me from the primary but
the primary is not down i'll take the
secondary then there's secondary which
means i want to rotate my reads to my
secondaries and only my secondaries
don't send my reads to the primary and
then there's secondary preferred and you
can imagine what that does it prefers
the secondaries but it could also send
it to the primary if there is no
secondary available and then there's
also something called nearest and
nearest well tell the driver to send it
to the mongo d that seems to be the
closest in terms of ping time and i
believe as a default anything within 15
milliseconds of that time is also
considered closest it will also send it
to that node and then there's also
within nearest there's a concept of
using a tag set which is a data center
awareness idea that you could mark
certain nodes as being part of a certain
data center and so you let's say if
you're in New York you want your reads
to go to the New York data center I'm
not going to go over how that works but
that's also possible and you can read
about the documentation if you want so
as I said by default the read preference
is primary what
just send your reads only to your
primary it's also that way inside the
shell which is why when I failover the
primary and I wind up connected to the
secondary in the shell and I try to read
a collection it says all you can't do
that and when you say RS that's slave
okay what you're saying is it's okay for
me to send it to the secondary I'm
guessing it probably uses primary
preferred at that point as a read
preference but essentially since the
shell is only connect into one Mongo d
it probably doesn't matter but it allows
the reeds to go to that secondary okay
now if you decide to read from the
secondary you're not going to have a
strongly consistent read you're going to
have what's called an eventually
consistent read which is that eventually
the data will show up on the secondary
but it won't be necessarily data that
you wrote all right now let's go and
look at a very small program that reads
using read preference secondary this
program is going to connect using mongol
client and here's a seed list and it's
going to set the read preference right
here read pref to pymongo dot read
underscore preferences that read
preference secondary if you look at the
documentation at AP item on BB org and
you click through Python you can see
where these are listed inside the API
and this simple program is going to just
go through and find a thousand things in
the things collection this is the in the
m101 database you've been using this
collection for a while in this unit and
it's going to print out the documents at
finds and you'll notice it's not
actually catching any exceptions but yet
because it's reading from secondary it's
still going to be robust within the face
of the auto reconnect so let me show you
so let's go through and run this program
and it's reading these documents and now
let me step down the program Mary all
right I step down the primary now I'm a
secondary and I go here and you'll see I
never skipped a beat it continued to
work and the reason that can you need to
work is that MongoDB was allowed to read
from secondaries and so actually not
allowed to I said only read from
secondaries and so the fact that the
primary failed over was not a problem I
wouldn't recommend that you don't catch
exceptions in your read code but i just
wanted to illustrate that the failover
was not a problem in this particular
case all right now it is time for a quiz
now you can configure your applications
via the drivers to read from secondary
node than a replica set one of the
reasons you might not want to do that
check all that apply now you notice that
I didn't talk about this in
the lesson so you have to figure it out
and think about it and then we'll
discuss it in the answer

---

### m101 27 review implications of replication

https://youtu.be/K5ISnvYKQFQ

**Lecture Notes**
One thing to remember is that the driver will check, upon attempting to write, whether or not its write concern is valid. It will error if, for example, w=4 but there are 3 data-bearing replica set members. This will happen quickly in both the Java and pymongo drivers. Reading with an invalid readPreference will take longer, but will also result in an error. Be aware, though, that this behavior can vary a little between drivers and between versions.

---

### m101 29 intro to sharding

https://youtu.be/_GfDqa1qRl0

---

### Building a Sharded Environment

https://youtu.be/dn45G2yw20A

in this lesson we're going to go over
how to build a shorted environment this
is not the type of thing you typically
do as a developer it's probably more of
a DBA task but if you want to practice
with sharding and set up a shorted
environment on your own pc or your own
laptop then it's convenient and how to
do it and we're going to give you some
scripts to do it so it isn't as
difficult as it first seems so we're
going to build a short environment with
three shards and the each of these
shards is going to be a replica set with
three nodes so there's going to be three
Mongo denotes on each of these little
M's in them and on these three shards
which will label s0 s1 and s2 this is
where your data will live and your
application right here your app will go
through a router called a Mongo s router
is your Mongo s and you can have more
than one of these but in our example
we're just going to have one and it's
not unusual the way we're going to do it
is to have Mongo s listen on a standard
port 20 70 17 and then since we're going
to be setting this up all in the same
computer we're going to be reusing a lot
of port numbers so we're going to have
these Mongo DS listen on non-standard
ports so they can communicate now each
of these is a replica set so this is a
replica set right here and this is a
replica set and this is a replica set
now I'm sorry from these servers you're
also going to need some config servers
now the config servers typically you
have three of them although you can have
as few as one and we're going to show
you three because it's a standard way to
do it and each of these config servers
holds the information about the way your
data is distributed across these shards
so let's say you have a large collection
of people let's say millions of people
that are members of your website and
there's a user ID you could decide that
you want a certain user to live on a
certain shard you can take the users
collection and you can shard it across
these different servers now the way it
works is that there's this concept of a
chunk in sharding and the chunk of data
which holds a bunch of documents is all
mapped to a particular
chard and it's these config servers that
know the way the chunks are assigned to
the shards now the config service
themselves they're not a replica set but
they do a two-phase commit to make any
changes and it happens all in the
background that if a collection is
shorted the config servers keep track of
where document Maps the shards and the
Mongo s asks to config servers for that
information just two ways to shard
mongodb one is called a range based and
the other is hash based now you could
look this up in the documentation to
learn more about it but range based
takes a range of documents so for
instance if you had user ID then it
might take the user ID 0 through 100 and
say all of those map to a particular
shard and that shard lives let's say in
s1 in short one and maybe 10 12 to 0 1
in this chunk and it all is stolen shard
to now that makes range based queries
very efficient because if you do a query
with a range of user IDs then they map
to a particular shard and it's efficient
to get the data now the other way to
shard is hash based which i'm not going
to show you which runs a hashing
algorithm over the shard key now the
short key is the key which maps a
document to a shard and every document
must contain a shard key so if we decide
for instance that you want to take the
users collection and chard on the user
ID then you have to specify the user ID
for all the documents otherwise mongo d
wouldn't know where to put that document
but it doesn't need to be unique so for
instance doesn't need to be a primary
key but there needs to be an index on
that key and every document must contain
the key alright so this is how it works
and mongo s is going to establish
connections to these various shards and
mongo s kind of looks like a driver in
that it's maintaining connections with
these shards each one which is a replica
set and it can handle the failover as
needed within the shard for instance
this might be the primary and this might
be the primary and this might be the
primary and then these might be
secondaries and mongo s can handle that
and your app which is using pi Mongo is
connect
to the Mongo s server so I've written a
script to set up the Charlotte
environment and I'm going to show it to
you and then I'll show you what it looks
like once you do it alright so let's go
over this script now you can download
this script yourself and run it on your
computer there's also a version of it
for Windows users it's a dot bat file
this script is called an it underscores
charted underscore env SH and it's a
shell script kind of an old-school shell
script we're going to go over it line by
line so you can see what it does so the
first thing it does is it kills all the
existing manganese and manga wes's on
your server you can see we're here it's
doing that and then after that it's
going to remove the slash data / config
and celeste data / our directory because
we're going to put the data in data /
shard and data / config the config
servers are going to have directories
within the data / config directory and
each shard is going to have a bunch of
sub directories in / data / 0 1 and 2 I
believe let's go through it the first
thing we're going to do is we're going
to start a replica set as shard 0 and do
that we're going to create these
directories data / shard 0rs0 RS 1 and
RS 2 and then we're going to start our
three Mongo d nodes we're going to tell
them that they're all part of the same
replica set called s0 we're going to
just give a log paths the unique log
files it's going to put them in the
directory that I'm in these are the data
directories we talked about that's going
to listen on these non-standard ports
3701 7-330 7019 and it's going to fork
and it's also going to know that it's a
shard server and also that it's going to
be using some small files this is an
nmap option to tell MongoDB not to
allocate very large files at the outset
if you're if you're just running in
development that's going to sleep for
five seconds to let the replica set come
fully up and then it's going to
configure our replica set now the way it
configures replica set this is an
old-school a shell technique it's called
a here file it's running Mongo minus
port 30 70 17 and then from there it's
going to read all this into standard
input so it's going to load a config up
and the config is going to be that id0
370 170 180 190 the same ports of the
replica set we just created notice that
we didn't need to connect to the primary
to initiate the replica
because before you create the replica
set configuration there is no primary so
therefore it doesn't matter which of
these servers you connect to so we
decided this neck 237 017 for this part
so now the shore 0 replica set us up and
running which is nice we're going to do
the exact same thing for shard one again
you'll notice different port numbers
right here and we're going to go to
sleep and then we're going to kectu one
of the hosts in chard one and configure
it as a replica set and then we're doing
the same thing for shard too we're going
to create three Mongo DS putting them in
these separate directories the data / r2
directory you can see their sub
directories RS 0 RS 1 and rs to these
are different parts of the replica set
we've chosen different ports up in the
57,000 range here and now we're going to
initiate this replica set all right
great now we need to start our config
servers so for this we're going to
create the directories for the config
servers under / data / config a B and C
and then we're going to start three
Mongo DS each one of them with a DB path
of config giving it a port telling it to
fork and then also telling it that it is
a config server and telling it again to
use small files so now the config
servers are up and running and the three
shores are up and running but wait there
bring it all together so we're starting
a single Mongo s and we're starting this
manga less the seedless from among OS is
the config servers so we're telling it
the config servers live at localhost 50
70 40 41 and 42 so now Mongo s knows
about the config servers which is good
and the config servers know about my OS
but we need to wait a while we're going
to wait a full 60 seconds for this thing
to qui ass otherwise sometimes things
don't work well so we did that and at
this point the entire thing is up and
running except that the Mongo s and the
config servers don't know about the
shards because we told them on iOS about
these config servers but we didn't
actually tell the Mongo s or the config
servers about the replica set you'll see
there's no mention we create the config
service of what replica sets or it
shards it's going to connect to so
that's the final part so now we're going
to another hero file right here and
we're going to run Mongo the Mongo shell
program it's going to connect to 2701
seven which is the port at Mongo s is
listening on which is our router and
then it's going to say add chart s0 at
localhost 37 017 add chart s1 and add
shard s2 and at this point we are now
running a sharded system we're going to
enable sharding on the database called
school because i'm going to put
something in the school database and
we're going to shore the collection
students which is going to hold our
student grade information that you're
familiar with we're going to show it on
student ID now normally when you when
you short a collection there has to be
an index on what you're starting on the
start key but if the collection is brand
new and it is in this case it will
create the index so that's going to
create the index on student ID so I ran
this in the background I won't take our
time to run it in front of you but I ran
it a few minutes ago in this computer
and I also loaded the student data so
let's take a look at that so I'm
connecting via Mongo and you'll notice
that for the first time we're seeing
that it's not connecting to a Mongo d
its Nick into a Mongo s router and now
first thing I'm going to do is I'm going
to get the status of my system so SH
status gives you the status of a shorted
system and get some information tells
you that there are three shards this is
unfortunately wrapping it because it's
big font and it tells you that s0 lives
at 37 017 and actually it discovered all
the hosts in each of the replica sets
that's very nice and we can see here
that it tells us that the school
database is in fact shorted and the
shard key is student ID and it starts
talking about the chunks and the range
of chunks and you can see that right
here it says that from let's see student
ID 02 student ID 1 is on s0 student ID
22 student ID 3490 is on s0 3497 to 77
78 that's on s1 and looks like this is
on s1 and looks like min ki to one is on
s2 so that's the way this data is
shorted and if we use the school
database and then we do d b dot students
not get indexes you can see that there's
actually an index on student ID although
we never added one the system did this
automatically when we shorted it when it
was empty which is very nice now if we
look at data d b dot students dot find
that pretty you can see it looks like
the data we were looking at in some of
the earlier lessons in some of the
earlier units all right so let's do some
explain commands and see how they differ
now that running on a shorted system so
let's do d b dot students dot explain
dot find and let's use an empty
predicate and then limit the 10 and see
what it says so basically we're going to
try to find all the documents alright so
if we run that query and we go to the
top here a little hard to track here we
are you can see that it's doing a shard
merge and that it's hitting shard 0 and
it looks like it did a collection scan
in chard 0 and it's also running against
chard one it's going to have to hit all
the shards for this it's not because it
doesn't know the answer to this query
it's a little hard to read this data but
let me see if I can find where it says
that all right so you can see here it
says it's running shard 0 ah shard 1 and
chard two are all evolved with this
query now what if we did a query where
it could go to a single shard like
student ID let's say 1,000 if we explain
that query that should only go to a
single short let's see let's see if
that's true so in that case it says the
winning plan for this explain was a
single shard it went to s 0 and it was
able to use index which is fantastic
uses index scan on the student ID index
so that's going to be a pretty fast
query alright so that gives you a flavor
of how sharding works and I hope that
you'll download these scripts and that
you will try sharding yourself on your
computer all right now it is time for a
quiz if you want to build a production
system with two shards each one a
replica set with three nodes how many
Mongo d processes must you start to six
seven or nine answer it here

