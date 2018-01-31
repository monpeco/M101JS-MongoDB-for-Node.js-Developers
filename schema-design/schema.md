### MongoDB Schema Design


https://youtu.be/AABYJM12qF4

* Support rich documents
* Pre-join the data - Embedding documents
* No joins
* No constrains
* Atomic operations
* No declared Schema

okay welcome back this week we're going
to talk about Mongo DB schema design if
you're coming from the world of
relational databases you know that there
is a best ideal way to design your
schema which is to keep it in the third
normal form now you can keep data in the
third normal form in MongoDB and we'll
talk a little bit about the third normal
form in the next lesson but in Mongo it
turns out that it's more important to
keep the data in a way that's conducive
to the applications using the data so
you think about your application data
patterns you think about what pieces of
data are used together what pieces of
data are used mostly read-only what
pieces of data are written all the time
and then we're going to organize our
data within MongoDB
to specifically suit the application
data access patterns and that's a bit
different from the world of relational
where instead you try to keep the data
in a way that's agnostic to the
application all right so let's go over
some of the basic facts about MongoDB
just to remind you of them as we talk
about schema design the first is that
MongoDB supports rich documents and by
rich documents I mean that it's not just
tabular data in MongoDB you can store an
array of items or a value for a certain
key can be an entire another document
and this is going to allow us to pre
join data for fast access and that's
important because as you know MongoDB
doesn't support joins directly inside
the kernel instead if you wanted you to
join you're gonna have to join in the
application itself and of course the
reason we do this is because that joins
are very hard to scale and we want the
system to be high performance so as a
result of this you need to think ahead
of time about what data you want to use
together with other data and if it's
possible you might want to embed it
directly within a document and we'll
talk about how you how you do that
the next is that there are no
constraints now if you come from the
world of relational you might remember
that you can have a foreign key
constraint and asked that a at rabida of
one row in a table would form a foreign
key into another table and we don't have
that in MongoDB but it's gonna turn out
it's not as important as you might think
because of embedding embedding is going
to make that a little less important
than what
wize be alright we're gonna think about
atomic operations we don't support
transactions but we do support atomic
operations within MongoDB and within one
document so we're gonna think about how
to organize our data to support atomic
operations if we need them within our
application and the final thing is that
there is no declared schema or within
MongoDB but there's a pretty good chance
that your application is going to have a
schema and by have a schema I mean that
every single document in a particular
collection is probably going to have a
pretty similar structure and there might
be some small changes to that structure
depending on different versions of your
application but mostly each document in
the collection is gonna have a similar
structure and even though it's not
declared ahead of time it's important to
think about that structure so that the
data scheme itself supports all the
different features of your application
alright so let's have a first quiz the
first quiz for schema design is what's
the single most important factor in
designing your application schema within
MongoDB is it making the design
extensible making it easy to read by a
human matching the data access patterns
of your application or keeping the data
in third normal form and and just check
one of those


---



